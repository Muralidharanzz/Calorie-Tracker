import React, { useState, useEffect } from 'react'
import { useDataStore } from './hooks/useDataStore'
import Dashboard from './components/Dashboard'
import FoodLogger from './components/FoodLogger'
import DailyHistory from './components/DailyHistory'
import Insights from './components/Insights'
import Profile from './components/Profile'
import SmartNotifier from './components/SmartNotifier'

const PAGE_LABELS = {
  LOG: 'Today\'s Log',
  HISTORY: 'History',
  INSIGHTS: 'Insights',
  PROFILE: 'Profile',
};

const menuItems = [
  { id: 'LOG',      icon: '🥗', label: 'Today\'s Log',  desc: 'Log meals & track calories' },
  { id: 'HISTORY',  icon: '📅', label: 'History',        desc: 'Browse past entries'         },
  { id: 'INSIGHTS', icon: '📊', label: 'Insights',       desc: 'Trends & analytics'          },
  { id: 'PROFILE',  icon: '👤', label: 'Profile',        desc: 'Settings & goals'            },
];

function App() {
  const store = useDataStore();
  const [activeTab, setActiveTab] = useState('LOG');
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on back-swipe / escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navigate = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <div className="app-container">
      <SmartNotifier entries={store.entries} user={store.user} />

      {/* ── Header ── */}
      <header className="header">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/caltos-icon.svg" alt="Caltos Logo" style={{ width: '30px', height: '30px' }} />
          <h1>Caltos</h1>
        </div>

        {/* Current page label */}
        <span className="header-page-label">{PAGE_LABELS[activeTab]}</span>

        {/* Hamburger */}
        <button
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── Drawer overlay (backdrop) ── */}
      {menuOpen && (
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />
      )}

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
      </div>

      {/* ── Main scrollable content ── */}
      <main className="main-content">
        {activeTab === 'LOG' && (
          <>
            <Dashboard user={store.user} entries={store.entries} />
            <FoodLogger onAddEntry={store.addEntry} recentFoods={store.recentFoods} />
          </>
        )}

        {activeTab === 'HISTORY' && (
          <DailyHistory
            entries={store.entries}
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
            onNavigateHistory={() => navigate('HISTORY')}
          />
        )}
      </main>
    </div>
  )
}

export default App
