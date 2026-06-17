<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2026_FIFA_World_Cup_logo.svg/1024px-2026_FIFA_World_Cup_logo.svg.png" alt="FIFA World Cup 2026 Logo" width="150" />
  <h1>FIFA World Cup 2026 Hub</h1>
  
  <p>
    <strong>A next-generation, high-performance analytics dashboard and interactive hub for the 2026 FIFA World Cup.</strong>
  </p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite" alt="Vite" /></a>
    <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/Zustand-State_Management-brown?style=for-the-badge" alt="Zustand" /></a>
    <a href="https://framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-Animation-ff0055?style=for-the-badge&logo=framer" alt="Framer Motion" /></a>
  </p>
</div>

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Data Lifecycle & APIs](#-data-lifecycle--apis)
5. [Local Development Setup](#-local-development-setup)
6. [Available Scripts](#-available-scripts)
7. [Design System](#-design-system)
8. [License](#-license)

---

## 🌟 Overview

The **FIFA World Cup 2026 Hub** is an advanced, production-ready web application designed to track the expanded 48-team World Cup hosted across the USA, Canada, and Mexico.

Built with performance and aesthetics in mind, this application bypasses generic UI libraries in favor of a **custom glassmorphic design system**, meticulously styled with vanilla CSS. It utilizes **React 18** and **Framer Motion** for liquid-smooth transitions, and deeply integrates with live **ESPN sports APIs** to deliver real-time data, match events, and dynamic analytics.

---

## ✨ Key Features

- **🔴 Real-Time Live Ticker & Dashboard:** Automatically polls live match data, displaying current scores, goalscorers, cards, and live minutes.
- **🌍 48-Nation Expansion Database:** Fully updated for the 2026 format. Includes deep data for all 48 teams (Group A–L), including historical records, live form, and squad sizes.
- **📊 Advanced Analytics & Radars:** Utilizes `recharts` to generate dynamic Head-to-Head radar charts and statistical comparisons between any two nations.
- **🏆 Dynamic Standings & Brackets:** Auto-calculating group tables that derive recent forms (W/D/L) mathematically from live match APIs.
- **🗺️ Interactive Host City Map:** Integrates `Leaflet` to plot the 16 host stadiums, complete with dynamic fly-to animations and venue data.
- **⚡ Insane Performance:** Built on Vite, utilizing aggressive code-splitting (lazy loading via `Suspense`), ensuring a near-instant Time to Interactive (TTI).

---

## 🏗 Architecture & Folder Structure

The application follows a highly modular, domain-driven architecture to ensure scalability.

```text
FIFA-Pro/
├── .github/workflows/         # CI/CD Pipelines (Auto-build tests)
├── public/                    # Static uncompiled assets
├── src/
│   ├── assets/                # Local images and icons
│   │
│   ├── components/            # Reusable UI & Layouts
│   │   ├── 3d/                # React Three Fiber / WebGL Scenes
│   │   ├── layout/            # App shells, Navigation, and Tickers
│   │   └── ui/                # Dumb/Pure components (Flags, Badges, StatBars)
│   │
│   ├── data/                  # Fallback databases & mock seeds
│   │   ├── teams.ts           # 48-Team dictionary
│   │   ├── matches.ts         # Tournament schedule
│   │   └── ...
│   │
│   ├── hooks/                 # Custom React lifecycle hooks
│   │   └── index.ts           # (e.g., useMediaQuery)
│   │
│   ├── pages/                 # Route-level components (Lazy-loaded)
│   │   ├── Dashboard.tsx      # Entry point & live overview
│   │   ├── Teams.tsx          # Nation grid & filtering
│   │   ├── Standings.tsx      # Group tables & Knockout brackets
│   │   ├── Compare.tsx        # Head-to-head radar analytics
│   │   └── ...
│   │
│   ├── services/              # External integrations
│   │   └── api.ts             # ESPN fetchers & data normalization
│   │
│   ├── store/                 # Global state management
│   │   └── tournamentStore.ts # Zustand implementation (Single source of truth)
│   │
│   ├── styles/                # CSS Architecture
│   │   └── globals.css        # CSS variables, dark mode tokens, animations
│   │
│   ├── types/                 # Global TypeScript definitions
│   │   └── index.ts           
│   │
│   ├── utils/                 # Pure helper functions
│   │   └── index.ts           
│   │
│   ├── App.tsx                # App router configuration
│   └── main.tsx               # React application entry point
│
├── .eslintrc.cjs              # Strict linting rules
├── .prettierrc                # Formatting standards
├── tsconfig.json              # TypeScript compiler options
└── vite.config.ts             # Bundler configuration
```

---

## 📡 Data Lifecycle & APIs

This application relies on **Zustand** to manage global state asynchronously.

1. **Hydration:** Upon mounting, `App.tsx` calls `fetchData()` from `tournamentStore`.
2. **Merging:** `api.ts` makes parallel requests to the **ESPN Soccer API**. It merges live payload data (scores, live minutes, IDs) with our rich local fallbacks (`src/data/`), ensuring the UI never breaks even if the API drops fields.
3. **Reactivity:** A background interval automatically refreshes live match states every 30 seconds without triggering a full page reload, seamlessly updating the UI.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.0.0 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/yourusername/FIFA-Pro.git
cd FIFA-Pro
npm install
```

### 3. Running the Server
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server. |
| `npm run build` | Compiles TypeScript and builds the app for production into `/dist`. |
| `npm run preview` | Boots a local static server to preview the `/dist` production build. |
| `npm run lint` | Runs ESLint across the codebase to catch errors. |

---

## 🎨 Design System

We employ a custom **Dark Mode Glassmorphism** design language tailored specifically for this project. 
All design tokens are strictly managed in `src/styles/globals.css`.

- **Primary Background:** Deep Navy (`#0A0F1E`)
- **Brand Accents:** Gold (`#FFD700`) and Crimson (`#C8102E`)
- **Surfaces:** Elevated translucency (`rgba(28, 35, 56, 0.7)`) backed by heavy `backdrop-filter: blur()`.
- **Animations:** All enter/exit animations and micro-interactions are handled via `framer-motion` variants.

---

## 🤝 Contributing
Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <p><strong>Designed and Developed by Abhranil Singha Roy</strong></p>
</div>
