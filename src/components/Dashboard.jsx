import React, { useMemo, useState, useEffect, useRef } from 'react';
import Companion from './Companion';
import CalorieRing from './CalorieRing';
import StreakCounter, { getCurrentStreak } from './StreakCounter';
import MealRings from './MealRings';
import Confetti from './Confetti';
import { useCountUp } from '../hooks/useCountUp';
import { calculateScore } from '../utils/scoreEngine';

const Dashboard = ({ user, entries }) => {
  const today = new Date().toISOString().split('T')[0];
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScoreSheet, setShowScoreSheet] = useState(false);
  const prevGoalMet = useRef(false);

  const todayEntries = useMemo(() =>
    entries.filter(e => e.date.startsWith(today)),
    [entries, today]
  );

  const currentStreak = useMemo(() => getCurrentStreak(entries), [entries]);

  // Use the new 100-point engine
  const { score, grade, color, breakdown } = useMemo(() => 
    calculateScore(todayEntries, user.dailyCalorieGoal, currentStreak),
  [todayEntries, user.dailyCalorieGoal, currentStreak]);

  const totalConsumed = useMemo(() =>
    todayEntries.reduce((acc, curr) => acc + Number(curr.calories), 0),
    [todayEntries]
  );

  const remaining = user.dailyCalorieGoal - totalConsumed;
  const progressPercent = Math.min((totalConsumed / user.dailyCalorieGoal) * 100, 100);
  const isExceeded = totalConsumed > user.dailyCalorieGoal;
  const isGoalMet = totalConsumed >= user.dailyCalorieGoal * 0.98 && !isExceeded;

  // Animated counters
  const animConsumed = useCountUp(totalConsumed);
  const animRemaining = useCountUp(Math.abs(remaining));

  const mealTypesLogged = new Set(todayEntries.map(e => e.mealType)).size;

  // Confetti when goal first hit
  useEffect(() => {
    if (isGoalMet && !prevGoalMet.current && totalConsumed > 0) {
      setShowConfetti(true);
    }
    prevGoalMet.current = isGoalMet;
  }, [isGoalMet, totalConsumed]);

  return (
    <>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      <section className="dashboard">
        {/* Top row: greeting + streak */}
        <div className="dashboard-top-row">
          <div className="dashboard-greeting">
            {user.userName
              ? <span className="greeting-name">Hey, {user.userName}! 👋</span>
              : <span className="greeting-name">Today's Overview</span>
            }
          </div>
          <div className="dashboard-badges">
            <button 
              className="grade-badge" 
              style={{
                borderColor: color,
                background: `${color}15`,
                color: color,
                boxShadow: `0 0 12px ${color}30`
              }}
              onClick={() => setShowScoreSheet(true)}
            >
              <span className="grade-letter">{grade}</span>
              <span className="grade-score">{score}</span>
            </button>
            <StreakCounter entries={entries} />
          </div>
        </div>

        {/* Main metrics: ring + remaining */}
        <div className="dashboard-metrics-row">
          <CalorieRing consumed={totalConsumed} goal={user.dailyCalorieGoal} size={148} />

          <div className="dashboard-stats">
            <div className="calorie-box">
              <span className="label">Consumed</span>
              <span className="value">{animConsumed}</span>
            </div>
            <div className="calorie-divider" />
            <div className="calorie-box">
              <span className="label">{isExceeded ? 'Over by' : 'Remaining'}</span>
              <span className={`value ${isExceeded ? 'value--danger' : 'value--accent'}`}>
                {isExceeded ? `+${animRemaining}` : animRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar with shimmer */}
        <div className="progress-bar-container" style={{ marginTop: 14 }}>
          <div
            className="progress-bar"
            style={{
              width: `${progressPercent}%`,
              background: isExceeded
                ? 'linear-gradient(90deg,#ff5252,#ff8a80)'
                : undefined,
            }}
          >
            <div className="progress-shimmer" />
          </div>
        </div>

        {/* Meal breakdown rings */}
        <MealRings entries={entries} />

        {/* Companion */}
        <Companion
          remaining={remaining}
          isExceeded={isExceeded}
          mealTypesLogged={mealTypesLogged}
          user={user}
        />
      </section>

      {/* Score Breakdown Bottom Sheet */}
      {showScoreSheet && (
        <div className="score-sheet-backdrop" onClick={() => setShowScoreSheet(false)}>
          <div className="score-sheet-content" onClick={e => e.stopPropagation()}>
            <div className="score-sheet-handle" />
            <h3 className="score-sheet-title">
              Health Grade: <span style={{ color }}>{grade}</span> ({score})
            </h3>
            <div className="score-sheet-breakdown">
              {breakdown.map((item, i) => (
                <div key={i} className="score-sheet-row">
                  <span className="score-sheet-label">{item.label}</span>
                  <span className={`score-sheet-val ${item.type}`}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setShowScoreSheet(false)} style={{ marginTop: '20px' }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
