import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const C = {
  bg: "#0d1b2e", bgD: "#0a1624", card: "#162540", cardH: "#1e3254",
  border: "#1f3352", gold: "#c9a84c", goldL: "#e8c97a",
  text: "#e8e4dc", muted: "#7a8fa8",
  ok: "#4caf7d", bad: "#e05c5c", warn: "#f0a04b",
};

// Official meeting dates for 2026 — sourced from ECB & Federal Reserve calendars
const MEETINGS_2026 = [
  ["29. jan 2026", "Fed (FOMC)", "Pengepolitisk beslutning", "fed"],
  ["5. feb 2026", "ECB", "Pengepolitisk beslutning", "ecb"],
  ["18. mar 2026", "Fed (FOMC)", "Beslutning + projektioner", "fed"],
  ["19. mar 2026", "ECB", "Beslutning + projektioner", "ecb"],
  ["29. apr 2026", "Fed (FOMC)", "Pengepolitisk beslutning", "fed"],
  ["30. apr 2026", "ECB", "Pengepolitisk beslutning", "ecb"],
  ["17. jun 2026", "Fed (FOMC)", "Beslutning + projektioner", "fed"],
  ["18. jun 2026", "ECB", "Beslutning + projektioner", "ecb"],
  ["29. jul 2026", "Fed (FOMC)", "Pengepolitisk beslutning", "fed"],
  ["10. sep 2026", "ECB", "Beslutning + projektioner", "ecb"],
  ["16. sep 2026", "Fed (FOMC)", "Beslutning + projektioner", "fed"],
  ["29. okt 2026", "ECB", "Pengepolitisk beslutning", "ecb"],
  ["4. nov 2026", "Fed (FOMC)", "Pengepolitisk beslutning", "fed"],
  ["10. dec 2026", "ECB", "Beslutning + projektioner", "ecb"],
  ["16. dec 2026", "Fed (FOMC)", "Beslutning + projektioner", "fed"],
];

export default function MarketsPage() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rates");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRates(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadRates(); }, []);

  // Find next upcoming meeting (relative to today)
  const today = new Date();
  const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11 };
  const upcomingMeetings = MEETINGS_2026.filter(([date]) => {
    const m = date.match(/(\d+)\.\s+(\w+)\s+(\d+)/);
    if (!m) return true;
    const d = new Date(parseInt(m[3]), monthMap[m[2]], parseInt(m[1]));
    return d >= today;
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, position: "relative", overflow: "hidden" }}>
      {/* Background grid */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${C.border}33 1px, transparent 1px), linear-gradient(90deg, ${C.border}33 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* HEADER — matches LandingPage */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,27,46,0.8)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏠</div>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1 }}>BoligØkonomi</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Analyse · Simulation · Uddannelse</div>
            </div>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link to="/markeder" style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>Markeder</Link>
            <Link to="/app" style={{
              padding: "9px 18px",
              background: C.gold, color: C.bg,
              borderRadius: 8, fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.goldL; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = "translateY(0)"; }}>
              Prøv platformen →
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "60px 28px 80px", zIndex: 1 }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 40 }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", background: `${C.gold}15`, border: `1px solid ${C.gold}33`, borderRadius: 100, fontSize: 10, color: C.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, background: C.gold, borderRadius: "50%", boxShadow: `0 0 8px ${C.gold}` }} />
              Officielle data
            </div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(36px, 4.5vw, 52px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 14, fontWeight: 700 }}>
              Markeder & <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>Centralbanker</span>
            </h1>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, maxWidth: 580 }}>
              Pengepolitiske renter offentliggjort af Den Europæiske Centralbank, Federal Reserve og Danmarks Nationalbank. Værdier gengives fra de officielle statistik-API'er uden bearbejdning.
            </p>
          </div>
          <button
            onClick={loadRates}
            disabled={loading}
            style={{
              padding: "12px 22px",
              background: loading ? C.border : `${C.gold}1a`,
              border: `1px solid ${C.gold}55`,
              borderRadius: 10,
              color: C.gold,
              cursor: loading ? "wait" : "pointer",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 600,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = `${C.gold}2a`; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = `${C.gold}1a`; }}
          >
            {loading ? "Henter…" : "🔄 Opdater data"}
          </button>
        </motion.div>

        {/* Disclaimer */}
        <div style={{ padding: "14px 18px", background: `${C.warn}0d`, border: `1px solid ${C.warn}33`, borderLeft: `3px solid ${C.warn}`, borderRadius: 8, marginBottom: 32, fontSize: 12, color: C.muted, lineHeight: 1.65 }}>
          ⚠️ <strong style={{ color: C.warn }}>Ikke finansiel rådgivning.</strong> Data hentes fra tredjepartskilder (ECB Data Portal, Federal Reserve / FRED og Danmarks Statistik) og gengives uden bearbejdning eller fortolkning. Værdier kan være forsinkede op til 24 timer eller mere afhængigt af kildens opdateringsfrekvens. Platformen er ikke ansvarlig for forsinkelser, fejl eller mangler i data. Indholdet er udelukkende til oplysning og må ikke anvendes som grundlag for økonomiske dispositioner. Bekræft altid satser direkte hos pågældende centralbank.
        </div>

        {/* Loading */}
        {loading && !rates && (
          <div style={{ textAlign: "center", padding: 80, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 30 }}>
            <div style={{ color: C.muted, fontSize: 14 }}>Henter renter fra centralbankerne…</div>
          </div>
        )}

        {/* Error */}
        {error && !rates && (
          <div style={{ padding: 30, background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.bad}`, borderRadius: 14, marginBottom: 30 }}>
            <div style={{ color: C.bad, fontWeight: 600, marginBottom: 8 }}>Kunne ikke hente data</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>{error}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>Tjek at /api/rates endpoint er deployed på Vercel.</div>
          </div>
        )}

        {/* Rates Grid */}
        {rates && (
          <>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 18, letterSpacing: "0.04em" }}>
              Sidst opdateret: {new Date(rates.fetchedAt).toLocaleString("da-DK")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 40 }}>
              {/* ECB */}
              <BankCard
                logoBg="#003299" logoText="€" name="ECB" subtitle="Den Europæiske Centralbank"
                link="https://www.ecb.europa.eu/press/press_conference/monetary-policy-statement/html/index.en.html"
                linkText="Officielle pengepolitiske udsagn"
                rows={[
                  ["Indlånsfacilitet (DFR)", rates.ecb?.dfr, true],
                  ["Hovedrefinansiering (MRO)", rates.ecb?.mro],
                  ["Marginal udlånsfacilitet", rates.ecb?.mlf],
                ]}
              />

              {/* Fed */}
              <BankCard
                logoBg="#1a4480" logoText="$" name="Federal Reserve" subtitle="USA — FOMC"
                link="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
                linkText="FOMC mødekalender"
                rows={[["Fed Funds (target upper)", rates.fed?.fedFunds, true]]}
              />

              {/* Nationalbanken */}
              <BankCard
                logoBg="#c8102e" logoText="kr" name="Nationalbanken" subtitle="Danmark"
                link="https://www.nationalbanken.dk/da/hvad-vi-goer/stabile-priser-pengepolitik-og-dansk-oekonomi/officielle-rentesatser"
                linkText="Officielle rentesatser"
                rows={rates.nationalbanken?.error
                  ? null
                  : [
                      ["Diskonto", rates.nationalbanken?.diskonto, true],
                      ["Udlånsrente", rates.nationalbanken?.udlaan],
                      ["Indskudsbevisrente", rates.nationalbanken?.indskud],
                      ["Foliorente", rates.nationalbanken?.folio],
                    ]
                }
                errorMsg={rates.nationalbanken?.error}
              />
            </div>
          </>
        )}

        {/* Next meeting highlight */}
        {upcomingMeetings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 32, padding: "24px 28px", background: `linear-gradient(135deg, ${C.card}, ${C.cardH})`, border: `1px solid ${C.gold}33`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}
          >
            <div>
              <div style={{ color: C.gold, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>⏰ Næste planlagte møde</div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
                {upcomingMeetings[0][0]}
              </div>
              <div style={{ color: C.muted, fontSize: 13 }}>
                {upcomingMeetings[0][1]} · {upcomingMeetings[0][2]}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: C.muted, fontSize: 12 }}>
              <span>{upcomingMeetings.length} kommende møder i 2026</span>
            </div>
          </motion.div>
        )}

        {/* Meeting calendar */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, marginBottom: 32 }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 19, color: "#fff", marginBottom: 6, fontWeight: 600 }}>📅 Mødekalender 2026</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 22 }}>Officielle datoer for pengepolitiske beslutningsmøder</div>

          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={thStyle}>Dato</th>
                  <th style={thStyle}>Institution</th>
                  <th style={thStyle}>Type</th>
                </tr>
              </thead>
              <tbody>
                {MEETINGS_2026.map(([date, inst, type, src], i) => {
                  const m = date.match(/(\d+)\.\s+(\w+)\s+(\d+)/);
                  const d = m ? new Date(parseInt(m[3]), monthMap[m[2]], parseInt(m[1])) : null;
                  const isPast = d && d < today;
                  const isNext = upcomingMeetings[0] && upcomingMeetings[0][0] === date;
                  const color = src === "fed" ? "#3b6db8" : src === "ecb" ? "#4471c1" : "#e05c5c";
                  return (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: isNext ? `${C.gold}0a` : "transparent",
                      opacity: isPast ? 0.4 : 1,
                    }}>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: isNext ? C.gold : C.text, fontWeight: isNext ? 700 : 500 }}>
                        {isNext && "→ "}{date}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: isNext ? `0 0 8px ${color}` : "none" }} />
                          <span style={{ color: C.text }}>{inst}</span>
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: C.muted }}>{type}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: C.muted, lineHeight: 1.6, padding: "12px 14px", background: C.bg, borderRadius: 7 }}>
            💡 Datoer er offentliggjorte mødeplaner og <strong style={{ color: C.text }}>kan ændres uden varsel</strong> af de respektive centralbanker. Bekræft altid aktuelle datoer direkte hos ECB, Federal Reserve eller Nationalbanken inden planlægning. Nationalbanken justerer typisk renten i forbindelse med ECB's beslutninger for at holde det pengepolitiske rentespænd uændret som led i fastkurspolitikken over for euroen.
          </div>
        </div>

        {/* Data sources */}
        <div style={{ background: C.bgD, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>📚 Datakilder</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
            <div>
              <div style={{ color: C.text, fontWeight: 600, marginBottom: 4, fontSize: 13 }}>ECB Data Portal</div>
              <div style={{ fontSize: 11 }}>data-api.ecb.europa.eu — SDMX 2.1 RESTful API. Officielle pengepolitiske renter (DFR, MRO, MLF) opdateres samme dag som beslutning offentliggøres.</div>
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 600, marginBottom: 4, fontSize: 13 }}>FRED / St. Louis Fed</div>
              <div style={{ fontSize: 11 }}>api.stlouisfed.org — Federal Reserve Economic Data. Fed Funds target range (DFEDTARU) opdateres efter hver FOMC-beslutning.</div>
            </div>
            <div>
              <div style={{ color: C.text, fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Danmarks Statistik</div>
              <div style={{ fontSize: 11 }}>api.statbank.dk — Tabel MPK3 indeholder Nationalbankens fire pengepolitiske renter. Månedlige ultimo-værdier.</div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ position: "relative", background: C.bgD, borderTop: `1px solid ${C.border}`, zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 28px", display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
          <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.7, maxWidth: 750 }}>
            Indhold er udelukkende til oplysning og udgør ikke finansiel rådgivning eller anbefalinger. Værdier hentes fra tredjepartskilder og platformen er ikke ansvarlig for nøjagtighed eller forsinkelser i data.
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Playfair Display, serif", color: C.gold, fontSize: 18 }}>BoligØkonomi</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 3, letterSpacing: "0.05em" }}>© 2026</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11 };
const thStyle = { textAlign: "left", padding: "10px 14px", color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 };

/* ─────────── BankCard component ─────────── */
function BankCard({ logoBg, logoText, name, subtitle, link, linkText, rows, errorMsg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: C.gold, y: -3 }}
      transition={{ duration: 0.3 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 26,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, background: logoBg, color: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 }}>{logoText}</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Playfair Display, serif" }}>{name}</div>
          <div style={{ color: C.muted, fontSize: 10, letterSpacing: "0.05em" }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ flex: 1, marginBottom: 16 }}>
        {errorMsg ? (
          <div style={{ padding: "14px 16px", background: `${C.warn}0d`, border: `1px solid ${C.warn}33`, borderRadius: 8, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
            <div style={{ color: C.warn, fontWeight: 600, marginBottom: 6 }}>⚠️ Konfiguration mangler</div>
            {errorMsg}
          </div>
        ) : !rows ? (
          <div style={{ color: C.muted, fontSize: 11 }}>Ingen data tilgængelig</div>
        ) : (
          rows.map(([label, d, primary]) => (
            <div key={label} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{label}</div>
              {d?.error ? (
                <div style={{ color: C.bad, fontSize: 11 }}>⚠️ {d.error}</div>
              ) : d?.value !== null && d?.value !== undefined ? (
                <>
                  <div style={{
                    fontSize: primary ? 30 : 19,
                    color: C.gold,
                    fontFamily: "Playfair Display, serif",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>
                    {d.value.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>
                    Per {d.date}
                    {d.change !== null && d.change !== undefined && d.change !== 0 && (
                      <span style={{ color: d.change > 0 ? C.bad : C.ok, marginLeft: 8, fontWeight: 600 }}>
                        {d.change > 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)} pp
                      </span>
                    )}
                  </div>
                  {d.note && <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontStyle: "italic" }}>{d.note}</div>}
                </>
              ) : (
                <div style={{ color: C.muted, fontSize: 11 }}>—</div>
              )}
            </div>
          ))
        )}
      </div>

      <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.gold, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
         onMouseEnter={e => e.currentTarget.style.color = C.goldL}
         onMouseLeave={e => e.currentTarget.style.color = C.gold}>
        {linkText} →
      </a>
    </motion.div>
  );
}
