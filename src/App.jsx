import React, { useState } from 'react'
import { useDataStore } from './hooks/useDataStore'
import Dashboard from './components/Dashboard'
import FoodLogger from './components/FoodLogger'
import DailyHistory from './components/DailyHistory'
import Insights from './components/Insights'
import Profile from './components/Profile'
import SmartNotifier from './components/SmartNotifier'

function App() {
  const store = useDataStore();
  const [activeTab, setActiveTab] = useState('LOG'); // 'LOG', 'HISTORY', 'INSIGHTS'

  return (
    <div className="app-container">
      <SmartNotifier entries={store.entries} user={store.user} />
      <header className="header">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/caltos-icon.svg" alt="Caltos Logo" style={{ width: '32px', height: '32px' }}/>
          <h1>Caltos</h1>
        </div>
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'LOG' ? 'active' : ''}`} onClick={() => setActiveTab('LOG')}>Log</button>
          <button className={`tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`} onClick={() => setActiveTab('HISTORY')}>History</button>
          <button className={`tab-btn ${activeTab === 'INSIGHTS' ? 'active' : ''}`} onClick={() => setActiveTab('INSIGHTS')}>Insights</button>
          <button className={`tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`} onClick={() => setActiveTab('PROFILE')}>Profile</button>
        </div>
      </header>
      
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
            onNavigateHistory={() => setActiveTab('HISTORY')}
          />
        )}
      </main>
    </div>
  )
}

export default App
