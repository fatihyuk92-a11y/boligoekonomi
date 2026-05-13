import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroAnimation from "../components/HeroAnimation.jsx";

const C = {
  bg: "#0d1b2e", bgD: "#0a1624", card: "#162540", cardH: "#1e3254",
  border: "#1f3352", gold: "#c9a84c", goldL: "#e8c97a",
  text: "#e8e4dc", muted: "#7a8fa8",
  ok: "#4caf7d", bad: "#e05c5c", warn: "#f0a04b",
};

const FEATURES = [
  {
    icon: "🏠",
    title: "Realtid-kalkulator",
    text: "Juster restgæld, rente, løbetid og bidragssats — se ydelse, effektiv rente og samlede omkostninger opdatere live.",
  },
  {
    icon: "📈",
    title: "Følsomhedsanalyse",
    text: "Simulér rentestød fra −2% til +3% og se præcis hvor sårbar din økonomi er ved rentestigninger.",
  },
  {
    icon: "🔄",
    title: "Omlægnings-analyse",
    text: "Beregn besparelse, kurstab og break-even ved nedkonvertering. Få overblik over om det kan betale sig.",
  },
  {
    icon: "⚖️",
    title: "Sammenligning",
    text: "Side-om-side sammenligning af de fire realkreditinstitutter med bidragssatser og etableringsomkostninger.",
  },
  {
    icon: "💬",
    title: "AI-rådgivning",
    text: "Stil spørgsmål om dit lån. Assistenten kender dine tal og forklarer kurstab, F-kort, bidragssatser pædagogisk.",
  },
  {
    icon: "📚",
    title: "Pædagogisk leksikon",
    text: "Forstå begreberne der oftest forvirrer — fra refinansiering til op- og nedkonvertering.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, overflow: "hidden", position: "relative" }}>
      {/* Subtle grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${C.border}33 1px, transparent 1px),
          linear-gradient(90deg, ${C.border}33 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.5) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ─────── HEADER ─────── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(13,27,46,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
              borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🏠</div>
            <div>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1 }}>BoligØkonomi</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Analyse · Simulation · Uddannelse</div>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#funktioner" style={{ color: C.muted, fontSize: 13, transition: "color 0.2s" }}
               onMouseEnter={e => e.currentTarget.style.color = C.text}
               onMouseLeave={e => e.currentTarget.style.color = C.muted}>Funktioner</a>
            <a href="#priser" style={{ color: C.muted, fontSize: 13 }}
               onMouseEnter={e => e.currentTarget.style.color = C.text}
               onMouseLeave={e => e.currentTarget.style.color = C.muted}>Priser</a>
            <Link to="/app" style={{
              padding: "9px 18px",
              background: C.gold,
              color: C.bg,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.goldL; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = "translateY(0)"; }}>
              Prøv platformen →
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────── HERO ─────── */}
      <section style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 28px 60px",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 60,
        alignItems: "center",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: `${C.gold}15`,
              border: `1px solid ${C.gold}33`,
              borderRadius: 100,
              fontSize: 11,
              color: C.gold,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, background: C.gold, borderRadius: "50%", boxShadow: `0 0 8px ${C.gold}` }} />
            Lanceret 2026
          </motion.div>

          <h1 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            Forstå dit{" "}
            <span style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}>boliglån</span><br />
            som en bankrådgiver
          </h1>

          <p style={{
            color: C.muted,
            fontSize: 17,
            lineHeight: 1.65,
            marginBottom: 36,
            maxWidth: 480,
          }}>
            Analyse, simulation og uddannelse for danske boligejere. Beregn omlægning, simulér rentescenarier, og få svar fra en AI der kender dine tal — alt på én platform.
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/app" style={{
              padding: "14px 28px",
              background: C.gold,
              color: C.bg,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.02em",
              transition: "all 0.2s",
              boxShadow: `0 8px 20px -8px ${C.gold}66`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 28px -8px ${C.gold}80`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 20px -8px ${C.gold}66`; }}>
              Start nu →
            </Link>
            <a href="#funktioner" style={{
              padding: "14px 24px",
              border: `1px solid ${C.border}`,
              color: C.text,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              Se funktioner
            </a>
          </div>

          {/* Trust row */}
          <div style={{ marginTop: 48, display: "flex", gap: 32, fontSize: 11, color: C.muted, letterSpacing: "0.06em" }}>
            <div>✓ Realtid-beregninger</div>
            <div>✓ Dansk realkredit</div>
            <div>✓ AI-rådgivning</div>
          </div>
        </motion.div>

        {/* Hero animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroAnimation />
        </motion.div>
      </section>

      {/* ─────── FEATURES ─────── */}
      <section id="funktioner" style={{
        position: "relative",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "100px 28px",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
            ── Hvad du får ──
          </div>
          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}>
            Seks værktøjer.<br />
            <span style={{ fontStyle: "italic", color: C.gold }}>Ét samlet overblik.</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 15, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
            Bygget specifikt til dansk realkredit. Hver funktion er designet til at give dig den klarhed, kun en privatbankrådgiver normalt kan levere.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: C.gold }}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 28,
                cursor: "default",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 19,
                color: "#fff",
                marginBottom: 10,
                fontWeight: 600,
              }}>
                {f.title}
              </h3>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.65 }}>
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────── STATS / SOCIAL PROOF ─────── */}
      <section style={{ position: "relative", zIndex: 1, background: C.bgD, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 28px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, textAlign: "center" }}>
          {[
            { v: "30+", l: "Beregningsparametre" },
            { v: "6", l: "Værktøjer" },
            { v: "AI", l: "Personlig rådgivning" },
            { v: "DK", l: "Dansk realkredit" },
          ].map((s) => (
            <div key={s.l}>
              <div style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 44,
                fontWeight: 700,
                color: C.gold,
                lineHeight: 1,
                marginBottom: 8,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{s.v}</div>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────── PRICING ─────── */}
      <section id="priser" style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "100px 28px", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
          ── Pris ──
        </div>
        <h2 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "clamp(32px, 4vw, 44px)",
          color: "#fff",
          letterSpacing: "-0.02em",
          marginBottom: 40,
        }}>
          Adgang til hele platformen
        </h2>

        <div style={{
          maxWidth: 420,
          margin: "0 auto",
          background: `linear-gradient(135deg, ${C.card}, ${C.cardH})`,
          border: `1px solid ${C.gold}33`,
          borderRadius: 16,
          padding: "40px 36px",
          boxShadow: `0 30px 60px -20px rgba(0,0,0,0.4), 0 0 0 1px ${C.gold}11`,
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", background: C.gold, color: C.bg, borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Tidlig adgang
          </div>

          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            Personlig licens
          </div>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: 68, fontWeight: 700, color: "#fff", lineHeight: 1 }}>199</span>
            <span style={{ color: C.muted, fontSize: 14 }}>kr./md.</span>
          </div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 28 }}>Faktureres månedligt · Opsigelse når som helst</div>

          <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px 0", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            {[
              "Adgang til alle 6 værktøjer",
              "Ubegrænset AI-rådgivning",
              "Alle scenarier & simuleringer",
              "Pædagogisk leksikon",
              "Sammenligning af realkreditinstitutter",
              "Løbende opdateringer",
            ].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span style={{ color: C.gold, fontSize: 14 }}>✓</span>
                <span style={{ color: C.text }}>{b}</span>
              </div>
            ))}
          </div>

          <Link to="/app" style={{
            display: "block",
            marginTop: 28,
            padding: "16px",
            background: C.gold,
            color: C.bg,
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            transition: "all 0.2s",
            textAlign: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.goldL; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.gold; }}>
            Kom i gang →
          </Link>

          <div style={{ marginTop: 18, fontSize: 11, color: C.muted }}>
            Demo-adgang uden registrering
          </div>
        </div>
      </section>

      {/* ─────── FOOTER ─────── */}
      <footer style={{ position: "relative", background: C.bgD, borderTop: `1px solid ${C.border}`, zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 28px", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ color: C.warn, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>⚠️ Juridisk disclaimer</div>
            <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.75, maxWidth: 700 }}>
              Indholdet på platformen er alene til informations- og undervisningsformål og udgør ikke finansiel rådgivning eller lånerådgivning. Beregninger og AI-genererede analyser er vejledende og bør ikke stå alene ved økonomiske beslutninger. Kontakt et autoriseret pengeinstitut eller realkreditinstitut for personlig rådgivning.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Playfair Display, serif", color: C.gold, fontSize: 18 }}>BoligØkonomi</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 4, letterSpacing: "0.05em" }}>© 2026 · ALLE RETTIGHEDER FORBEHOLDES</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
