<h1>FIFA World Cup 2026 Hub</h1>
  
  <p>
    <strong>A next-generation, high-performance analytics dashboard, live tracker, and AI predictor for the 2026 FIFA World Cup.</strong>
  </p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite" alt="Vite" /></a>
    <a href="https://js.tensorflow.org/"><img src="https://img.shields.io/badge/TensorFlow.js-Machine_Learning-FF6F00?style=for-the-badge&logo=tensorflow" alt="TensorFlow.js" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-3D_WebGL-black?style=for-the-badge&logo=three.js" alt="Three.js" /></a>
  </p>
</div>

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Data Lifecycle & APIs](#-data-lifecycle--apis)
5. [Local Development Setup](#-local-development-setup)
6. [Design System](#-design-system)

---

## 🌟 Overview

The **FIFA World Cup 2026 Hub** is an advanced, production-ready web application designed to track the expanded 48-team World Cup hosted across the USA, Canada, and Mexico.

This application bypasses generic UI libraries in favor of a **custom glassmorphic design system**, styled with vanilla CSS. It goes beyond simple data tracking by introducing **in-browser Machine Learning** (via TensorFlow.js) for match prediction, immersive **3D WebGL scenes** (via React Three Fiber), and native **live synchronization** with ESPN's real-time sports APIs.

---

## ✨ Key Features

- **🔴 100% Live Native Synchronization:** All tournament standings, knockouts, top scorers, top playmakers, and match points are computed mathematically in real-time by ingesting live ESPN backend data every 30 seconds.
- **🎥 Cinematic Intro Sequence:** Welcomes users with a highly polished 60FPS `framer-motion` animated transition sequence featuring glowing scanlines and dynamic typography before fading into the hub.
- **🤖 In-Browser AI Prediction Engine:** Leverages `TensorFlow.js` to train a dense neural network dynamically on the user's browser based on live team form, historical data, and current tournament statistics. Predicts match outcomes and runs automated AI-vs-AI simulations.
- **🌍 Immersive 3D Environments:** Utilizes `React Three Fiber` and `@react-three/drei` to render an interactive, floating 3D stadium scene directly in the background of the application.
- **📈 Advanced Dynamic Analytics:** Features real-time `Recharts` graphs covering Confederation Performances via Radar Charts, Top Goalscorers, Assists Leaders, and Goals-by-Minute area curves.
- **🗺️ Interactive Host City Map:** Integrates `Leaflet` to plot the 16 host stadiums in North America, complete with dynamic fly-to animations and real-time active match overlays.
- **⚡ Insane Performance:** Built on Vite, utilizing aggressive code-splitting (lazy loading via `Suspense`), ensuring a near-instant Time to Interactive (TTI).

---

## 🏗 Architecture & Folder Structure

The application follows a strictly typed, highly modular domain-driven architecture built specifically to handle complex synchronous operations, background AI threading, and 3D WebGL contexts without degrading UI performance.

```text
FIFA-Pro/
├── .github/workflows/         # CI/CD Pipelines (Auto-build, test, and deploy)
├── public/                    # Static uncompiled assets (PWA manifests, root favicons)
├── src/
│   ├── assets/                # Local images, SVG icons, and optimized graphical assets
│   │
│   ├── components/            # Reusable UI & Layouts
│   │   ├── 3d/                # React Three Fiber / WebGL Scenes (Immersive interactive elements)
│   │   │   ├── WorldCupScene3D.tsx   # Core 3D stadium environment mapping
│   │   │   └── PerformanceMonitor.tsx # Frame-rate and WebGL fallback handlers
│   │   ├── layout/            # App shells, global Navigation, and Live Tickers
│   │   └── ui/                # Pure/Dumb UI components (Flags, Badges, StatBars)
│   │
│   ├── data/                  # Fallback databases & mock seeds for API resiliency
│   │   ├── teams.ts           # 48-Team dictionary (rosters, colors, configs)
│   │   └── ...                # Mock datasets for offline-mode availability
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── index.ts           # Reusable viewport checks, interval hooks, and observers
│   │
│   ├── pages/                 # Route-level Page Modules (Aggressively Lazy-loaded via Suspense)
│   │   ├── Dashboard.tsx      # Entry point & dynamic live overview (KPIs, Active Matches)
│   │   ├── Compare.tsx        # Head-to-head analytics & AI simulation arena
│   │   ├── MatchDetail.tsx    # Live events timeline and TensorFlow match prediction UI
│   │   ├── Standings.tsx      # Dynamically generated Group Tables & Bracket progression
│   │   └── ...                # Other distinct app modules (Map, Teams, Players, Stats)
│   │
│   ├── services/              # External Integrations & Data Pipelines
│   │   ├── api.ts             # ESPN fetchers, HTTP abstractions, and payload normalization
│   │   └── mlPredictor.ts     # TensorFlow.js Neural Network training loop and inference logic
│   │
│   ├── store/                 # Global state management ecosystem
│   │   └── tournamentStore.ts # Zustand store serving as a mathematical live-calculator
│   │
│   ├── styles/                # CSS Architecture
│   │   └── globals.css        # Root variables, dark mode tokens, and complex micro-animations
│   │
│   ├── types/                 # Global TypeScript definitions & interfaces
│   │   └── index.ts           # Strict typings for Matches, Teams, Stats, and ML Models
│   │
│   ├── utils/                 # Pure helper functions
│   │   └── index.ts           # Math, date parsing, color conversions, etc.
│   │
│   ├── App.tsx                # React Router DOM configuration and Context Providers
│   └── main.tsx               # React application entry point
│
├── .eslintrc.cjs              # Strict linting rules and code-quality enforcement
├── .prettierrc                # Project-wide formatting standards
├── tsconfig.json              # Advanced TypeScript compiler options
└── vite.config.ts             # Bundler configuration (Rollup optimizations, plugins)
```

---

## 📡 Data Lifecycle & APIs

This application relies on **Zustand** to manage global state asynchronously:

1. **Live Hydration:** Upon mounting, `fetchData()` fetches parallel requests from the **ESPN Soccer API**.
2. **Dynamic Processing:** The store inherently acts as a real-time calculator. It computes Team Points, Wins, Draws, Losses, Goals For, Goals Against, and dynamic Live Ratings based on real-time live events.
3. **AI Training Cycle:** Once data is successfully hydrated, the background thread automatically compiles and trains the TensorFlow.js dense neural network on the current tournament data to ensure predictions are completely tailored to real-time form.
4. **Auto-Refresh Reactivity:** An internal interval continuously polls the ESPN endpoint every 30 seconds to keep the application seamlessly live.

---

## 🚀 Local Development Setup

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/yourusername/FIFA-Pro.git
cd FIFA-Pro
npm install
```

### 2. Running the Server
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🎨 Design System

We employ a custom **Dark Mode Glassmorphism** design language:
- **Primary Background:** Deep Navy (`#0A0F1E`)
- **Brand Accents:** Gold (`#FFD700`) and Crimson (`#C8102E`)
- **Surfaces:** Elevated translucency (`rgba(28, 35, 56, 0.7)`) backed by heavy `backdrop-filter: blur()`.

---

<div align="center">
  <p><strong>Designed and Developed by Abhranil Singha Roy</strong></p>
</div>

