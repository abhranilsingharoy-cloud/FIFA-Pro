import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Globe, Users, Trophy,
  BarChart3, MapPin, DollarSign, List, Zap, Menu, X, Cpu,
  GitMerge, Swords, Map, Newspaper
} from 'lucide-react';
import { useTournamentStore } from '../../store/tournamentStore';
import LiveTicker from './LiveTicker';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/teams', label: 'Teams', icon: Globe },
  { path: '/players', label: 'Players', icon: Users },
  { path: '/matches', label: 'Matches', icon: List },
  { path: '/bracket', label: 'Bracket', icon: GitMerge },
  { path: '/standings', label: 'Standings', icon: Trophy },
  { path: '/stadiums', label: 'Venues', icon: MapPin },
  { path: '/map', label: 'Map', icon: Map },
  { path: '/stats', label: 'Stats', icon: BarChart3 },
  { path: '/compare', label: 'Compare', icon: Swords },
  { path: '/news', label: 'News', icon: Newspaper },
  { path: '/prizes', label: 'Prizes', icon: DollarSign },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { liveMatches, sidebarOpen, toggleSidebar, performanceMode, togglePerformanceMode } = useTournamentStore();
  const location = useLocation();

  useEffect(() => {
    if (sidebarOpen) toggleSidebar();
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--brand-navy)' }}>
      {/* ─── TOP NAV ─────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,15,30,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* Live Ticker */}
        {liveMatches.length > 0 && <LiveTicker matches={liveMatches} />}

        {/* Main navbar */}
        <nav style={{ display: 'flex', alignItems: 'center', padding: '0 24px', height: 64 }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--brand-red), #8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900,
            }}>⚽</div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.05em' }}>
              <span style={{ color: 'var(--brand-gold)' }}>WC</span>
              <span style={{ color: 'white' }}>2026</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 4, fontFamily: 'DM Sans, sans-serif', fontWeight: 400, letterSpacing: 0 }}>Hub</span>
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflowX: 'auto' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'rgba(200,16,46,0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(200,16,46,0.3)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                })}
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {liveMatches.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.3)' }}>
                <span className="live-dot" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--live-red)' }}>{liveMatches.length} LIVE</span>
              </div>
            )}
            <button
              onClick={togglePerformanceMode}
              title={performanceMode ? "3D Disabled" : "3D Enabled"}
              style={{
                background: performanceMode ? 'var(--surface-elevated)' : 'rgba(255,215,0,0.1)',
                border: `1px solid ${performanceMode ? 'var(--border-subtle)' : 'rgba(255,215,0,0.3)'}`,
                borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                color: performanceMode ? 'var(--text-muted)' : 'var(--brand-gold)',
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <Cpu size={14} />
              <span className="hide-mobile">{performanceMode ? 'Perf Mode' : '3D On'}</span>
            </button>
            <button className="hide-desktop btn-ghost" onClick={toggleSidebar} style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ─── MOBILE SIDEBAR ────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
            />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0, width: 280, zIndex: 201,
                background: 'var(--surface-dark)', borderLeft: '1px solid var(--border-subtle)',
                padding: '80px 16px 32px', display: 'flex', flexDirection: 'column', gap: 4,
              }}
            >
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 10,
                    textDecoration: 'none', fontSize: 15, fontWeight: 600,
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(200,16,46,0.2)' : 'transparent',
                  })}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ──────────────────── */}
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── MOBILE BOTTOM TAB BAR ─────────── */}
      <nav className="hide-desktop" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99,
        background: 'rgba(10,15,30,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-around', padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      }}>
        {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 8px', borderRadius: 8, textDecoration: 'none',
              color: isActive ? 'var(--brand-gold)' : 'var(--text-muted)',
              flex: 1, fontSize: 10, fontWeight: 600,
            })}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
        <button onClick={toggleSidebar} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          padding: '4px 8px', borderRadius: 8, border: 'none',
          background: 'transparent', color: 'var(--text-muted)', flex: 1, fontSize: 10, fontWeight: 600, cursor: 'pointer',
        }}>
          <Zap size={20} />
          More
        </button>
      </nav>
    </div>
  );
}
