import React, { useState, useEffect } from 'react';

const Profile = ({ user, updateUserName, updateUserGoal, updateCompanionPersona, updateMealTimes, updateWaterSettings, onNavigateHistory }) => {
  const [name, setName] = useState(user.userName || '');
  const [goal, setGoal] = useState(user.dailyCalorieGoal);
  const [persona, setPersona] = useState(user.companionPersona || 'balanced');
  const [mealTimes, setMealTimes] = useState(user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' });
  const [waterType, setWaterType] = useState(user.waterGoalType || 'glass');
  const [waterGoal, setWaterGoal] = useState(user.waterGoal || 8);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(user.userName || '');
    setGoal(user.dailyCalorieGoal);
    setPersona(user.companionPersona || 'balanced');
    setMealTimes(user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' });
    setWaterType(user.waterGoalType || 'glass');
    setWaterGoal(user.waterGoal || 8);
  }, [user]);

  const handleSave = () => {
    updateUserName(name);
    updateUserGoal(Number(goal));
    updateCompanionPersona(persona);
    updateMealTimes(mealTimes);
    if (updateWaterSettings) updateWaterSettings(waterType, Number(waterGoal));
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
      <div className="dashboard profile-card profile-card--muted">
        <h2>About Caltos</h2>
        <p className="profile-desc">
          A premium, offline-first calorie tracking companion. Your data is stored locally on your device for absolute privacy and speed.
        </p>
      </div>

    </section>
  );
};

export default Profile;
