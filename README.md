# IUM Intake Course Guide

Premium futuristic interactive university intake-day website for **Islamic University of Maldives**. Built for the **August 2026 Intake**.

## ✨ Features
- Fullscreen animated hero with glowing intake badge + voice search
- Programme category cards (Postgraduate / Undergraduate / Certificate & Diploma)
- **Find My Course** quiz — 5 animated questions, weighted match results with celebration
- Browse + search + filter all programmes (category, faculty, level, mode, campus, intake status)
- Premium programme details modal with tabs (Overview, Requirements, Careers, Related)
- AI-style **Course Assistant** chat (local keyword logic, no API needed)
- Interest form saved to `localStorage`
- **Admin dashboard** (passkey: `ium2026`) with overview, CRUD, JSON/CSV import & export

## 🛠 Stack
- Vite + React 18
- Tailwind CSS
- Framer Motion (animations)
- lucide-react (icons)
- 100% client-side — no backend, no Firebase, ready for **GitHub + Vercel**

## 🚀 Run locally
```bash
npm install
npm run dev
```

## 📦 Build for production
```bash
npm run build
npm run preview
```

## ☁️ Deploy to Vercel
1. Push this repo to GitHub
2. Import on [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — just click **Deploy**

`vercel.json` already configured.

## 📝 Editing programmes
Open `src/data/programmes.js` and edit the `PROGRAMMES` array.
Each programme object includes: `id`, `programmeName`, `category`, `faculty`, `level`, `duration`, `studyMode`, `campus`, `intake`, `intakeStatus`, `fee`, `seats`, `description`, `entryRequirements`, `keywords`, `interests`, `careerPaths`, `skills`, `applyLink`, `brochureLink`, `officialPageLink`, `featured`.

Alternatively use the **Admin dashboard** to add/edit/delete programmes — changes are stored in the browser's `localStorage`. Use the **Export JSON** button to bake them back into the file.

## 🔐 Admin
- Click `Admin` in navbar/footer → enter passkey `ium2026`
- Change the passkey in `src/components/AdminDashboard.jsx` (`PASSKEY` constant)
