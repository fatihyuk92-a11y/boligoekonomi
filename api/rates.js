// /api/rates.js — Vercel serverless function
// Fetches current policy rates from ECB, Federal Reserve (via FRED), and Danmarks Nationalbank (via DST).
// Results are cached at the edge for 1 hour to minimize API calls.

export const config = {
  runtime: "edge",
};

// Cache headers: serve from CDN for 1 hour, allow stale for 24h while revalidating
const CACHE_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

/* ───────── ECB ───────── */
// ECB Data Portal SDMX API — no key required.
// We fetch the latest observation of each policy rate.
const ECB_SERIES = {
  // Deposit Facility Rate — the rate most relevant for euro area monetary policy since Sep 2024
  dfr: "FM/D.U2.EUR.4F.KR.DFR.LEV",
  // Main Refinancing Operations rate (Fixed)
  mro: "FM/D.U2.EUR.4F.KR.MRR_FR.LEV",
  // Marginal Lending Facility
  mlf: "FM/D.U2.EUR.4F.KR.MLFR.LEV",
};

async function fetchECB() {
  const results = {};
  for (const [key, series] of Object.entries(ECB_SERIES)) {
    try {
      const url = `https://data-api.ecb.europa.eu/service/data/${series}?lastNObservations=2&format=jsondata`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`ECB ${series}: ${res.status}`);
      const data = await res.json();
      // SDMX JSON structure: observations are at dataSets[0].series.0:0:0:0:0:0.observations
      const ds = data.dataSets?.[0];
      const seriesObj = ds?.series?.[Object.keys(ds?.series || {})[0]];
      const obs = seriesObj?.observations || {};
      const timeDim = data.structure?.dimensions?.observation?.[0]?.values || [];
      const sortedKeys = Object.keys(obs).map(Number).sort((a, b) => a - b);
      const latestIdx = sortedKeys[sortedKeys.length - 1];
      const prevIdx = sortedKeys[sortedKeys.length - 2];
      const latestVal = obs[latestIdx]?.[0];
      const prevVal = obs[prevIdx]?.[0];
      const latestDate = timeDim[latestIdx]?.id;
      const prevDate = timeDim[prevIdx]?.id;
      results[key] = {
        value: latestVal,
        date: latestDate,
        previous: prevVal,
        previousDate: prevDate,
        change: latestVal !== undefined && prevVal !== undefined ? +(latestVal - prevVal).toFixed(2) : null,
      };
    } catch (e) {
      results[key] = { error: e.message };
    }
  }
  return results;
}

/* ───────── Federal Reserve via FRED ───────── */
// FRED requires a free API key. Set FRED_API_KEY in Vercel env vars.
// Without key, returns fallback data.
async function fetchFed() {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return {
      fedFunds: { error: "FRED_API_KEY not configured — register free at https://fred.stlouisfed.org/docs/api/api_key.html" },
    };
  }
  try {
    // DFEDTARU = Upper target of the federal funds rate range
    // We fetch a longer window to safely find recent non-empty observations
    // (FRED returns "." for non-business days)
    const series = "DFEDTARU";
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${apiKey.trim()}&file_type=json&sort_order=desc&limit=30`;
    const res = await fetch(url);
    if (!res.ok) {
      // Try to capture the FRED error message for easier debugging
      let detail = "";
      try {
        const errText = await res.text();
        // FRED returns errors in either XML or JSON
        if (errText.includes("error_message")) {
          const match = errText.match(/error_message["\s:]+([^"}\n]+)/);
          if (match) detail = ` — ${match[1].trim()}`;
        } else {
          detail = ` — ${errText.slice(0, 120)}`;
        }
      } catch {}
      throw new Error(`FRED API returned ${res.status}${detail}`);
    }
    const data = await res.json();
    const obs = (data.observations || []).filter(o => o.value !== "." && o.value !== "" && o.value !== null);
    if (obs.length === 0) {
      return { fedFunds: { error: "No observations returned from FRED" } };
    }
    const latest = obs[0];
    // Find previous observation with a DIFFERENT value (so "change" is meaningful)
    const latestVal = parseFloat(latest.value);
    let prev = null;
    for (let i = 1; i < obs.length; i++) {
      const v = parseFloat(obs[i].value);
      if (v !== latestVal) {
        prev = obs[i];
        break;
      }
    }
    return {
      fedFunds: {
        value: latestVal,
        date: latest.date,
        previous: prev ? parseFloat(prev.value) : null,
        previousDate: prev?.date,
        change: prev ? +(latestVal - parseFloat(prev.value)).toFixed(2) : null,
        note: "Upper bound of federal funds target range",
      },
    };
  } catch (e) {
    return { fedFunds: { error: e.message } };
  }
}

/* ───────── Danmarks Nationalbank via DST Statistikbank ───────── */
// MPK3 table contains the four Nationalbank policy rates (monthly end-of-period values).
// No API key required.
async function fetchNationalbanken() {
  try {
    const body = {
      table: "MPK3",
      format: "JSONSTAT",
      variables: [
        { code: "TYPE", values: ["*"] },
        { code: "Tid", values: ["*"] },
      ],
    };
    const res = await fetch("https://api.statbank.dk/v1/data", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`DST: ${res.status}`);
    const data = await res.json();
    // JSON-stat format: dataset.value array indexed by dimension
    const ds = data.dataset || data;
    const values = ds.value || [];
    const dims = ds.dimension || {};
    const typeDim = dims.TYPE?.category;
    const timeDim = dims.Tid?.category;
    const typeIdx = typeDim?.index || {};
    const timeIdx = timeDim?.index || {};
    const typeLabels = typeDim?.label || {};
    const timeLabels = timeDim?.label || {};
    // Type codes: K1=Diskontoen, K2=Foliorenten, K3=Indskudsbevisrenten, K4=Udlånsrenten
    // We want the most recent month with non-null values for each
    const typeCodes = Object.keys(typeIdx);
    const timeCodes = Object.keys(timeIdx).sort(); // ascending
    const nTimes = timeCodes.length;
    const nTypes = typeCodes.length;
    const result = {};
    for (const code of typeCodes) {
      const ti = typeIdx[code];
      let latest = null, latestDate = null, prev = null, prevDate = null;
      for (let i = nTimes - 1; i >= 0; i--) {
        const tCode = timeCodes[i];
        const flatIdx = ti * nTimes + timeIdx[tCode];
        const v = values[flatIdx];
        if (v !== null && v !== undefined) {
          if (latest === null) {
            latest = v;
            latestDate = timeLabels[tCode] || tCode;
          } else if (prev === null && v !== latest) {
            // only consider a "previous" if the value actually changed
            prev = v;
            prevDate = timeLabels[tCode] || tCode;
            break;
          }
        }
      }
      const labelKey = (typeLabels[code] || code).toLowerCase();
      let mappedKey = code.toLowerCase();
      if (labelKey.includes("diskonto")) mappedKey = "diskonto";
      else if (labelKey.includes("folio")) mappedKey = "folio";
      else if (labelKey.includes("indskud")) mappedKey = "indskud";
      else if (labelKey.includes("udlån") || labelKey.includes("udlan")) mappedKey = "udlaan";
      result[mappedKey] = {
        value: latest,
        date: latestDate,
        label: typeLabels[code],
        previous: prev,
        previousDate: prevDate,
        change: latest !== null && prev !== null ? +(latest - prev).toFixed(2) : null,
      };
    }
    return result;
  } catch (e) {
    return { error: e.message };
  }
}

export default async function handler(req) {
  try {
    const [ecb, fed, nb] = await Promise.all([
      fetchECB(),
      fetchFed(),
      fetchNationalbanken(),
    ]);
    return new Response(
      JSON.stringify({
        fetchedAt: new Date().toISOString(),
        ecb,
        fed,
        nationalbanken: nb,
      }),
      { status: 200, headers: CACHE_HEADERS }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
