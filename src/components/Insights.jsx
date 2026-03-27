import React, { useMemo } from 'react';

const Insights = ({ entries, user }) => {
  const { avgDaily, daysExceeded, bestDay, bestDayCals } = useMemo(() => {
    if (entries.length === 0) return { avgDaily: 0, daysExceeded: 0, bestDay: '-', bestDayCals: 0 };
    
    // Group by date
    const byDate = entries.reduce((acc, curr) => {
      const date = curr.date.split('T')[0];
      acc[date] = (acc[date] || 0) + curr.calories;
      return acc;
    }, {});

    const dates = Object.keys(byDate);
    const total = dates.reduce((acc, d) => acc + byDate[d], 0);
    const avgDaily = Math.round(total / dates.length);
    
    const daysExceeded = dates.filter(d => byDate[d] > user.dailyCalorieGoal).length;
    
    // Best day (lowest calories that is > 0)
    let bestDay = '-';
    let bestDayCals = Infinity;
    dates.forEach(d => {
      if (byDate[d] < bestDayCals && byDate[d] > 500) { // arbitrary threshold to ignore empty days
        bestDayCals = byDate[d];
        bestDay = d;
      }
    });

    if (bestDayCals === Infinity) bestDayCals = 0;

    return { avgDaily, daysExceeded, bestDay, bestDayCals };
  }, [entries, user.dailyCalorieGoal]);

  return (
    <section className="insights-view">
      <h2>Weekly Insights</h2>
      
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Avg. Daily Calories</div>
          <div className="insight-value">{avgDaily}</div>
          <div className="insight-sub">Goal: {user.dailyCalorieGoal}</div>
        </div>
        
        <div className="insight-card">
          <div className="insight-label">Days Exceeded Goal</div>
          <div className="insight-value danger">{daysExceeded}</div>
        </div>

        <div className="insight-card highlight">
          <div className="insight-label">Best Day (Lowest)</div>
          <div className="insight-value">{bestDayCals} cals</div>
          <div className="insight-sub">{bestDay}</div>
        </div>
      </div>
      
      <div className="weight-tracker-promo">
        <h3>Weight Tracker</h3>
        <p>Log your weekly weight to see trends against your calorie intake.</p>
        <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => alert('Weight tracking coming in next update!')}>Log Weight</button>
      </div>
    </section>
  );
};

export default Insights;
