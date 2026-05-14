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
 * HeroAnimation — auto-playing product tour built in SVG/HTML.
 * Cycles through 8 scenes that demonstrate every major platform feature.
 * Each scene runs ~4.2s. Full loop ~33s.
 */
const SCENE_LABELS = [
  { icon: "🏠", label: "Kalkulator" },
  { icon: "📊", label: "Friværdi" },
  { icon: "📈", label: "Scenarier" },
  { icon: "🎯", label: "Risikoprofil" },
  { icon: "🔄", label: "Omlægning" },
  { icon: "⚖️", label: "Sammenlign" },
  { icon: "🌍", label: "Markeder" },
  { icon: "💬", label: "AI + Resultat" },
];

const SCENE_DURATION = 4200;

export default function HeroAnimation() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScene((s) => (s + 1) % SCENE_LABELS.length), SCENE_DURATION);
    return () => clearInterval(t);
  }, []);

  const SceneComponent = [
    SceneCalculator, SceneFriværdi, SceneScenarios, SceneRiskProfile,
    SceneOmlægning, SceneSammenlign, SceneMarkeder, SceneAIResult,
  ][scene];

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 11",
      maxWidth: 640,
      margin: "0 auto",
    }}>
      {/* Glow halo */}
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
          height: 30,
          background: "#0a1624",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 6,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
          <div style={{
            flex: 1,
            margin: "0 10px",
            height: 16,
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

        {/* Scene */}
        <div style={{ position: "relative", height: "calc(100% - 30px - 38px)" }}>
          <AnimatePresence mode="wait">
            <SceneComponent key={scene} />
          </AnimatePresence>
        </div>

        {/* Bottom progress strip — shows all scenes */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 38,
          background: "#0a1624",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 8px",
        }}>
          {SCENE_LABELS.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              opacity: i === scene ? 1 : 0.35,
              transition: "opacity 0.4s",
              position: "relative",
              flex: 1,
            }}>
              <div style={{ fontSize: 11, lineHeight: 1 }}>{s.icon}</div>
              <div style={{ fontSize: 7.5, color: i === scene ? C.gold : C.muted, letterSpacing: "0.04em", fontWeight: i === scene ? 700 : 500, whiteSpace: "nowrap" }}>
                {s.label}
              </div>
              {i === scene && (
                <motion.div
                  layoutId="activeBar"
                  style={{ position: "absolute", bottom: -1, left: "20%", right: "20%", height: 2, background: C.gold, borderRadius: 1 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Wrapper for scenes ─────────── */
function SceneFrame({ icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "14px 20px", height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
        {icon} {title}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </motion.div>
  );
}

/* ─────── SCENE 1: CALCULATOR ─────── */
function SceneCalculator() {
  const [sliderPos, setSliderPos] = useState(0.4);
  const [ydelse, setYdelse] = useState(9540);

  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 2.2, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setSliderPos(0.4 + (0.7 - 0.4) * eased);
      setYdelse(Math.round(9540 + (14820 - 9540) * eased));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  return (
    <SceneFrame icon="🏠" title="Boliglånskalkulator">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 12 }}>
        Realtid-beregninger
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12 }}>
        <div style={{ background: C.bg, padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 8, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Restgæld</div>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 600, marginBottom: 8, fontFamily: "Playfair Display, serif" }}>
            {fmt(500000 + sliderPos * 9500000)} kr.
          </div>
          <div style={{ position: "relative", height: 3, background: C.border, borderRadius: 2, marginBottom: 14 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${sliderPos * 100}%`, background: C.gold, borderRadius: 2 }} />
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <MockMetric label="Månedlig ydelse" value={`${fmt(ydelse)} kr.`} highlight />
          <MockMetric label="Effektiv rente" value="4,75%" />
          <MockMetric label="Belåningsgrad" value={`${(sliderPos * 100).toFixed(1)}%`} />
        </div>
      </div>
    </SceneFrame>
  );
}

function MockMetric({ label, value, highlight }) {
  return (
    <div style={{
      background: highlight ? `${C.gold}10` : C.bg,
      border: `1px solid ${highlight ? C.gold + "44" : C.border}`,
      borderRadius: 7,
      padding: "8px 11px",
    }}>
      <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, color: highlight ? C.gold : C.text, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>{value}</div>
    </div>
  );
}

/* ─────── SCENE 2: FRIVÆRDI ─────── */
function SceneFriværdi() {
  const points = [];
  let bal = 2400000;
  const mr = 0.04 / 12;
  const ydelse = bal * mr / (1 - Math.pow(1 + mr, -360));
  const boligvaerdi = 3500000;
  for (let yr = 0; yr <= 30; yr++) {
    points.push({ yr, gæld: bal, friværdi: boligvaerdi - bal });
    for (let m = 0; m < 12 && bal > 0; m++) {
      bal = Math.max(0, bal - (ydelse - bal * mr));
    }
  }
  const maxVal = boligvaerdi;
  const W = 100, H = 60;
  const xScale = (yr) => (yr / 30) * W;
  const yScale = (v) => H - (v / maxVal) * H;

  return (
    <SceneFrame icon="📊" title="Friværdi over tid">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 12 }}>
        Sådan vokser din friværdi over 30 år
      </div>
      <div style={{ background: C.bg, borderRadius: 8, border: `1px solid ${C.border}`, padding: 16, position: "relative", height: "calc(100% - 28px)" }}>
        <svg viewBox={`0 0 ${W} ${H + 8}`} preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="gG-hero" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.bad} stopOpacity={0.45} />
              <stop offset="95%" stopColor={C.bad} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fG-hero" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.ok} stopOpacity={0.45} />
              <stop offset="95%" stopColor={C.ok} stopOpacity={0} />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map(p => (
            <line key={p} x1={0} x2={W} y1={H * p} y2={H * p} stroke={C.border} strokeWidth={0.15} strokeDasharray="0.5 0.5" />
          ))}

          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            d={`M ${xScale(0)} ${yScale(points[0].gæld)} ${points.map(p => `L ${xScale(p.yr)} ${yScale(p.gæld)}`).join(" ")} L ${W} ${H} L 0 ${H} Z`}
            fill="url(#gG-hero)"
            stroke={C.bad}
            strokeWidth={0.4}
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
            d={`M ${xScale(0)} ${yScale(points[0].friværdi)} ${points.map(p => `L ${xScale(p.yr)} ${yScale(p.friværdi)}`).join(" ")} L ${W} ${H} L 0 ${H} Z`}
            fill="url(#fG-hero)"
            stroke={C.ok}
            strokeWidth={0.4}
          />
        </svg>

        <div style={{ position: "absolute", top: 14, right: 18, fontSize: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
            <span style={{ width: 8, height: 2, background: C.bad }} />
            <span style={{ color: C.muted }}>Restgæld</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 2, background: C.ok }} />
            <span style={{ color: C.muted }}>Friværdi</span>
          </div>
        </div>

        <div style={{ position: "absolute", left: 16, right: 16, bottom: 4, display: "flex", justifyContent: "space-between", fontSize: 7, color: C.muted }}>
          <span>År 0</span><span>10</span><span>20</span><span>30</span>
        </div>
      </div>
    </SceneFrame>
  );
}

/* ─────── SCENE 3: SCENARIOS ─────── */
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
    <SceneFrame icon="📈" title="Rentescenarier">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 12 }}>
        Følsomhedsanalyse — ydelse ved rentestød
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", height: "calc(100% - 40px)", gap: 8, padding: "0 4px", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 38, borderTop: `1px dashed ${C.gold}55`, zIndex: 0 }}>
          <span style={{ position: "absolute", right: 0, top: -12, fontSize: 7, color: C.gold, letterSpacing: "0.04em" }}>NUVÆRENDE</span>
        </div>

        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, zIndex: 1, height: "100%", justifyContent: "flex-end" }}>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.5, duration: 0.4 }}
              style={{ fontSize: 8, color: b.color, fontWeight: 700, fontFamily: "Playfair Display, serif" }}
            >
              {fmt(b.ydelse)}
            </motion.div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${b.value * 55}%` }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: "100%", background: b.color, borderRadius: "3px 3px 0 0", minHeight: 4, boxShadow: `0 0 12px ${b.color}40` }}
            />
            <div style={{ fontSize: 8, color: C.muted, fontWeight: 500 }}>{b.label}</div>
          </div>
        ))}
      </div>
    </SceneFrame>
  );
}

/* ─────── SCENE 4: RISK PROFILE ─────── */
function SceneRiskProfile() {
  const [profile, setProfile] = useState(0);
  const profiles = [
    { name: "Konservativ", color: C.ok, range: "−1% til +5%", focus: "Rentestigninger" },
    { name: "Moderat", color: C.warn, range: "−2% til +3%", focus: "Symmetrisk balance" },
    { name: "Aggressiv", color: C.bad, range: "−3% til +2%", focus: "Rentefald" },
  ];

  useEffect(() => {
    const t = setInterval(() => setProfile(p => (p + 1) % 3), 1300);
    return () => clearInterval(t);
  }, []);

  return (
    <SceneFrame icon="🎯" title="Risikoprofil">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 16 }}>
        Tilpas analysen til din risikovillighed
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {profiles.map((p, i) => (
          <div key={p.name} style={{
            flex: 1,
            padding: "8px 6px",
            borderRadius: 7,
            border: `1px solid ${profile === i ? p.color : C.border}`,
            background: profile === i ? `${p.color}1a` : "transparent",
            transition: "all 0.4s",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: profile === i ? p.color : C.muted, fontWeight: profile === i ? 700 : 500 }}>{p.name}</div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={profile}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.35 }}
          style={{
            background: `${profiles[profile].color}0d`,
            border: `1px solid ${profiles[profile].color}33`,
            borderLeft: `3px solid ${profiles[profile].color}`,
            borderRadius: 7,
            padding: "10px 14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Aktivt scenarie-spænd</span>
            <span style={{ fontSize: 13, color: profiles[profile].color, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>
              {profiles[profile].range}
            </span>
          </div>
          <div style={{ fontSize: 10, color: C.muted }}>Fokus: <span style={{ color: profiles[profile].color, fontWeight: 600 }}>{profiles[profile].focus}</span></div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: 14, position: "relative", height: 18 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 8, height: 2, background: C.border, borderRadius: 1 }} />
        <motion.div
          key={`bar-${profile}`}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: 7,
            height: 4,
            background: profiles[profile].color,
            borderRadius: 2,
            boxShadow: `0 0 8px ${profiles[profile].color}66`,
            left: profile === 0 ? "30%" : profile === 1 ? "15%" : "0%",
            right: profile === 0 ? "0%" : profile === 1 ? "15%" : "30%",
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 13, fontSize: 7, color: C.muted }}>−3%</div>
        <div style={{ position: "absolute", left: "50%", top: 13, fontSize: 7, color: C.muted, transform: "translateX(-50%)" }}>0%</div>
        <div style={{ position: "absolute", right: 0, top: 13, fontSize: 7, color: C.muted }}>+5%</div>
      </div>
    </SceneFrame>
  );
}

/* ─────── SCENE 5: OMLÆGNING ─────── */
function SceneOmlægning() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 2.0, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);

  const nyRente = 4.0 - (1.0 * progress);
  const oldYdelse = 11460;
  const newYdelse = 11460 - (1380 * progress);
  const besparelse = oldYdelse - newYdelse;

  return (
    <SceneFrame icon="🔄" title="Omlægning">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 12 }}>
        Beregn ny ydelse + break-even
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <div style={{ background: C.bg, padding: 10, borderRadius: 7, border: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Nuværende</div>
          <div style={{ fontSize: 17, color: C.muted, fontWeight: 700, fontFamily: "Playfair Display, serif", lineHeight: 1 }}>4,00%</div>
          <div style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{fmt(oldYdelse)} kr./md.</div>
        </div>
        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: C.gold, fontSize: 18 }}>→</motion.div>
        <div style={{ background: `${C.gold}10`, padding: 10, borderRadius: 7, border: `1px solid ${C.gold}44`, textAlign: "center" }}>
          <div style={{ fontSize: 7, color: C.gold, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Nyt lån</div>
          <div style={{ fontSize: 17, color: C.gold, fontWeight: 700, fontFamily: "Playfair Display, serif", lineHeight: 1 }}>{nyRente.toFixed(2)}%</div>
          <div style={{ fontSize: 9, color: C.ok, marginTop: 4, fontWeight: 600 }}>{fmt(newYdelse)} kr./md.</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, color: C.muted, marginBottom: 4 }}>
          <span>NY RENTE</span><span style={{ color: C.gold }}>{nyRente.toFixed(2)}%</span>
        </div>
        <div style={{ position: "relative", height: 3, background: C.border, borderRadius: 2 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(1 - progress) * 40 + 30}%`, background: C.gold, borderRadius: 2 }} />
          <div style={{ position: "absolute", left: `${(1 - progress) * 40 + 30}%`, top: "50%", transform: "translate(-50%, -50%)", width: 10, height: 10, borderRadius: "50%", background: C.gold, boxShadow: `0 0 0 4px ${C.gold}33` }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: `${C.ok}0d`, border: `1px solid ${C.ok}33`, borderRadius: 7, padding: "7px 10px" }}>
          <div style={{ fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Besparelse</div>
          <div style={{ fontSize: 13, color: C.ok, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>−{fmt(besparelse)} kr./md.</div>
        </div>
        <div style={{ background: `${C.gold}0d`, border: `1px solid ${C.gold}33`, borderRadius: 7, padding: "7px 10px" }}>
          <div style={{ fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Break-even</div>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>{Math.round(52 + (1-progress)*30)} mdr.</div>
        </div>
      </div>
    </SceneFrame>
  );
}

/* ─────── SCENE 6: SAMMENLIGN ─────── */
function SceneSammenlign() {
  const institutes = [
    { name: "Jyske Realkredit", bidrag: 0.65, ydelse: 10120, lowest: true },
    { name: "Realkredit Danmark", bidrag: 0.70, ydelse: 10250 },
    { name: "Totalkredit", bidrag: 0.75, ydelse: 10380 },
    { name: "Nordea Kredit", bidrag: 0.80, ydelse: 10510 },
  ];

  return (
    <SceneFrame icon="⚖️" title="Sammenlign realkreditinstitutter">
      <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 10 }}>
        Bidragssatser side om side
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {institutes.map((inst, i) => {
          const maxBidrag = 0.80, minBidrag = 0.60;
          const w = ((inst.bidrag - minBidrag) / (maxBidrag - minBidrag)) * 100;
          return (
            <motion.div
              key={inst.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "0.9fr 1fr 0.5fr",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                background: inst.lowest ? `${C.gold}10` : "transparent",
                border: `1px solid ${inst.lowest ? C.gold + "44" : C.border}`,
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 9, color: inst.lowest ? C.gold : C.text, fontWeight: inst.lowest ? 600 : 500, display: "flex", alignItems: "center", gap: 5 }}>
                {inst.lowest && <span style={{ fontSize: 9 }}>⭐</span>}
                {inst.name}
              </div>
              <div style={{ position: "relative", height: 6, background: C.border, borderRadius: 3 }}>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.12 + 0.3, duration: 0.6, ease: "easeOut" }}
                  style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${w}%`, background: inst.lowest ? C.gold : C.muted, borderRadius: 3, minWidth: 4 }}
                />
              </div>
              <div style={{ fontSize: 10, color: inst.lowest ? C.gold : C.text, fontWeight: 700, fontFamily: "Playfair Display, serif", textAlign: "right" }}>
                {inst.bidrag.toFixed(2)}%
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ marginTop: 10, fontSize: 8, color: C.muted, textAlign: "center", letterSpacing: "0.05em" }}
      >
        Forskel på {fmt(institutes[3].ydelse - institutes[0].ydelse)} kr./md. mellem dyreste og billigste
      </motion.div>
    </SceneFrame>
  );
}

/* ─────── SCENE 7: MARKEDER ─────── */
function SceneMarkeder() {
  const banks = [
    { name: "ECB", flag: "🇪🇺", rate: 2.50, label: "Indlånsfacilitet", color: "#003299", change: -0.25 },
    { name: "Fed", flag: "🇺🇸", rate: 4.50, label: "Fed Funds Upper", color: "#1a4480", change: 0 },
    { name: "Nationalb.", flag: "🇩🇰", rate: 2.35, label: "Udlånsrente", color: "#c8102e", change: -0.25 },
  ];

  return (
    <SceneFrame icon="🌍" title="Markeder & Centralbanker">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif" }}>
          Live data fra officielle kilder
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8, color: C.ok }}
        >
          <span style={{ width: 5, height: 5, background: C.ok, borderRadius: "50%", boxShadow: `0 0 6px ${C.ok}` }} />
          LIVE
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {banks.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              padding: "10px 11px",
              borderTop: `2px solid ${b.color}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
              <span style={{ fontSize: 11 }}>{b.flag}</span>
              <span style={{ fontSize: 9, color: "#fff", fontWeight: 600 }}>{b.name}</span>
            </div>
            <div style={{ fontSize: 7, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{b.label}</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              style={{ fontSize: 18, color: C.gold, fontFamily: "Playfair Display, serif", fontWeight: 700, lineHeight: 1 }}
            >
              {b.rate.toFixed(2)}%
            </motion.div>
            {b.change !== 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.5 }}
                style={{ fontSize: 8, marginTop: 3, color: b.change > 0 ? C.bad : C.ok, fontWeight: 600 }}
              >
                {b.change > 0 ? "▲" : "▼"} {Math.abs(b.change).toFixed(2)} pp
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          marginTop: 12,
          padding: "7px 11px",
          background: `${C.gold}0d`,
          border: `1px solid ${C.gold}33`,
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>⏰ Næste planlagte møde</span>
        <span style={{ fontSize: 10, color: C.gold, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>5. feb 2026 · ECB</span>
      </motion.div>
    </SceneFrame>
  );
}

/* ─────── SCENE 8: AI + RESULT ─────── */
function SceneAIResult() {
  const [phase, setPhase] = useState(0);
  const fullText = "Beregning: Omlægning fra 4% til 3% reducerer ydelse med 1.380 kr./md. Break-even efter 52 mdr.";
  const [typed, setTyped] = useState("");
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typer);
        setTimeout(() => setPhase(1), 400);
      }
    }, 20);
    return () => clearInterval(typer);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    const start = Date.now();
    const target = 487000;
    const counter = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const p = Math.min(elapsed / 1.2, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setSaved(Math.round(target * eased));
      if (p === 1) clearInterval(counter);
    }, 16);
    return () => clearInterval(counter);
  }, [phase]);

  return (
    <SceneFrame icon="💬" title="AI Assistent + Resultat">
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ fontSize: 13, color: "#fff", fontFamily: "Playfair Display, serif", marginBottom: 14 }}>
              Spørg AI'en — få svar på dine tal
            </div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
            >
              <div style={{ maxWidth: "78%", padding: "8px 11px", background: `${C.gold}1a`, border: `1px solid ${C.gold}33`, borderRadius: "10px 10px 0 10px", fontSize: 10, color: C.text }}>
                Beregn effekten af omlægning fra 4% til 3%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div style={{ maxWidth: "85%", padding: "9px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: "10px 10px 10px 0", fontSize: 10, color: C.text, lineHeight: 1.55 }}>
                <div style={{ color: C.gold, fontSize: 7, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>🤖 Boligassistent</div>
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ display: "inline-block", width: 5, height: 10, background: C.gold, marginLeft: 2, verticalAlign: "middle" }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
          >
            <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 10 }}>
              Potentiel besparelse over løbetid
            </div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 46, color: C.gold, fontWeight: 700, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em" }}>
              {fmt(saved)} kr.
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ fontSize: 9, color: C.muted, maxWidth: 280, lineHeight: 1.5 }}
            >
              Ved omlægning fra 4% til 3% rente
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              style={{ marginTop: 14, display: "flex", gap: 14, fontSize: 8, color: C.muted }}
            >
              <div>✓ Inkl. kurstab</div>
              <div>✓ Inkl. stiftelsesomk.</div>
              <div>✓ Break-even analyse</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneFrame>
  );
}
