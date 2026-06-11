import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import WorldCupScene3D from './components/3d/WorldCupScene3D';
import './styles/globals.css';
import { lazy, Suspense } from 'react';
import { useTournamentStore } from './store/tournamentStore';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Teams = lazy(() => import('./pages/Teams'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));
const Players = lazy(() => import('./pages/Players'));
const PlayerDetail = lazy(() => import('./pages/PlayerDetail'));
const Matches = lazy(() => import('./pages/Matches'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const Stadiums = lazy(() => import('./pages/Stadiums'));
const StadiumDetail = lazy(() => import('./pages/StadiumDetail'));
const Standings = lazy(() => import('./pages/Standings'));
const Stats = lazy(() => import('./pages/Stats'));
const Prizes = lazy(() => import('./pages/Prizes'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--surface-elevated)', borderTopColor: 'var(--brand-gold)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
    </div>
  );
}

function AppContent() {
  const performanceMode = useTournamentStore(s => s.performanceMode);

  return (
    <>
      {!performanceMode && <WorldCupScene3D variant="dashboard" />}
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:countryCode" element={<TeamDetail />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:playerId" element={<PlayerDetail />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/matches/:matchId" element={<MatchDetail />} />
              <Route path="/stadiums" element={<Stadiums />} />
              <Route path="/stadiums/:stadiumId" element={<StadiumDetail />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/prizes" element={<Prizes />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return <AppContent />;
}
