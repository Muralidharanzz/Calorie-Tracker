import React, { useMemo } from 'react';
import Companion from './Companion';

const Dashboard = ({ user, entries }) => {
  // Calculate total consumed for today
  const today = new Date().toISOString().split('T')[0];
  
  const todayEntries = useMemo(() => {
    return entries.filter(e => e.date.startsWith(today));
  }, [entries, today]);

  const totalConsumed = useMemo(() => {
    return todayEntries.reduce((acc, curr) => acc + Number(curr.calories), 0);
  }, [todayEntries]);

  const remaining = user.dailyCalorieGoal - totalConsumed;
  
  // Calculate percentage for progress bar
  const progressPercent = Math.min((totalConsumed / user.dailyCalorieGoal) * 100, 100);
  
  // Determine indicators
  const isExceeded = totalConsumed > user.dailyCalorieGoal;
  const progressColor = isExceeded ? 'var(--danger-color)' : 'var(--accent-color)';

  // Mock Discipline Score (Score 10 if not exceeded, deduct points for exceeding)
  // And requires at least 3 meals logged
  const mealTypesLogged = new Set(todayEntries.map(e => e.mealType)).size;
  let score = 10;
  if (isExceeded) score -= 2;
  if (mealTypesLogged < 3) score -= (3 - mealTypesLogged);
  if (score < 0) score = 0;

  return (
    <section className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {user.userName ? `Welcome back, ${user.userName}!` : "Today's Overview"}
        </div>
        <div className="discipline-score">
          Score: {score}/10 🔥
        </div>
      </div>
      
      <div className="calories-info">
        <div className="calorie-box">
          <span className="label">Consumed</span>
          <span className="value">{totalConsumed}</span>
        </div>
        <div className="calorie-box" style={{ alignItems: 'flex-end' }}>
          <span className="label">Remaining</span>
          {/* Use class instead of inline style so CSS gradient applies */}
          <span className={`value ${isExceeded ? 'value--danger' : 'value--accent'}`}>
            {isExceeded ? `+${Math.abs(remaining)}` : remaining}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${progressPercent}%`,
            background: progressColor 
          }}
        ></div>
      </div>

      <Companion remaining={remaining} isExceeded={isExceeded} mealTypesLogged={mealTypesLogged} user={user} />
    </section>
  );
};

export default Dashboard;
