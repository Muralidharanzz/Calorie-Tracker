import React, { useState, useEffect } from 'react';

const Profile = ({ user, updateUserName, updateUserGoal, updateCompanionPersona, updateMealTimes, updateWaterSettings, updateSugarControlMode, onNavigateHistory }) => {
  const [name, setName] = useState(user.userName || '');
  const [goal, setGoal] = useState(user.dailyCalorieGoal);
  const [persona, setPersona] = useState(user.companionPersona || 'balanced');
  const [mealTimes, setMealTimes] = useState(user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' });
  const [waterType, setWaterType] = useState(user.waterGoalType || 'glass');
  const [waterGoal, setWaterGoal] = useState(user.waterGoal || 8);
  const [sugarMode, setSugarMode] = useState(user.sugarControlMode || false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(user.userName || '');
    setGoal(user.dailyCalorieGoal);
    setPersona(user.companionPersona || 'balanced');
    setMealTimes(user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' });
    setWaterType(user.waterGoalType || 'glass');
    setWaterGoal(user.waterGoal || 8);
    setSugarMode(user.sugarControlMode || false);
  }, [user]);

  const handleSave = () => {
    updateUserName(name);
    updateUserGoal(Number(goal));
    updateCompanionPersona(persona);
    updateMealTimes(mealTimes);
    if (updateWaterSettings) updateWaterSettings(waterType, Number(waterGoal));
    if (updateSugarControlMode) updateSugarControlMode(sugarMode);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <section className="profile-view">

      {/* ── Main settings card ── */}
      <div className="dashboard profile-card">
        <h2>Profile &amp; Settings</h2>

        <div className="input-group">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="What should we call you?"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Daily Calorie Goal</label>
          <input
            type="number"
            inputMode="numeric"
            className="input input-calories"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Hydration Container</label>
          <div className="meal-types">
            <button className={`meal-btn ${waterType === 'glass'  ? 'active' : ''}`} onClick={() => setWaterType('glass')}>🥛 Standard Glass</button>
            <button className={`meal-btn ${waterType === 'bottle' ? 'active' : ''}`} onClick={() => setWaterType('bottle')}>🍾 1L Bottle</button>
          </div>
        </div>

        <div className="input-group">
          <label>Hydration Target (Daily {waterType === 'glass' ? 'Glasses' : 'Bottles'})</label>
          <input
            type="number"
            inputMode="numeric"
            className="input input-calories"
            value={waterGoal}
            onChange={(e) => setWaterGoal(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Companion Personality</label>
          <div className="meal-types">
            <button className={`meal-btn ${persona === 'balanced'     ? 'active' : ''}`} onClick={() => setPersona('balanced')}>⚖️ Balanced</button>
            <button className={`meal-btn ${persona === 'strict'       ? 'active' : ''}`} onClick={() => setPersona('strict')}>💂 Strict</button>
            <button className={`meal-btn ${persona === 'cheerleader'  ? 'active' : ''}`} onClick={() => setPersona('cheerleader')}>🎉 Cheerleader</button>
          </div>
        </div>

        <div className="input-group">
          <label>Reminder Times</label>
          <div className="reminder-grid">
            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
              <div key={meal} className="reminder-item">
                <span className="reminder-meal-label">{meal}</span>
                <input
                  type="time"
                  className="input"
                  value={mealTimes[meal]}
                  onChange={(e) => setMealTimes({ ...mealTimes, [meal]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Strict Sugar Cut Mode</label>
          <div className="meal-types">
            <button className={`meal-btn ${!sugarMode ? 'active' : ''}`} onClick={() => setSugarMode(false)}>🚫 Off</button>
            <button className={`meal-btn ${sugarMode ? 'active' : ''}`} onClick={() => setSugarMode(true)}>🔥 On (Detect Sugar)</button>
          </div>
          <p className="profile-desc" style={{ marginTop: 8, fontSize: '0.8rem' }}>
            When enabled, logs containing words like 'sugar', 'cake', 'soda' will heavily impact your daily health grade.
          </p>
        </div>

        <button className="btn-primary" onClick={handleSave}>
          {success ? 'Saved! ✓' : 'Save Profile Settings'}
        </button>
      </div>

      {/* ── Data & Logs card ── */}
      <div className="dashboard profile-card">
        <h2>Data &amp; Logs</h2>
        <p className="profile-desc">All your meals and entries are safely stored. View everything you've ever tracked.</p>
        <button className="btn-secondary profile-full-btn" onClick={onNavigateHistory}>
          View All History Logs 📋
        </button>
      </div>

      {/* ── About card ── */}
      <div className="dashboard profile-card" style={{ 
        background: 'linear-gradient(180deg, rgba(30,30,35,0.7) 0%, rgba(20,20,25,0.9) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        textAlign: 'center',
        padding: '32px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle gold glow behind text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(253, 185, 49, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <h2 style={{ marginBottom: 4, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Crafted With Precision
        </h2>
        
        <p style={{
          margin: '8px 0 16px 0',
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: 'Inter, system-ui, sans-serif',
          background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 40%, #FFF3A0 60%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
          filter: 'drop-shadow(0 4px 12px rgba(253, 185, 49, 0.2))'
        }}>
          MAVERICK
        </p>

        <p className="profile-desc" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '90%', margin: '0 auto' }}>
          An uncompromising, premium calorie tracking engine. Unmatched privacy, zero latency, and beautiful design.
        </p>
      </div>

    </section>
  );
};

export default Profile;
