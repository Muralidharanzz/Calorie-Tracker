import React, { useState, useEffect, useRef } from 'react'
import { useDataStore } from './hooks/useDataStore'
import Dashboard from './components/Dashboard'
import FoodLogger from './components/FoodLogger'
import DailyHistory from './components/DailyHistory'
import Insights from './components/Insights'
import Profile from './components/Profile'
import SmartNotifier from './components/SmartNotifier'
import WaterTracker from './components/WaterTracker'

const PAGE_LABELS = {
  LOG: "Today's Log",
  HISTORY: 'History',
  INSIGHTS: 'Insights',
  PROFILE: 'Profile',
};

const menuItems = [
  { id: 'LOG',      icon: '🥗', label: "Today's Log",  desc: 'Log meals & track calories' },
  { id: 'HISTORY',  icon: '📅', label: 'History',       desc: 'Browse past entries'        },
  { id: 'INSIGHTS', icon: '📊', label: 'Insights',      desc: 'Trends & analytics'         },
  { id: 'PROFILE',  icon: '👤', label: 'Profile',       desc: 'Settings & goals'           },
];

/* ── Pull-to-refresh ────────────────────────────────── */
const PULL_THRESHOLD = 72;

function App() {
  const store = useDataStore();
  const [activeTab, setActiveTab] = useState('LOG');
  const [menuOpen, setMenuOpen] = useState(false);

  // Pull-to-refresh state
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(null);
  const mainRef = useRef(null);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Pull-to-refresh handlers
  const onTouchStart = (e) => {
    if (mainRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };
  const onTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0 && mainRef.current?.scrollTop === 0) {
      setPullY(Math.min(dy * 0.5, PULL_THRESHOLD + 20));
    }
  };
  const onTouchEnd = () => {
    if (pullY >= PULL_THRESHOLD) {
      setRefreshing(true);
      // Simulate refresh — just add a short delay then collapse
      setTimeout(() => {
        setRefreshing(false);
        setPullY(0);
        touchStartY.current = null;
      }, 900);
    } else {
      setPullY(0);
      touchStartY.current = null;
    }
  };

  const navigate = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  return (
    <div className="app-container">
      <SmartNotifier entries={store.entries} user={store.user} />

      {/* ── Header ── */}
      <header className="header">
        <div className="logo-container">
          <img src="/caltos-icon.svg" alt="Caltos Logo" style={{ width: 28, height: 28 }} />
          <h1>Caltos</h1>
        </div>
        <span className="header-page-label">{PAGE_LABELS[activeTab]}</span>
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── Drawer backdrop ── */}
      {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* ── Bottom-sheet drawer ── */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-handle" />
        <p className="drawer-title">Navigate</p>
        <nav className="drawer-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`drawer-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className="drawer-item-icon">{item.icon}</span>
              <div className="drawer-item-text">
                <span className="drawer-item-label">{item.label}</span>
                <span className="drawer-item-desc">{item.desc}</span>
              </div>
              {activeTab === item.id && <span className="drawer-item-active-dot" />}
            </button>
          ))}
        </nav>

        {/* ── Maverick Premium Badge ── */}
        <div style={{ marginTop: 'auto', padding: '32px 16px 24px', textAlign: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}>
            <span style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            Designed By
            <span style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '1.4rem',
            fontWeight: 900,
            fontFamily: 'Inter, system-ui, sans-serif',
            background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 40%, #FFF3A0 60%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.08em',
            filter: 'drop-shadow(0 2px 8px rgba(253, 185, 49, 0.3))'
          }}>
            MAVERICK
          </p>
        </div>
      </div>

      {/* ── Pull-to-refresh indicator ── */}
      <div
        className={`ptr-indicator ${refreshing ? 'ptr-refreshing' : ''}`}
        style={{ height: refreshing ? 48 : pullY > 0 ? pullY * 0.6 : 0 }}
      >
        <div className={`ptr-spinner ${refreshing ? 'spinning' : ''}`}>
          {refreshing ? '↻' : pullY >= PULL_THRESHOLD ? '↑ Release' : '↓ Pull to refresh'}
        </div>
      </div>

      {/* ── Main scrollable content ── */}
      <main
        className="main-content"
        ref={mainRef}
        style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {activeTab === 'LOG' && (
          <>
            <Dashboard user={store.user} entries={store.entries} />
            <WaterTracker user={store.user} />
            <FoodLogger onAddEntry={store.addEntry} recentFoods={store.recentFoods} user={store.user} />
          </>
        )}

        {activeTab === 'HISTORY' && (
          <DailyHistory
            entries={store.entries}
            user={store.user}
            getEntriesForDate={store.getEntriesForDate}
            deleteEntry={store.deleteEntry}
            duplicateDay={store.duplicateDay}
          />
        )}

        {activeTab === 'INSIGHTS' && (
          <Insights entries={store.entries} user={store.user} />
        )}

        {activeTab === 'PROFILE' && (
          <Profile
            user={store.user}
            updateUserName={store.updateUserName}
            updateUserGoal={store.updateUserGoal}
            updateCompanionPersona={store.updateCompanionPersona}
            updateMealTimes={store.updateMealTimes}
            updateWaterSettings={store.updateWaterSettings}
            updateSugarControlMode={store.updateSugarControlMode}
            onNavigateHistory={() => navigate('HISTORY')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
