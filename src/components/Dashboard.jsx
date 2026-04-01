import React, { useMemo, useState, useEffect, useRef } from 'react';
import Companion from './Companion';
import CalorieRing from './CalorieRing';
import StreakCounter from './StreakCounter';
import MealRings from './MealRings';
import Confetti from './Confetti';
import { useCountUp } from '../hooks/useCountUp';

const Dashboard = ({ user, entries }) => {
  const today = new Date().toISOString().split('T')[0];
  const [showConfetti, setShowConfetti] = useState(false);
  const prevGoalMet = useRef(false);

  const todayEntries = useMemo(() =>
    entries.filter(e => e.date.startsWith(today)),
    [entries, today]
  );

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

  // Discipline Score
  const mealTypesLogged = new Set(todayEntries.map(e => e.mealType)).size;
  let score = 10;
  if (isExceeded) score -= 2;
  if (mealTypesLogged < 3) score -= (3 - mealTypesLogged);
  if (score < 0) score = 0;

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
            <div className="discipline-score" style={{
              background: score >= 8 ? 'rgba(0,230,118,0.12)' : score >= 5 ? 'rgba(255,193,7,0.12)' : 'rgba(255,82,82,0.12)',
              borderColor: score >= 8 ? 'rgba(0,230,118,0.25)' : score >= 5 ? 'rgba(255,193,7,0.25)' : 'rgba(255,82,82,0.25)',
              color: score >= 8 ? 'var(--accent-color)' : score >= 5 ? '#ffc107' : 'var(--danger-color)'
            }}>
              Score: {score}/10 🔥
            </div>
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
    </>
  );
};

export default Dashboard;
