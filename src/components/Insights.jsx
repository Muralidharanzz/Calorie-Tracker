import React, { useMemo, useState } from 'react';

/* ── Helpers ────────────────────────────── */
const formatDate = (iso) => {
  if (!iso || iso === '-') return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getLongestStreak = (entries) => {
  const dates = [...new Set(entries.map(e => e.date.split('T')[0]))].sort();
  if (!dates.length) return 0;
  let max = 1, cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); }
    else cur = 1;
  }
  return max;
};

const getTopFoods = (entries, n = 3) => {
  const freq = {};
  entries.forEach(e => {
    const key = e.foodName.toLowerCase();
    if (!freq[key]) freq[key] = { name: e.foodName, count: 0, cals: e.calories };
    freq[key].count++;
  });
  return Object.values(freq).sort((a, b) => b.count - a.count).slice(0, n);
};

/* ── Mini stat card ─────────────────────── */
const StatCard = ({ icon, label, value, sub, accent }) => (
  <div className="insight-stat-card" style={accent ? {
    borderColor: 'rgba(0,230,118,0.25)',
    background: 'rgba(0,230,118,0.07)'
  } : {}}>
    <span className="insight-stat-icon">{icon}</span>
    <span className="insight-stat-value">{value}</span>
    <span className="insight-stat-label">{label}</span>
    {sub && <span className="insight-stat-sub">{sub}</span>}
  </div>
);

/* ── Score breakdown ────────────────────── */
const ScoreBreakdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="score-breakdown-card dashboard">
      <button className="score-breakdown-toggle" onClick={() => setOpen(v => !v)}>
        <span>🎯 How is the Grade calculated?</span>
        <span className="score-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="score-breakdown-body">
          <div className="score-row">
            <span>Base score</span>
            <span className="score-pill green">100</span>
          </div>
          <div className="score-row">
            <span>Perfect Calorie Range (±100)</span>
            <span className="score-pill green">+0</span>
          </div>
          <div className="score-row">
            <span>Logging Streak (3+ days)</span>
            <span className="score-pill green">+5 to +10</span>
          </div>
          <div className="score-row">
            <span>Volume Deviation</span>
            <span className="score-pill amber">Dynamic</span>
          </div>
          <div className="score-row">
            <span>Late Meal (&gt;60m past Profile Time)</span>
            <span className="score-pill red">–5 each</span>
          </div>
          <div className="score-row">
            <span>Skipped Breakfast/Lunch/Dinner</span>
            <span className="score-pill red">–10 each</span>
          </div>
          <div className="score-row">
            <span>Unhealthy Snack Spike (&gt;35%)</span>
            <span className="score-pill red">–15</span>
          </div>
          <div className="score-row">
            <span>Late-Night Eating (&gt;25% after 10PM)</span>
            <span className="score-pill red">–15</span>
          </div>
          <div className="score-row">
            <span>Ghost Town (Under-tracking &lt;25%)</span>
            <span className="score-pill red">–40</span>
          </div>
          <p className="score-note">
            Log all your meals in a healthy distribution within your goal to earn an A+! (And don't eat too late).
          </p>
        </div>
      )}
    </div>
  );
};

/* ── Main component ─────────────────────── */
const Insights = ({ entries, user }) => {
  const stats = useMemo(() => {
    if (!entries.length) return null;

    const byDate = entries.reduce((acc, e) => {
      const d = e.date.split('T')[0];
      acc[d] = (acc[d] || 0) + e.calories;
      return acc;
    }, {});
    const dates = Object.keys(byDate);
    const total = dates.reduce((s, d) => s + byDate[d], 0);
    const avgDaily = Math.round(total / dates.length);
    const daysExceeded = dates.filter(d => byDate[d] > user.dailyCalorieGoal).length;
    const daysUnder = dates.length - daysExceeded;
    const consistencyPct = Math.round((daysUnder / dates.length) * 100);

    let bestDay = '-', bestDayCals = Infinity;
    dates.forEach(d => {
      if (byDate[d] < bestDayCals && byDate[d] > 300) {
        bestDayCals = byDate[d];
        bestDay = d;
      }
    });
    if (bestDayCals === Infinity) { bestDayCals = 0; bestDay = '-'; }

    const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
    const longestStreak = getLongestStreak(entries);
    const topFoods = getTopFoods(entries);

    return {
      avgDaily, daysExceeded, daysUnder,
      consistencyPct, bestDay, bestDayCals,
      totalDays: dates.length, totalCalories, longestStreak, topFoods
    };
  }, [entries, user.dailyCalorieGoal]);

  if (!stats) {
    return (
      <section className="insights-view">
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <span className="empty-icon">📊</span>
          <p>No data yet. Start logging meals to see your insights!</p>
        </div>
      </section>
    );
  }

  const {
    avgDaily, daysExceeded, daysUnder, consistencyPct,
    bestDay, bestDayCals, totalDays, totalCalories,
    longestStreak, topFoods
  } = stats;

  const avgVsGoal = Math.round(((avgDaily - user.dailyCalorieGoal) / user.dailyCalorieGoal) * 100);
  const avgBar = Math.min((avgDaily / user.dailyCalorieGoal) * 100, 100);

  return (
    <section className="insights-view">

      {/* ── Header ── */}
      <div className="insights-header">
        <h2>Your Insights</h2>
        <span className="insights-days-badge">{totalDays} days tracked</span>
      </div>

      {/* ── 2×2 stat grid ── */}
      <div className="insights-grid-2">
        <StatCard
          icon="📊"
          label="Avg Daily"
          value={avgDaily}
          sub={`Goal: ${user.dailyCalorieGoal}`}
          accent={avgDaily <= user.dailyCalorieGoal}
        />
        <StatCard
          icon="✅"
          label="Days on Track"
          value={daysUnder}
          sub={`${daysExceeded} exceeded`}
        />
        <StatCard
          icon="🏆"
          label="Best Day"
          value={`${bestDayCals}`}
          sub={formatDate(bestDay)}
        />
        <StatCard
          icon="🔥"
          label="Longest Streak"
          value={`${longestStreak}d`}
          sub="consecutive days"
        />
      </div>

      {/* ── Consistency card ── */}
      <div className="dashboard insight-full-card">
        <div className="insight-full-card-header">
          <span>🎯 Consistency Rate</span>
          <span className="insight-pct-badge" style={{
            color: consistencyPct >= 70 ? 'var(--accent-color)' : '#ffc107',
            borderColor: consistencyPct >= 70 ? 'rgba(0,230,118,0.3)' : 'rgba(255,193,7,0.3)',
            background: consistencyPct >= 70 ? 'rgba(0,230,118,0.08)' : 'rgba(255,193,7,0.08)'
          }}>
            {consistencyPct}%
          </span>
        </div>
        <div className="insight-full-bar-bg">
          <div
            className="insight-full-bar-fill"
            style={{
              width: `${consistencyPct}%`,
              background: consistencyPct >= 70
                ? 'linear-gradient(90deg,#00e676,#00c853)'
                : 'linear-gradient(90deg,#ffc107,#ff8f00)'
            }}
          />
        </div>
        <p className="insight-full-desc">
          You stayed within your calorie goal on <strong>{daysUnder} of {totalDays} days</strong>.
        </p>
      </div>

      {/* ── Avg vs Goal card ── */}
      <div className="dashboard insight-full-card">
        <div className="insight-full-card-header">
          <span>📉 Avg vs Goal</span>
          <span className="insight-pct-badge" style={{
            color: avgDaily <= user.dailyCalorieGoal ? 'var(--accent-color)' : 'var(--danger-color)',
            borderColor: avgDaily <= user.dailyCalorieGoal ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)',
            background: avgDaily <= user.dailyCalorieGoal ? 'rgba(0,230,118,0.08)' : 'rgba(255,82,82,0.08)',
          }}>
            {avgVsGoal > 0 ? `+${avgVsGoal}%` : `${avgVsGoal}%`}
          </span>
        </div>
        <div className="insight-full-bar-bg">
          <div
            className="insight-full-bar-fill"
            style={{
              width: `${avgBar}%`,
              background: avgDaily > user.dailyCalorieGoal
                ? 'linear-gradient(90deg,#ff5252,#ff8a80)'
                : 'linear-gradient(90deg,#00e676,#00c853)'
            }}
          />
        </div>
        <p className="insight-full-desc">
          Average of <strong>{avgDaily} kcal/day</strong> vs your goal of <strong>{user.dailyCalorieGoal} kcal</strong>.
        </p>
      </div>

      {/* ── Top foods ── */}
      {topFoods.length > 0 && (
        <div className="dashboard insight-full-card">
          <div className="insight-full-card-header">
            <span>🍽️ Most Logged Foods</span>
          </div>
          <div className="top-foods-list">
            {topFoods.map((food, i) => (
              <div key={i} className="top-food-row">
                <span className="top-food-rank">{['🥇','🥈','🥉'][i]}</span>
                <span className="top-food-name">{food.name}</span>
                <span className="top-food-meta">{food.count}× · {food.cals} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Total lifetime ── */}
      <div className="dashboard insight-lifetime">
        <span className="lifetime-icon">⚡</span>
        <div>
          <p className="lifetime-value">{totalCalories.toLocaleString()}</p>
          <p className="lifetime-label">Total Calories Tracked</p>
        </div>
      </div>

      {/* ── Score breakdown ── */}
      <ScoreBreakdown />

    </section>
  );
};

export default Insights;
