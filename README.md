# BoligØkonomi

Dansk boliglåns-platform: kalkulator, scenarier, omlægning, sammenligning, leksikon og AI-rådgivning.

## 🚀 Kør lokalt

```bash
npm install
npm run dev
```

Åbn http://localhost:5173

## 📦 Projektstruktur

```
boligoekonomi/
├── api/
│   └── chat.js              # Vercel serverless funktion (AI-proxy)
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── HeroAnimation.jsx   # Auto-spillende hero animation
│   ├── pages/
│   │   ├── LandingPage.jsx     # / — Marketing landing page
│   │   └── AppPage.jsx         # /app — Selve produktet
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json              # Routing til SPA
└── vite.config.js
```

## 🌐 Deploy til Vercel

### Trin 1 — Læg på GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DIT-BRUGERNAVN/boligoekonomi.git
git push -u origin main
```

### Trin 2 — Forbind til Vercel
1. Gå til https://vercel.com/new
2. Importér dit GitHub repo
3. **Build settings** detekteres automatisk (Vite). Klik Deploy.

### Trin 3 — Sæt API-nøgle ⚠️ VIGTIGT
Uden dette virker AI-chatten ikke.

1. Hent din nøgle fra https://console.anthropic.com
2. I Vercel → Project Settings → Environment Variables
3. Tilføj:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-…` (din rigtige nøgle)
   - **Environments**: Production, Preview, Development
4. Re-deploy projektet (Deployments → ⋯ → Redeploy)

## 💸 Når siden er betalt — hvad mangler?

Lige nu er hele appen åben. For at gøre den til et betalt produkt, mangler du:

1. **Betalingsmur** — Stripe Checkout er enkleste vej (~30 min at sætte op)
2. **Login** — Clerk eller Supabase Auth (færdige løsninger)
3. **Rate limiting på `/api/chat`** — så en bruger ikke kan brænde din API-saldo af
4. **Webhook fra Stripe → marker bruger som "betalt"** i database

Sig til når du er klar — det er en separat opgave.

## 🎨 Hvad er ændret siden din original JSX

- **Tilføjet**: Komplet landing page (`LandingPage.jsx`) med hero-animation
- **Tilføjet**: Auto-spillende hero-video (`HeroAnimation.jsx`) — 4 scener der demonstrerer produktet
- **Tilføjet**: Side-overgange med Framer Motion (smooth tab-skift)
- **Tilføjet**: Entrance-animationer på metric-kort og scenarie-grid
- **Tilføjet**: Forbedret slider-design med animeret track og hover glow
- **Tilføjet**: React Router (/ for landing, /app for produkt)
- **Tilføjet**: Subtil grid-baggrund + noise overlay til dybde
- **Tilføjet**: Header med blur backdrop
- **Fikset**: API-kald går nu via `/api/chat` (backend) — ikke direkte fra browser
- **Fikset**: Brand gradient på H1, glow effekter på CTA, hover transitions

## ⚖️ Disclaimer

Indholdet er til informations- og undervisningsformål og udgør ikke finansiel rådgivning.
