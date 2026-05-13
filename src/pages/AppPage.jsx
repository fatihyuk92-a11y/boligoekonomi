import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";

const C = {
  bg: "#0d1b2e", card: "#162540", cardH: "#1e3254",
  border: "#1f3352", gold: "#c9a84c", goldL: "#e8c97a",
  text: "#e8e4dc", muted: "#7a8fa8",
  ok: "#4caf7d", bad: "#e05c5c", warn: "#f0a04b",
};

const fmt = (n) => Math.round(n).toLocaleString("da-DK");

function Card({ children, style = {}, hoverable = false }) {
  return (
    <motion.div
      whileHover={hoverable ? { borderColor: C.gold, y: -2 } : {}}
      transition={{ duration: 0.2 }}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function Metric({ label, value, sub, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 22px" }}
    >
      <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>{label}</div>
      <div style={{ color: color || C.text, fontSize: 22, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </motion.div>
  );
}

function Slider({ label, value, onChange, min, max, step, unit }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>
          {value > 999 ? fmt(value) : value} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ "--p": `${pct}%`, width: "100%", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ color: C.muted, fontSize: 9 }}>{min}{unit}</span>
        <span style={{ color: C.muted, fontSize: 9 }}>{max}{unit}</span>
      </div>
    </div>
  );
}

// Each profile controls the rate range displayed in Scenarier tab
// — so the selection actually affects the displayed analysis.
const RISK = {
  konservativ: {
    color: C.ok,
    label: "Konservativ",
    desc: "Fokus på rentestigninger. Scenarierne viser primært opadgående rentestød (−1% til +5%).",
    scenLow: -1, scenHigh: 5, scenStep: 0.5,
  },
  moderat: {
    color: C.warn,
    label: "Moderat",
    desc: "Symmetrisk analyse. Scenarierne dækker både stigninger og fald (−2% til +3%).",
    scenLow: -2, scenHigh: 3, scenStep: 0.5,
  },
  aggressiv: {
    color: C.bad,
    label: "Aggressiv",
    desc: "Fokus på rentefald og opkonvertering. Scenarierne viser primært faldende rente (−3% til +2%).",
    scenLow: -3, scenHigh: 2, scenStep: 0.5,
  },
};

const TABS = [
  { id: "kalkulator", label: "Kalkulator", icon: "🏠" },
  { id: "scenarier", label: "Scenarier", icon: "📈" },
  { id: "omlaegning", label: "Omlægning", icon: "🔄" },
  { id: "sammenlign", label: "Sammenlign", icon: "⚖️" },
  { id: "laer", label: "Lær", icon: "📚" },
  { id: "ai", label: "AI Assistent", icon: "💬" },
];

const REALKREDIT = [
  { navn: "Totalkredit", bidrag: 0.75, etab: "0,50%", note: "Via lokale pengeinstitutter" },
  { navn: "Realkredit Danmark", bidrag: 0.70, etab: "0,50%", note: "Datterselskab af Danske Bank" },
  { navn: "Nordea Kredit", bidrag: 0.80, etab: "0,75%", note: "Via Nordea Bank" },
  { navn: "Jyske Realkredit", bidrag: 0.65, etab: "0,50%", note: "Fokus på erhverv og privat" },
];

const EMNER = [
  {
    ikon: "⚡", titel: "F-kort",
    kort: "Variabel rente der refinansieres løbende",
    tekst: [
      { h: false, t: "F-kort (Flexkredit) er et realkreditlån med variabel rente, der fastsættes ved auktion typisk hvert kvartal (F3) eller hvert år (F1)." },
      { h: true, t: "Fordele" },
      { h: false, t: "Historisk set lavere startrente end fast. Kan give lavere månedlig ydelse i perioder med lav rente." },
      { h: true, t: "Ulemper" },
      { h: false, t: "Renten kan stige markant ved refinansiering. Stor usikkerhed i budgettet ved rentestigninger." },
      { h: true, t: "Hvornår er det relevant?" },
      { h: false, t: "Kortere tidshorisont, høj risikovillighed, eller forventning om faldende renter. Ikke egnet til dem der ønsker faste ydelser." },
    ]
  },
  {
    ikon: "🔒", titel: "Fast rente",
    kort: "Uændret rente i hele lånets løbetid",
    tekst: [
      { h: false, t: "Fast rente betyder at din rente er låst – typisk i 10, 20 eller 30 år. Du kender præcis din ydelse fra dag ét til lånets udløb." },
      { h: true, t: "Fordele" },
      { h: false, t: "Komplet forudsigelighed. Fuld beskyttelse mod rentestigninger. Ideel til langsigtet budgetlægning." },
      { h: true, t: "Ulemper" },
      { h: false, t: "Typisk højere startrente end variabel. Kurstab ved nedkonvertering i faldende rentemiljø." },
      { h: true, t: "Tommelfingerregel" },
      { h: false, t: "Jo højere gæld og jo lavere risikovillighed, desto mere relevant er fast rente. Beskyttelse har sin pris." },
    ]
  },
  {
    ikon: "📊", titel: "Bidragssats",
    kort: "Realkreditinstituttets løbende gebyr",
    tekst: [
      { h: false, t: "Bidragssatsen er det løbende gebyr realkreditinstituttet opkræver for at stille lånet til rådighed. Det beregnes som en procentdel af restgælden om året." },
      { h: true, t: "Vigtigt at forstå" },
      { h: false, t: "Bidragssatsen er IKKE renten. Selvom obligationsrenten falder til 0%, betaler du stadig bidrag. Den samlede effektive rente er obligationsrente + bidragssats." },
      { h: true, t: "Belåningsgrad og bidrag" },
      { h: false, t: "Jo lavere belåningsgrad (LTV), jo lavere bidragssats kan du opnå. Indbetaling af ekstra afdrag kan reducere bidragssatsen." },
    ]
  },
  {
    ikon: "📉", titel: "Kurstab",
    kort: "Tabet ved indfrielse til markedskurs",
    tekst: [
      { h: false, t: "Når du indfrier et fastforrentet lån, sker det til markedskursen – ikke nødvendigvis kurs 100 (pari)." },
      { h: true, t: "Eksempel" },
      { h: false, t: "Har du et 5%-lån og markedsrenten er 3%, handles obligationerne over kurs 100. Indfrielse koster f.eks. kurs 107 → du betaler 7% mere end restgælden." },
      { h: true, t: "Modsat: kursgevinst ved opkonvertering" },
      { h: false, t: "Stiger renten efter du har optaget et lavrentelån, handler obligationerne under kurs 100. Indfrielse kan ske til under pari → potentiel kursgevinst og reduceret restgæld." },
    ]
  },
  {
    ikon: "🔄", titel: "Op- og nedkonvertering",
    kort: "Omlægning til højere eller lavere rente",
    tekst: [
      { h: true, t: "Nedkonvertering" },
      { h: false, t: "Skift fra høj til lav rente. Reducerer månedlig ydelse, men medfører kurstab da obligationerne handles over pari." },
      { h: true, t: "Opkonvertering" },
      { h: false, t: "Skift fra lav til høj rente. Obligationerne handles under pari → kursgevinst, og restgælden reduceres." },
      { h: true, t: "Hvornår giver nedkonvertering mening?" },
      { h: false, t: "Tommelfingerregel: Rentedifferencen skal være mindst 1–1,5 procentpoint. Du bør have tilstrækkelig restløbetid og planlægge at bo i ejendommen længe nok til at nå break-even." },
    ]
  },
  {
    ikon: "🔁", titel: "Refinansiering",
    kort: "Løbende obligationsauktion på F-kort lån",
    tekst: [
      { h: false, t: "F-kort lån refinansieres løbende. Realkreditinstituttet udsteder nye obligationer, og renten fastsættes på auktion i markedet." },
      { h: true, t: "Risikoen" },
      { h: false, t: "Hvis renten er steget markant ved næste refinansiering, stiger din ydelse fra den dag. Der er ingen gradvis overgang som ved en ny aftale." },
      { h: true, t: "Rentehætte-produkter" },
      { h: false, t: "Nogle F-kort lån tilbydes med en rentehætte (cap), der begrænser den maksimale rente du kan opleve. Det koster typisk en præmie i form af en lidt højere startbidragssats." },
    ]
  },
];

export default function AppPage() {
  const [tab, setTab] = useState("kalkulator");
  const [restgæld, setRestgæld] = useState(2000000);
  const [rente, setRente] = useState(4.0);
  const [lånType, setLånType] = useState("fast");
  const [boligværdi, setBoligværdi] = useState(3000000);
  const [løbetid, setLøbetid] = useState(30);
  const [indkomst, setIndkomst] = useState(600000);
  const [bidragssats, setBidragssats] = useState(0.75);
  const [risikovillighed, setRisikovillighed] = useState("moderat");
  const [aktivtEmne, setAktivtEmne] = useState(null);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hej 🏠\n\nJeg er en informationsmotor for boligøkonomi. Jeg leverer beregninger og forklarer begreber som F-kort, kurstab og bidragssats — på baggrund af dine aktuelle tal fra kalkulatoren.\n\nJeg giver ikke rådgivning eller anbefalinger, og jeg udtaler mig ikke om hvad du bør gøre. For konkrete beslutninger henvises til uafhængig faglig vurdering hos din bank eller dit realkreditinstitut.\n\nHvad vil du gerne have beregnet eller forklaret?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Omlægning-state (independent so user can experiment freely)
  const [nyRente, setNyRente] = useState(3.0);
  const [nyBidrag, setNyBidrag] = useState(0.60);
  const [nyLånType, setNyLånType] = useState("fast");
  const [kurstabPct, setKurstabPct] = useState(3.0); // % of restgæld
  const [stiftelseInput, setStiftelseInput] = useState(15000);

  // Core calculations
  const effRente = rente + bidragssats;
  const mr = effRente / 100 / 12;
  const mdr = løbetid * 12;
  const ydelse = mr > 0.0001 ? restgæld * mr / (1 - Math.pow(1 + mr, -mdr)) : restgæld / mdr;
  const samletBetaling = ydelse * mdr;
  const samletRente = samletBetaling - restgæld;
  const ltv = (restgæld / boligværdi) * 100;
  const gældskvote = (ydelse * 12) / indkomst * 100;

  // Amortization
  const amorData = [];
  let bal = restgæld;
  for (let yr = 0; yr <= løbetid; yr++) {
    amorData.push({ år: yr, restgæld: Math.round(bal / 1000), friværdi: Math.round((boligværdi - bal) / 1000) });
    for (let m = 0; m < 12 && bal > 0; m++) {
      bal = Math.max(0, bal - (ydelse - bal * mr));
    }
  }

  // Scenario data — range depends on selected risk profile
  const profile = RISK[risikovillighed];
  const scenData = [];
  for (let d = profile.scenLow; d <= profile.scenHigh + 0.01; d += profile.scenStep) {
    const r2 = Math.max(0.1, rente + d);
    const mr2 = (r2 + bidragssats) / 100 / 12;
    const y2 = restgæld * mr2 / (1 - Math.pow(1 + mr2, -mdr));
    scenData.push({
      name: `${(rente + d).toFixed(1)}%`,
      ydelse: Math.round(y2),
      delta: Math.round(y2 - ydelse),
      current: Math.abs(d) < 0.01,
    });
  }

  // Refinancing — fully dynamic based on user input
  const nyEffRente = nyRente + nyBidrag;
  const nyMR = nyEffRente / 100 / 12;
  const nyYdelse = nyMR > 0.0001 ? restgæld * nyMR / (1 - Math.pow(1 + nyMR, -mdr)) : restgæld / mdr;
  const besparelse = ydelse - nyYdelse; // positive = nedkonvertering/savings, negative = opkonvertering/cost
  // Kurstab/kursgevinst sign convention:
  //   Nedkonvertering (from high to low rate) → cost: kurstab > 0
  //   Opkonvertering (from low to high rate) → potential gain: kurstab < 0 (kursgevinst)
  const erNedkonvertering = nyRente < rente;
  const kurstab = restgæld * (kurstabPct / 100) * (erNedkonvertering ? 1 : -1);
  const stiftelse = stiftelseInput;
  const totalOmk = kurstab + stiftelse;
  const breakEven = besparelse > 0 && totalOmk > 0 ? totalOmk / besparelse : Infinity;
  const samletNyRente = nyYdelse * mdr - restgæld;
  const livstidsBesparelse = besparelse * mdr - totalOmk; // gevinst over hele løbetiden

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendChat = async () => {
    if (!chatInput.trim() || aiLoading) return;
    const userMsg = { role: "user", content: chatInput };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setChatInput("");
    setAiLoading(true);

    const sys = `Du er en dansk boligøkonomi-informationsmotor. Du er IKKE en rådgiver. Du må IKKE give anbefalinger, vurderinger eller udtale dig om hvad brugeren bør gøre.

Brugerens aktuelle lånedata:
- Restgæld: ${fmt(restgæld)} kr.
- Nominel rente: ${rente}% (${lånType})
- Bidragssats: ${bidragssats}%
- Effektiv rente: ${effRente.toFixed(2)}%
- Boligværdi: ${fmt(boligværdi)} kr.
- Løbetid: ${løbetid} år
- Månedlig ydelse: ${fmt(ydelse)} kr.
- Belåningsgrad (LTV): ${ltv.toFixed(1)}%
- Samlet renteomkostning: ${fmt(samletRente)} kr.

ABSOLUTTE REGLER (overtrædes ikke under nogen omstændigheder):
1. Svar ALTID på dansk
2. Brug ALDRIG formuleringer som "du bør", "jeg anbefaler", "det er en god idé", "det er bedst at", "vælg", "overvej at", "gør dette". Brug i stedet rent faktuelle formuleringer som "beregningen viser", "tallene angiver", "resultatet bliver"
3. Du må IKKE udtale dig om hvad der er "godt", "dårligt", "bekymrende", "fornuftigt" eller lignende vurderende ord
4. Du må IKKE forholde dig til brugerens situation eller anbefale handlinger
5. Henvis ALTID til at brugeren skal indhente uafhængig faglig vurdering hos egen bank/realkreditinstitut ved konkrete spørgsmål om valg
6. Hvis brugeren spørger "skal jeg…" eller beder om anbefalinger: afvis høfligt og forklar at platformen kun leverer beregninger og generel information
7. Maks 200 ord. Vær præcis og faktuel.
8. Brug brugerens tal i beregninger, men kun som regnestykker — aldrig som grundlag for vurdering`;

    try {
      // ⚠️ CALLS OUR VERCEL BACKEND ROUTE — NOT api.anthropic.com directly
      // The backend route at /api/chat.js adds the API key server-side
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sys,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.content[0].text }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Beklager, der opstod en teknisk fejl. Prøv igen." }]);
    }
    setAiLoading(false);
  };

  const ttStyle = { contentStyle: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }, labelStyle: { color: C.gold } };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .tabBtn { transition: all 0.2s ease; }
        .tabBtn:hover { background: ${C.cardH} !important; color: ${C.text} !important; }
        .emneCard { transition: all 0.25s ease; }
        .emneCard:hover { border-color: ${C.gold} !important; background: ${C.cardH} !important; transform: translateY(-2px); }
        .suggBtn { transition: all 0.15s ease; }
        .suggBtn:hover { background: ${C.cardH} !important; color: ${C.text} !important; border-color: ${C.gold}55 !important; }
        .chatIn { outline: none; background: ${C.card}; border: none; border-top: 1px solid ${C.border}; color: ${C.text}; font-size: 14px; font-family: inherit; width: 100%; padding: 16px 20px; }
        .chatIn:focus { border-top-color: ${C.gold} !important; }
        .sendBtn { padding: 16px 22px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity 0.2s; border-top: 1px solid ${C.border}; }
        .sendBtn:hover { opacity: 0.85; }
        .typeBtn { flex: 1; padding: 9px 6px; border-radius: 8px; border: 1px solid; cursor: pointer; font-size: 12px; font-family: inherit; transition: all 0.15s; }
        .typeBtn:hover { transform: translateY(-1px); }
        .rowItem { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${C.border}; }
        .backLink { display: inline-flex; align-items: center; gap: 6px; color: ${C.muted}; font-size: 12px; transition: color 0.2s; }
        .backLink:hover { color: ${C.gold}; }
      `}</style>

      {/* Sticky nav wrapper — header + tabs stay together on scroll */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,27,46,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏠</div>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1 }}>BoligØkonomi</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Analyse · Simulation · Uddannelse</div>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link to="/" className="backLink">← Forside</Link>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "right", maxWidth: 280 }}>
              ⚠️ Informations- og undervisningsformål — Ikke finansiel rådgivning
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 28px", display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} className="tabBtn" onClick={() => setTab(t.id)} style={{ padding: "13px 18px", background: tab === t.id ? C.card : "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? C.gold : "transparent"}`, color: tab === t.id ? C.gold : C.muted, cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: tab === t.id ? 600 : 400, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content with animated tab transitions */}
      <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── KALKULATOR ── */}
            {tab === "kalkulator" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>Boliglånskalkulator</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Juster dine låneoplysninger og se beregningerne opdateres i realtid.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 22 }}>
                  <Card>
                    <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#fff", marginBottom: 22 }}>Dine låneoplysninger</h2>
                    <Slider label="Restgæld" value={restgæld} onChange={setRestgæld} min={500000} max={10000000} step={50000} unit="kr." />
                    <Slider label="Nominel rente" value={rente} onChange={setRente} min={0.5} max={10} step={0.25} unit="%" />
                    <Slider label="Bidragssats" value={bidragssats} onChange={setBidragssats} min={0.3} max={2.0} step={0.05} unit="%" />
                    <Slider label="Boligværdi" value={boligværdi} onChange={setBoligværdi} min={500000} max={15000000} step={100000} unit="kr." />
                    <Slider label="Løbetid" value={løbetid} onChange={setLøbetid} min={5} max={30} step={1} unit="år" />
                    <Slider label="Husstandsindkomst" value={indkomst} onChange={setIndkomst} min={200000} max={3000000} step={25000} unit="kr./år" />

                    <div style={{ marginBottom: 18 }}>
                      <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Låntype</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {["fast", "variabel", "F-kort"].map(t => (
                          <button key={t} className="typeBtn" onClick={() => setLånType(t)} style={{ borderColor: lånType === t ? C.gold : C.border, background: lånType === t ? `${C.gold}1a` : "transparent", color: lånType === t ? C.gold : C.muted, fontWeight: lånType === t ? 600 : 400 }}>{t}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Risikovillighed</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        {Object.entries(RISK).map(([k, v]) => (
                          <button key={k} className="typeBtn" onClick={() => setRisikovillighed(k)} style={{ borderColor: risikovillighed === k ? v.color : C.border, background: risikovillighed === k ? `${v.color}1a` : "transparent", color: risikovillighed === k ? v.color : C.muted, fontWeight: risikovillighed === k ? 600 : 400 }}>{v.label}</button>
                        ))}
                      </div>
                      <div style={{ color: C.muted, fontSize: 12, padding: "10px 14px", background: `${RISK[risikovillighed].color}11`, borderRadius: 8, borderLeft: `3px solid ${RISK[risikovillighed].color}` }}>{RISK[risikovillighed].desc}</div>
                    </div>
                  </Card>

                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <Metric index={0} label="Månedlig ydelse" value={`${fmt(ydelse)} kr.`} sub={`inkl. ${bidragssats}% bidrag`} color={C.gold} />
                      <Metric index={1} label="Effektiv rente" value={`${effRente.toFixed(2)}%`} sub="Rente + bidragssats" />
                      <Metric index={2} label="Samlet renteomk." value={`${fmt(samletRente)} kr.`} sub={`Over ${løbetid} år`} color={C.bad} />
                      <Metric index={3} label="Belåningsgrad (LTV)" value={`${ltv.toFixed(1)}%`} sub={ltv > 80 ? "⚠️ Over 80%" : ltv > 60 ? "⚡ 60–80%" : "✅ Under 60%"} color={ltv > 80 ? C.bad : ltv > 60 ? C.warn : C.ok} />
                      <Metric index={4} label="Gældskvote" value={`${gældskvote.toFixed(1)}%`} sub="Ydelse ÷ Årsindkomst" color={gældskvote > 40 ? C.bad : gældskvote > 25 ? C.warn : C.ok} />
                      <Metric index={5} label="Friværdi" value={`${fmt(boligværdi - restgæld)} kr.`} sub={`${(((boligværdi - restgæld) / boligværdi) * 100).toFixed(1)}% af boligværdi`} color={C.ok} />
                    </div>

                    <Card>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 16, color: "#fff", marginBottom: 16 }}>Gæld & Friværdi over tid</div>
                      <ResponsiveContainer width="100%" height={185}>
                        <AreaChart data={amorData.filter((_, i) => i % 2 === 0)} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                          <defs>
                            <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.bad} stopOpacity={0.3}/><stop offset="95%" stopColor={C.bad} stopOpacity={0}/></linearGradient>
                            <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.ok} stopOpacity={0.3}/><stop offset="95%" stopColor={C.ok} stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                          <XAxis dataKey="år" tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `År ${v}`} />
                          <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `${v}k`} />
                          <Tooltip {...ttStyle} formatter={(v, n) => [`${fmt(v * 1000)} kr.`, n === "restgæld" ? "Restgæld" : "Friværdi"]} />
                          <Area type="monotone" dataKey="restgæld" stroke={C.bad} fill="url(#gG)" strokeWidth={2} name="restgæld" animationDuration={900} />
                          <Area type="monotone" dataKey="friværdi" stroke={C.ok} fill="url(#fG)" strokeWidth={2} name="friværdi" animationDuration={900} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* ── SCENARIER ── */}
            {tab === "scenarier" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>Rentescenarier</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>Effekten af renteændringer på din månedlige ydelse. Området der analyseres styres af din valgte risikoprofil (kan ændres i Kalkulator-fanen).</p>

                {/* Active profile indicator */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", background: `${profile.color}15`, border: `1px solid ${profile.color}44`, borderRadius: 100, marginBottom: 22, fontSize: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: profile.color, boxShadow: `0 0 8px ${profile.color}` }} />
                  <span style={{ color: C.muted }}>Aktiv profil:</span>
                  <span style={{ color: profile.color, fontWeight: 600 }}>{profile.label}</span>
                  <span style={{ color: C.muted }}>· Range {profile.scenLow >= 0 ? "+" : ""}{profile.scenLow}% til +{profile.scenHigh}%</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 22 }}>
                  <div>
                    <Card style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: "#fff", marginBottom: 18 }}>Månedlig ydelse ved renteændringer</div>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={scenData} margin={{ top: 5, right: 10, bottom: 22, left: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                          <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Nominel rente", position: "insideBottom", offset: -12, fill: C.muted, fontSize: 11 }} />
                          <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `${fmt(v)}`} />
                          <Tooltip {...ttStyle} formatter={(v) => [`${fmt(v)} kr./md.`, "Månedlig ydelse"]} />
                          <ReferenceLine y={Math.round(ydelse)} stroke={C.goldL} strokeDasharray="5 5" />
                          <Bar dataKey="ydelse" radius={[3, 3, 0, 0]} fill={C.gold} animationDuration={900} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>Stiplet linje = nuværende ydelse ({fmt(ydelse)} kr./md.)</div>
                    </Card>

                    <Card>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: "#fff", marginBottom: 16 }}>Ændring i ydelse vs. nuværende</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                        {scenData.map((s, i) => (
                          <motion.div
                            key={s.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                            style={{ padding: "12px 14px", borderRadius: 9, background: s.current ? `${C.gold}1a` : s.delta > 0 ? `${C.bad}0d` : `${C.ok}0d`, border: `1px solid ${s.current ? C.gold + "55" : s.delta > 0 ? C.bad + "33" : C.ok + "33"}` }}
                          >
                            <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>Rente: {s.name}</div>
                            <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "Playfair Display, serif", color: s.current ? C.gold : s.delta > 0 ? C.bad : C.ok }}>
                              {s.current ? fmt(s.ydelse) : s.delta > 0 ? `+${fmt(s.delta)}` : fmt(s.delta)}
                            </div>
                            <div style={{ color: C.muted, fontSize: 10 }}>kr./md.</div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div>
                    <Card style={{ marginBottom: 16 }}>
                      <div style={{ color: C.bad, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>🔴 Stresstest</div>
                      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>Effekt ved rentestigninger på dit lån ({fmt(restgæld)} kr.):</div>
                      {[1, 2, 3].map(d => {
                        const s = scenData.find(x => Math.abs(parseFloat(x.name) - (rente + d)) < 0.05);
                        if (!s) return null;
                        return (
                          <div key={d} style={{ padding: "11px 14px", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 10, background: C.bg }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: C.muted, fontSize: 12 }}>+{d}% i rente</span>
                              <span style={{ color: C.bad, fontWeight: 700 }}>+{fmt(s.delta)} kr./md.</span>
                            </div>
                            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>+{fmt(s.delta * 12)} kr./år · Ny rente: {s.name}</div>
                          </div>
                        );
                      })}
                    </Card>

                    <Card style={{ borderLeft: `3px solid ${C.warn}` }}>
                      <div style={{ color: C.warn, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>⚡ F-kort risiko</div>
                      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
                        Med F-kort refinansieres renten løbende. Stiger renten 2% ved næste refinansiering, medfører det:
                        <div style={{ marginTop: 10, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>
                          <div style={{ color: C.bad, fontWeight: 700, fontSize: 15 }}>+{fmt((scenData.find(x => Math.abs(parseFloat(x.name) - (rente + 2)) < 0.05) || {}).delta || 0)} kr./md.</div>
                          <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>fra næste refinansierings-termin</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* ── OMLÆGNING ── */}
            {tab === "omlaegning" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>Låneomlægning</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 22 }}>Indstil parametrene for et hypotetisk nyt lån. Beregningerne dækker både nedkonvertering (lavere rente) og opkonvertering (højere rente).</p>

                {/* Konvertering-type indicator */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", background: erNedkonvertering ? `${C.ok}15` : `${C.warn}15`, border: `1px solid ${erNedkonvertering ? C.ok + "44" : C.warn + "44"}`, borderRadius: 100, marginBottom: 22, fontSize: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: erNedkonvertering ? C.ok : C.warn }} />
                  <span style={{ color: C.muted }}>Konverteringstype:</span>
                  <span style={{ color: erNedkonvertering ? C.ok : C.warn, fontWeight: 600 }}>
                    {nyRente === rente ? "Identisk rente" : erNedkonvertering ? "📉 Nedkonvertering" : "📈 Opkonvertering"}
                  </span>
                  <span style={{ color: C.muted }}>· {rente}% → {nyRente}%</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
                  {/* LEFT: Nuværende lån */}
                  <Card>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#fff", marginBottom: 4 }}>Nuværende lån</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lånType}</div>
                    {[
                      ["Restgæld", `${fmt(restgæld)} kr.`],
                      ["Nominel rente", `${rente}%`],
                      ["Bidragssats", `${bidragssats}%`],
                      ["Effektiv rente", `${effRente.toFixed(2)}%`],
                      ["Månedlig ydelse", `${fmt(ydelse)} kr.`, C.gold, true],
                      ["Samlet renteomk.", `${fmt(samletRente)} kr.`, C.bad],
                    ].map(([l, v, col, bold]) => (
                      <div key={l} className="rowItem">
                        <span style={{ color: C.muted, fontSize: 13 }}>{l}</span>
                        <span style={{ color: col || C.text, fontWeight: bold ? 700 : 400, fontSize: 14 }}>{v}</span>
                      </div>
                    ))}
                  </Card>

                  {/* MIDDLE: Configure new loan */}
                  <Card>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#fff", marginBottom: 4 }}>Nyt lån</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.06em" }}>Justér parametrene</div>

                    <Slider label="Ny nominel rente" value={nyRente} onChange={setNyRente} min={0.5} max={10} step={0.25} unit="%" />
                    <Slider label="Ny bidragssats" value={nyBidrag} onChange={setNyBidrag} min={0.3} max={2.0} step={0.05} unit="%" />

                    <div style={{ marginBottom: 18 }}>
                      <div style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Ny låntype</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {["fast", "variabel", "F-kort"].map(t => (
                          <button key={t} className="typeBtn" onClick={() => setNyLånType(t)} style={{ borderColor: nyLånType === t ? C.gold : C.border, background: nyLånType === t ? `${C.gold}1a` : "transparent", color: nyLånType === t ? C.gold : C.muted, fontWeight: nyLånType === t ? 600 : 400 }}>{t}</button>
                        ))}
                      </div>
                      {nyLånType !== lånType && (
                        <div style={{ marginTop: 10, padding: "9px 12px", background: `${C.warn}0d`, border: `1px solid ${C.warn}33`, borderRadius: 7, fontSize: 11, color: C.muted, lineHeight: 1.55 }}>
                          ⚠️ Skift fra <strong style={{ color: C.text }}>{lånType}</strong> til <strong style={{ color: C.warn }}>{nyLånType}</strong>. {nyLånType === "F-kort" ? "F-kort har variabel rente — angivne rente er kun gyldig til næste refinansiering." : nyLånType === "variabel" ? "Variabel rente justeres ifølge institutets vilkår." : "Fast rente er låst i hele løbetiden."}
                        </div>
                      )}
                    </div>

                    <Slider label="Estimeret kurs-effekt" value={kurstabPct} onChange={setKurstabPct} min={0} max={10} step={0.25} unit="%" />
                    <Slider label="Stiftelsesomkostninger" value={stiftelseInput} onChange={setStiftelseInput} min={0} max={50000} step={1000} unit="kr." />
                  </Card>
                </div>

                {/* RESULT SUMMARY */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
                  <Metric index={0} label="Ny månedlig ydelse" value={`${fmt(nyYdelse)} kr.`} sub={`Effektiv rente ${nyEffRente.toFixed(2)}%`} color={besparelse >= 0 ? C.ok : C.bad} />
                  <Metric index={1} label={besparelse >= 0 ? "Månedlig besparelse" : "Månedlig merudgift"} value={`${besparelse >= 0 ? "−" : "+"}${fmt(Math.abs(besparelse))} kr.`} sub={`${besparelse >= 0 ? "−" : "+"}${fmt(Math.abs(besparelse) * 12)} kr./år`} color={besparelse >= 0 ? C.ok : C.bad} />
                  <Metric index={2} label={erNedkonvertering ? "Kurstab" : "Potentiel kursgevinst"} value={`${fmt(Math.abs(kurstab))} kr.`} sub={`${kurstabPct}% af restgæld`} color={erNedkonvertering ? C.bad : C.ok} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                  <Card>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: "#fff", marginBottom: 18 }}>Detaljeret opgørelse</div>
                    {[
                      ["Ny månedlig ydelse", `${fmt(nyYdelse)} kr.`, besparelse >= 0 ? C.ok : C.bad, true],
                      [besparelse >= 0 ? "Månedlig besparelse" : "Månedlig merudgift", `${besparelse >= 0 ? "−" : "+"}${fmt(Math.abs(besparelse))} kr.`, besparelse >= 0 ? C.ok : C.bad, true],
                      [erNedkonvertering ? `Kurstab (${kurstabPct}%)` : `Kursgevinst (${kurstabPct}%)`, `${kurstab >= 0 ? "+" : "−"}${fmt(Math.abs(kurstab))} kr.`, kurstab >= 0 ? C.bad : C.ok],
                      ["Stiftelsesomkostninger", `${fmt(stiftelseInput)} kr.`, C.warn],
                      ["Samlede engangsomkostninger", `${totalOmk >= 0 ? "" : "−"}${fmt(Math.abs(totalOmk))} kr.`, totalOmk >= 0 ? C.bad : C.ok, true],
                      ["Samlet renteomk. (ny)", `${fmt(samletNyRente)} kr.`, null],
                      ["Livstidsgevinst (vs. nuværende)", `${livstidsBesparelse >= 0 ? "+" : "−"}${fmt(Math.abs(livstidsBesparelse))} kr.`, livstidsBesparelse >= 0 ? C.ok : C.bad, true],
                    ].map(([l, v, col, bold]) => (
                      <div key={l} className="rowItem">
                        <span style={{ color: C.muted, fontSize: 13 }}>{l}</span>
                        <span style={{ color: col || C.text, fontWeight: bold ? 700 : 400, fontSize: 14 }}>{v}</span>
                      </div>
                    ))}
                  </Card>

                  <div>
                    <div style={{ marginBottom: 16, padding: "20px 22px", background: `${C.gold}0d`, borderRadius: 12, border: `1px solid ${C.gold}33` }}>
                      <div style={{ color: C.gold, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Break-even analyse</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ color: C.muted, fontSize: 13 }}>Måneder til break-even</span>
                        <span style={{ color: C.gold, fontSize: 30, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
                          {isFinite(breakEven) ? `${Math.round(breakEven)} mdr.` : "∞"}
                        </span>
                      </div>
                      {isFinite(breakEven)
                        ? <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Engangsomkostninger ({fmt(Math.abs(totalOmk))} kr.) dækkes via besparelsen efter {Math.round(breakEven / 12 * 10) / 10} år.</div>
                        : besparelse < 0
                          ? <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Nyt lån har højere månedlig ydelse — der er ingen besparelse at sammenholde med omkostningerne. Kan dog give kursgevinst ved opkonvertering.</div>
                          : <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Engangsomkostninger er negative (kursgevinst overstiger stiftelse) — break-even er øjeblikkelig.</div>
                      }
                    </div>

                    <Card style={{ borderLeft: `3px solid ${erNedkonvertering ? C.bad : C.ok}` }}>
                      <div style={{ color: erNedkonvertering ? C.bad : C.ok, fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                        {erNedkonvertering ? "📉 Mekanik ved nedkonvertering" : nyRente === rente ? "Ingen renteændring" : "📈 Mekanik ved opkonvertering"}
                      </div>
                      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
                        {erNedkonvertering
                          ? "Skift fra højere til lavere rente. Obligationerne handles over kurs 100, da de betaler høj rente. Indfrielse til markedskurs medfører kurstab, men reducerer fremtidig ydelse."
                          : nyRente === rente
                            ? "Ny rente er identisk med nuværende. Stiftelsesomkostninger udgør den eneste engangsudgift."
                            : "Skift fra lavere til højere rente. Obligationerne handles under kurs 100. Indfrielse sker billigere end pålydende → potentiel kursgevinst og reduceret faktisk gæld. Ydelsen stiger dog."
                        }
                      </div>
                    </Card>

                    <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.bad}0a`, borderRadius: 8, border: `1px solid ${C.bad}1a`, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                      ⚠️ Vejledende beregning. Faktiske kurser og omkostninger fastsættes af realkreditinstituttet. Indhent konkret tilbud.
                    </div>
                  </div>
                </div>

                <Card>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: "#fff", marginBottom: 22 }}>Forstå obligationsmekanikken 🔍</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                    {[
                      { titel: "Nedkonvertering", ikon: "📉", tekst: "Skift fra høj til lav rente. Obligationerne handles over kurs 100 (over pari), da de betaler høj rente. Indfrielse sker til markedskurs → kurstab for låntager, men lavere fremtidige ydelser.", color: C.bad },
                      { titel: "Opkonvertering", ikon: "📈", tekst: "Skift fra lav til høj rente. Obligationerne handles under kurs 100 (under pari). Indfrielse sker billigere end pålydende → potentiel kursgevinst og reduceret faktisk gæld.", color: C.ok },
                      { titel: "Break-even", ikon: "⚖️", tekst: "Er besparelsen på fremtidige ydelser større end de nuværende omkostninger? Tommelfingerregel: mindst 1–1,5% renteforskel, tilstrækkelig restløbetid og lang nok tidshorisont.", color: C.gold },
                    ].map(item => (
                      <div key={item.titel} style={{ padding: 20, background: C.bg, borderRadius: 10, borderTop: `3px solid ${item.color}` }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{item.ikon}</div>
                        <div style={{ color: item.color, fontWeight: 600, marginBottom: 10, fontSize: 14 }}>{item.titel}</div>
                        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{item.tekst}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ── SAMMENLIGN ── */}
            {tab === "sammenlign" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>Realkredit sammenligning</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Vejledende oversigt over de store danske realkreditinstitutter. Indhent aktuelle tilbud direkte.</p>

                <Card style={{ marginBottom: 22, overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                        {["Institut", "Bidragssats*", "Etablering*", "Bemærkning", "Md. ydelse**"].map(h => (
                          <th key={h} style={{ padding: "10px 18px", textAlign: "left", color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {REALKREDIT.map((r, i) => {
                        const mr2 = (rente + r.bidrag) / 100 / 12;
                        const y2 = restgæld * mr2 / (1 - Math.pow(1 + mr2, -mdr));
                        const cheapest = REALKREDIT.reduce((a, b) => a.bidrag < b.bidrag ? a : b);
                        const isCheap = r.bidrag === cheapest.bidrag;
                        return (
                          <tr key={r.navn} style={{ borderBottom: `1px solid ${C.border}`, background: isCheap ? `${C.gold}08` : i % 2 === 0 ? C.card : "transparent" }}>
                            <td style={{ padding: "15px 18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: isCheap ? C.gold : C.muted }} />
                                <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{r.navn}</span>
                                {isCheap && <span style={{ background: `${C.gold}2a`, color: C.gold, fontSize: 9, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>LAVEST BIDRAG</span>}
                              </div>
                            </td>
                            <td style={{ padding: "15px 18px", color: isCheap ? C.gold : C.text, fontWeight: isCheap ? 700 : 400, fontSize: 14 }}>{r.bidrag.toFixed(2)}%</td>
                            <td style={{ padding: "15px 18px", color: C.muted, fontSize: 13 }}>{r.etab}</td>
                            <td style={{ padding: "15px 18px", color: C.muted, fontSize: 12 }}>{r.note}</td>
                            <td style={{ padding: "15px 18px", color: C.text, fontWeight: 600, fontSize: 13 }}>{fmt(y2)} kr.</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ padding: "10px 18px", color: C.muted, fontSize: 11, marginTop: 4 }}>
                    * Vejledende satser – afhænger af belåningsgrad og låntype. &nbsp; ** Beregnet ved restgæld {fmt(restgæld)} kr., rente {rente}%, løbetid {løbetid} år.
                  </div>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                  <Card>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 16, color: "#fff", marginBottom: 16 }}>Bidragssatser visualiseret</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={REALKREDIT.map(r => ({ navn: r.navn.split(" ")[0], bidrag: r.bidrag }))} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                        <XAxis dataKey="navn" tick={{ fill: C.muted, fontSize: 11 }} />
                        <YAxis tick={{ fill: C.muted, fontSize: 11 }} domain={[0.55, 0.85]} />
                        <Tooltip {...ttStyle} formatter={v => [`${v}%`, "Bidragssats"]} />
                        <Bar dataKey="bidrag" fill={C.gold} radius={[4, 4, 0, 0]} animationDuration={900} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card style={{ borderLeft: `3px solid ${C.warn}` }}>
                    <div style={{ color: C.warn, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>💡 Vidste du?</div>
                    {[
                      "📌 Bidragssatsen forhandles typisk ikke individuelt – den afhænger primært af belåningsgrad og låntype.",
                      "📌 Du kan skifte realkreditinstitut, men det kræver en fuld omlægning med tilhørende kurstab og omkostninger.",
                      "📌 Totalkredit er ejet af lokale pengeinstitutter – du søger lånet via din lokale bank.",
                      "📌 Jo lavere din LTV (belåningsgrad), jo bedre bidragssats kan du potentielt opnå.",
                    ].map((t, i) => (
                      <div key={i} style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{t}</div>
                    ))}
                  </Card>
                </div>
              </div>
            )}

            {/* ── LÆR ── */}
            {tab === "laer" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>Forstå boligfinansiering</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 28 }}>Pædagogiske forklaringer på de begreber, der oftest skaber forvirring hos boligejere og nykøbere.</p>

                {aktivtEmne === null ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                    {EMNER.map((e, i) => (
                      <motion.div
                        key={e.titel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="emneCard"
                        onClick={() => setAktivtEmne(i)}
                        style={{ padding: 24, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer" }}
                      >
                        <div style={{ fontSize: 34, marginBottom: 12 }}>{e.ikon}</div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 17, color: "#fff", marginBottom: 8 }}>{e.titel}</div>
                        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{e.kort}</div>
                        <div style={{ color: C.gold, fontSize: 12, marginTop: 14 }}>Læs mere →</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setAktivtEmne(null)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                      ← Tilbage til oversigt
                    </button>
                    <Card>
                      <div style={{ fontSize: 42, marginBottom: 16 }}>{EMNER[aktivtEmne].ikon}</div>
                      <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, color: "#fff", marginBottom: 22 }}>{EMNER[aktivtEmne].titel}</h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {EMNER[aktivtEmne].tekst.map((line, i) => (
                          line.h
                            ? <div key={i} style={{ color: C.gold, fontWeight: 600, fontSize: 14, marginTop: 14 }}>{line.t}</div>
                            : <div key={i} style={{ color: C.muted, fontSize: 14, lineHeight: 1.85 }}>{line.t}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                        {aktivtEmne > 0 && (
                          <button onClick={() => setAktivtEmne(aktivtEmne - 1)} style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>
                            ← {EMNER[aktivtEmne - 1].titel}
                          </button>
                        )}
                        {aktivtEmne < EMNER.length - 1 && (
                          <button onClick={() => setAktivtEmne(aktivtEmne + 1)} style={{ padding: "10px 20px", background: `${C.gold}1a`, border: `1px solid ${C.gold}44`, color: C.gold, borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>
                            {EMNER[aktivtEmne + 1].titel} →
                          </button>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* ── AI ASSISTENT ── */}
            {tab === "ai" && (
              <div>
                <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 30, color: "#fff", marginBottom: 6 }}>AI Boligassistent</h1>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Få beregninger og forklaringer på begreber inden for boligfinansiering, baseret på dine tal fra kalkulatoren.</p>

                {/* Juridisk banner */}
                <div style={{ padding: "14px 18px", background: `${C.warn}0d`, border: `1px solid ${C.warn}33`, borderLeft: `3px solid ${C.warn}`, borderRadius: 8, marginBottom: 22, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>
                    <strong style={{ color: C.warn, fontWeight: 600 }}>Ikke rådgivning.</strong> AI-assistenten leverer udelukkende beregninger og generel information om boligfinansieringsbegreber. Den giver ikke anbefalinger, forholder sig ikke til brugerens situation og udtaler sig ikke om valg. Resultater er vejledende. Indhent uafhængig faglig vurdering hos egen bank eller realkreditinstitut ved konkrete beslutninger.
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 22 }}>
                  <div style={{ display: "flex", flexDirection: "column", height: 580 }}>
                    <div style={{ flex: 1, overflowY: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                      {messages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
                        >
                          <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0", background: m.role === "user" ? `${C.gold}1a` : C.bg, border: `1px solid ${m.role === "user" ? C.gold + "33" : C.border}`, color: C.text, fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                            {m.role === "assistant" && <div style={{ color: C.gold, fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>🤖 Boligassistent</div>}
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                      {aiLoading && (
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                          <div style={{ padding: "12px 16px", borderRadius: "12px 12px 12px 0", background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13 }}>Analyserer…</div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div style={{ display: "flex", border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                      <input className="chatIn" type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="F.eks. 'Beregn ydelse ved 5% rente' eller 'Forklar kurstab'" />
                      <button className="sendBtn" onClick={sendChat} disabled={aiLoading || !chatInput.trim()} style={{ background: chatInput.trim() && !aiLoading ? C.gold : C.border, color: chatInput.trim() && !aiLoading ? "#0d1b2e" : C.muted }}>Send →</button>
                    </div>
                  </div>

                  <div>
                    <Card style={{ marginBottom: 14 }}>
                      <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Dit låne-overblik</div>
                      {[["Restgæld", `${fmt(restgæld)} kr.`], ["Rente", `${rente}% (${lånType})`], ["Bidragssats", `${bidragssats}%`], ["Månedlig ydelse", `${fmt(ydelse)} kr.`], ["LTV", `${ltv.toFixed(1)}%`]].map(([l, v]) => (
                        <div key={l} className="rowItem" style={{ fontSize: 12 }}>
                          <span style={{ color: C.muted }}>{l}</span>
                          <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                    </Card>

                    <Card>
                      <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Foreslåede spørgsmål</div>
                      {["Hvad er forskellen på fast rente og F-kort?", "Beregn effekten af omlægning til 3%", "Forklar bidragssatsen med mine tal", "Hvad er kurstab, og hvornår opstår det?", "Forklar belåningsgrad og gældskvote", "Hvad er refinansiering på et F-kort?"].map(s => (
                        <button key={s} className="suggBtn" onClick={() => setChatInput(s)} style={{ display: "block", width: "100%", padding: "8px 11px", marginBottom: 7, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, cursor: "pointer", fontSize: 11, textAlign: "left", fontFamily: "DM Sans, sans-serif", lineHeight: 1.4 }}>
                          {s}
                        </button>
                      ))}
                    </Card>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer disclaimer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "22px 28px", marginTop: 56, background: "#0a1624" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ color: C.warn, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠️ Juridisk disclaimer</div>
            <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.75, maxWidth: 700 }}>
              Indholdet på platformen er alene til informations- og undervisningsformål. Platformen udgør ikke finansiel rådgivning, lånerådgivning eller anbefalinger, og må ikke anvendes som grundlag for økonomiske beslutninger. Beregninger og AI-genererede analyser er vejledende. Brugere opfordres til at indhente uafhængig faglig vurdering hos egen bank eller realkreditinstitut.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Playfair Display, serif", color: C.gold, fontSize: 18 }}>BoligØkonomi</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 4, letterSpacing: "0.05em" }}>ANALYSE · SIMULATION · UDDANNELSE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
