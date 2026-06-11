# 🏆 FIFA World Cup 2026 — Tournament Intelligence Platform (WC2026 Hub)

Welcome to the **WC2026 Hub**, a production-grade, real-time FIFA World Cup 2026 Tournament Intelligence Platform. This application provides a comprehensive sports analytics and monitoring dashboard covering every player, team, match, venue, and statistical dimension of the highly anticipated 2026 tournament spanning the USA, Canada, and Mexico.

## 🚀 Key Features

*   **Live Match Simulation:** Real-time tickers, live minute simulation, and real-time score updates.
*   **Deep Analytics:** Comprehensive dashboards tracking 48 teams, 104 matches, 16 stadiums, and over 600 players.
*   **3D Character Animations:** Three.js and React Three Fiber powered cinematic entrances and player hero sequences for legends.
*   **Dark-First Premium UI:** Built with Framer Motion, Recharts, and custom CSS variables mimicking high-end sports broadcast graphics (Neon accents on Navy backgrounds).
*   **Interactive Maps:** Leaflet integration mapping all 16 stadiums across North America.

## 🛠 Tech Stack

*   **Framework:** React 18+ via Vite
*   **Language:** TypeScript
*   **State Management:** Zustand
*   **Routing:** React Router DOM
*   **Styling:** Custom CSS (Design System Tokens) & Tailwind CSS
*   **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
*   **Animations:** Framer Motion, GSAP
*   **Charts/Analytics:** Recharts
*   **Maps:** React Leaflet

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhranilsingharoy-cloud/FIFA-Pro.git
   cd FIFA-Pro
   ```

2. **Install dependencies**
   Due to React 18/19 peer dependency transitions in `react-leaflet` and `drei`, ensure you install with legacy peer dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

*   `/src/components`: UI components, 3D scenes (`/3d`), and layout shells.
*   `/src/data`: Mock datasets for teams, players, matches, legends, stadiums, and prizes.
*   `/src/pages`: 12 distinct analytical dashboards (Dashboard, Schedule, Teams, Players, Stats, Prizes, etc.).
*   `/src/store`: Zustand tournament state and live match simulator.
*   `/src/styles`: Global CSS design tokens and base styles.

## 📄 License

MIT License
