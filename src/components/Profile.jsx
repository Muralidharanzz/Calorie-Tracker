import React, { useState } from 'react';

const Profile = ({ user, updateUserName, updateUserGoal, updateCompanionPersona, updateMealTimes, onNavigateHistory }) => {
  const [name, setName] = useState(user.userName || '');
  const [goal, setGoal] = useState(user.dailyCalorieGoal);
  const [persona, setPersona] = useState(user.companionPersona || 'balanced');
  const [mealTimes, setMealTimes] = useState(user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' });
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    updateUserName(name);
    updateUserGoal(Number(goal));
    updateCompanionPersona(persona);
    updateMealTimes(mealTimes);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <section className="profile-view">
      <div className="dashboard" style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '16px' }}>User Profile & Settings</h2>

        <div className="input-group">
          <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Name</label>
          <input 
            type="text" 
            placeholder="What should we call you?"
            className="input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '24px' }}
          />
        </div>
        
        <div className="input-group">
          <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Calorie Goal</label>
          <input 
            type="number" 
            className="input input-calories" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ marginBottom: '24px' }}
          />
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Companion Personality</label>
          <div className="meal-types" style={{ marginBottom: '24px' }}>
            <button className={`meal-btn ${persona === 'balanced' ? 'active' : ''}`} onClick={() => setPersona('balanced')}>⚖️ Balanced</button>
            <button className={`meal-btn ${persona === 'strict' ? 'active' : ''}`} onClick={() => setPersona('strict')}>💂 Strict</button>
            <button className={`meal-btn ${persona === 'cheerleader' ? 'active' : ''}`} onClick={() => setPersona('cheerleader')}>🎉 Cheerleader</button>
          </div>
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Reminder Times</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
              <div key={meal} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{meal}</span>
                <input 
                  type="time" 
                  className="input" 
                  value={mealTimes[meal]}
                  onChange={(e) => setMealTimes({...mealTimes, [meal]: e.target.value})}
                  style={{ padding: '12px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={handleSave}>
          {success ? 'Saved! ✓' : 'Update Goal'}
        </button>
      </div>

      <div className="dashboard" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-secondary)' }}>Data & Logs</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '16px' }}>
          All your meals and entries are safely stored. Want to view everything you've ever tracked?
        </p>
        <button className="btn-secondary" style={{ width: '100%', padding: '12px', borderColor: 'rgba(255,255,255,0.2)' }} onClick={onNavigateHistory}>
          View All History Logs 📋
        </button>
      </div>

      <div className="dashboard" style={{ opacity: 0.7 }}>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-secondary)' }}>About Caltos</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          Caltos is a premium, offline-first calorie tracking companion. Your data is currently stored locally on your device for absolute privacy and speed.
        </p>
      </div>
    </section>
  );
};

export default Profile;
