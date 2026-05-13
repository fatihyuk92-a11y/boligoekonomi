import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  bg: "#0d1b2e", card: "#162540", cardH: "#1e3254",
  border: "#1f3352", gold: "#c9a84c", goldL: "#e8c97a",
  text: "#e8e4dc", muted: "#7a8fa8",
  ok: "#4caf7d", bad: "#e05c5c", warn: "#f0a04b",
};

const fmt = (n) => Math.round(n).toLocaleString("da-DK");

/**
 * HeroAnimation — auto-playing "product video" built entirely in SVG/HTML
 * Cycles through 4 scenes demonstrating the app in action:
 *   1) Calculator: ghost cursor adjusts slider, numbers count up
 *   2) Scenarios: bar chart draws itself
 *   3) AI Chat: assistant types out a response
 *   4) Result: payoff frame with hero metric
 */
export default function HeroAnimation() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScene((s) => (s + 1) % 4), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 11",
      maxWidth: 640,
      margin: "0 auto",
    }}>
      {/* Glow halo behind frame */}
      <div style={{
        position: "absolute",
        inset: "-40px",
        background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0) 60%)",
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Browser frame */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: C.card,
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)",
        overflow: "hidden",
      }}>
        {/* Browser chrome */}
        <div style={{
          height: 32,
          background: "#0a1624",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 6,
        }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
          <div style={{
            flex: 1,
            margin: "0 12px",
            height: 18,
            background: C.card,
            borderRadius: 4,
            fontSize: 9,
            color: C.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "0.05em",
          }}>
            boligoekonomi.dk
          </div>
        </div>

        {/* Scene container */}
        <div style={{ position: "relative", height: "calc(100% - 32px)" }}>
          <AnimatePresence mode="wait">
            {scene === 0 && <SceneCalculator key="calc" />}
            {scene === 1 && <SceneScenarios key="scen" />}
            {scene === 2 && <SceneAI key="ai" />}
            {scene === 3 && <SceneResult key="res" />}
          </AnimatePresence>
        </div>

        {/* Scene indicator */}
        <div style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          zIndex: 10,
        }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              width: i === scene ? 18 : 6,
              height: 3,
              borderRadius: 2,
              background: i === scene ? C.gold : `${C.gold}33`,
              transition: "all 0.4s",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SCENE 1: CALCULATOR ─────────────── */
function SceneCalculator() {
  const [sliderPos, setSliderPos] = useState(0.4);
  const [ydelse, setYdelse] = useState(9540);

  useEffect(() => {
    // Animate slider from 0.4 to 0.7 over the scene
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 2.2, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const newPos = 0.4 + (0.7 - 0.4) * eased;
      setSliderPos(newPos);
      setYdelse(Math.round(9540 + (14820 - 9540) * eased));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "18px 22px", height: "100%", position: "relative" }}
    >
      <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
        🏠 Boliglånskalkulator
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
        {/* Left: slider mock */}
        <div style={{ background: C.bg, padding: 14, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 8, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Restgæld</div>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 600, marginBottom: 8, fontFamily: "Playfair Display, serif" }}>
            {fmt(500000 + sliderPos * 9500000)} kr.
          </div>
          {/* Track */}
          <div style={{ position: "relative", height: 3, background: C.border, borderRadius: 2, marginBottom: 14 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${sliderPos * 100}%`, background: C.gold, borderRadius: 2, transition: "width 0.1s" }} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ position: "absolute", left: `${sliderPos * 100}%`, top: "50%", transform: "translate(-50%, -50%)", width: 11, height: 11, borderRadius: "50%", background: C.gold, boxShadow: "0 0 0 4px rgba(201,168,76,0.2)" }}
            />
          </div>
          <div style={{ fontSize: 8, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rente</div>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 600, marginBottom: 8, fontFamily: "Playfair Display, serif" }}>4,00%</div>
          <div style={{ position: "relative", height: 3, background: C.border, borderRadius: 2 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "37%", background: C.gold, borderRadius: 2 }} />
            <div style={{ position: "absolute", left: "37%", top: "50%", transform: "translate(-50%, -50%)", width: 9, height: 9, borderRadius: "50%", background: C.gold }} />
          </div>
        </div>
        {/* Right: result metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <MockMetric label="Månedlig ydelse" value={`${fmt(ydelse)} kr.`} highlight />
          <MockMetric label="Effektiv rente" value="4,75%" />
          <MockMetric label="Belåningsgrad" value={`${(sliderPos * 100).toFixed(1)}%`} />
        </div>
      </div>

      {/* Ghost cursor */}
      <motion.svg
        width="20" height="20" viewBox="0 0 20 20"
        initial={{ x: 60, y: 70, opacity: 0 }}
        animate={{ x: 100 + sliderPos * 60, y: 80, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: "absolute", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))", zIndex: 5, pointerEvents: "none" }}
      >
        <path d="M2 2 L2 14 L6 10 L9 16 L11 15 L8 9 L14 9 Z" fill="#fff" stroke="#0d1b2e" strokeWidth="0.8" />
      </motion.svg>
    </motion.div>
  );
}

function MockMetric({ label, value, highlight }) {
  return (
    <div style={{
      background: highlight ? `${C.gold}10` : C.bg,
      border: `1px solid ${highlight ? C.gold + "44" : C.border}`,
      borderRadius: 8,
      padding: "10px 12px",
    }}>
      <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, color: highlight ? C.gold : C.text, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>{value}</div>
    </div>
  );
}

/* ─────────────── SCENE 2: SCENARIOS ─────────────── */
function SceneScenarios() {
  const bars = [
    { label: "−2%", value: 0.55, ydelse: 7480, color: C.ok },
    { label: "−1%", value: 0.72, ydelse: 8910, color: C.ok },
    { label: "0%", value: 0.88, ydelse: 10433, color: C.gold },
    { label: "+1%", value: 1.04, ydelse: 12080, color: C.warn },
    { label: "+2%", value: 1.20, ydelse: 13840, color: C.warn },
    { label: "+3%", value: 1.38, ydelse: 15710, color: C.bad },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "18px 22px", height: "100%" }}
    >
      <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
        📈 Rentescenarier
      </div>
      <div style={{ fontSize: 14, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 18 }}>
        Følsomhedsanalyse — ydelse ved rentestød
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", height: 170, gap: 8, padding: "0 8px", position: "relative" }}>
        {/* baseline reference line */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 65, borderTop: `1px dashed ${C.gold}55`, zIndex: 0 }}>
          <span style={{ position: "absolute", right: 0, top: -14, fontSize: 8, color: C.gold, letterSpacing: "0.04em" }}>NU</span>
        </div>

        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1, height: "100%", justifyContent: "flex-end" }}>
            {/* value label */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 + 0.5, duration: 0.4 }}
              style={{ fontSize: 8.5, color: b.color, fontWeight: 700, fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" }}
            >
              {fmt(b.ydelse)}
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${b.value * 60}%` }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: "100%", background: b.color, borderRadius: "3px 3px 0 0", minHeight: 4, boxShadow: `0 0 12px ${b.color}40` }}
            />
            <div style={{ fontSize: 9, color: C.muted, fontWeight: 500 }}>{b.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 8.5, color: C.muted, textAlign: "center", marginTop: 6, letterSpacing: "0.04em" }}>
        Månedlig ydelse i kr. ved renteændring
      </div>
    </motion.div>
  );
}

/* ─────────────── SCENE 3: AI CHAT ─────────────── */
function SceneAI() {
  const fullText = "Beregning: Ved restgæld 2,4 mio., omlægning fra 4% til 3% reducerer månedlig ydelse med ca. 1.380 kr. Kurstab udgør ~72.000 kr. Break-even efter 52 mdr.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "18px 22px", height: "100%" }}
    >
      <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
        💬 AI Boligassistent
      </div>

      {/* user message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}
      >
        <div style={{ maxWidth: "75%", padding: "9px 13px", background: `${C.gold}1a`, border: `1px solid ${C.gold}33`, borderRadius: "10px 10px 0 10px", fontSize: 11, color: C.text }}>
          Beregn effekten af omlægning fra 4% til 3%
        </div>
      </motion.div>

      {/* assistant message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <div style={{ maxWidth: "85%", padding: "11px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px 10px 10px 0", fontSize: 11, color: C.text, lineHeight: 1.6 }}>
          <div style={{ color: C.gold, fontSize: 8, fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>🤖 Boligassistent</div>
          {typed}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ display: "inline-block", width: 6, height: 11, background: C.gold, marginLeft: 2, verticalAlign: "middle" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── SCENE 4: RESULT / HERO PAYOFF ─────────────── */
function SceneResult() {
  const [saved, setSaved] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const target = 487000;
    const t = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 1.6, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setSaved(Math.round(target * eased));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "22px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 14 }}
      >
        Potentiel besparelse over løbetid
      </motion.div>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 52, color: C.gold, fontWeight: 700, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em" }}>
        {fmt(saved)} kr.
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ fontSize: 11, color: C.muted, maxWidth: 320, lineHeight: 1.6, marginTop: 4 }}
      >
        Ved omlægning fra 4% til 3% rente
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        style={{ marginTop: 22, display: "flex", gap: 18, fontSize: 10, color: C.muted }}
      >
        <div>✓ Beregning på sekunder</div>
        <div>✓ Inkl. kurstab</div>
        <div>✓ Break-even analyse</div>
      </motion.div>
    </motion.div>
  );
}
