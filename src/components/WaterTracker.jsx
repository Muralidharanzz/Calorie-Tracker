import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'ct_water';

/**
 * Water intake tracker — dynamically supports glasses or bottles.
 */
const WaterTracker = ({ user }) => {
  const goalType = user?.waterGoalType || 'glass';
  const goalAmount = user?.waterGoal || 8;

  const [count, setCount] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored && stored.date === new Date().toISOString().split('T')[0]) {
        return stored.count;
      }
    } catch {}
    return 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      count
    }));
  }, [count]);

  const toggle = (idx) => {
    setCount(idx < count ? idx : idx + 1);
  };

  const pct = Math.min((count / goalAmount) * 100, 100);
  const typeLabel = goalType === 'glass' ? 'glasses' : 'bottles';

  return (
    <div className="water-tracker dashboard">
      <div className="water-header">
        <span className="water-title">💧 Water Intake</span>
        <span className="water-count">{count}/{goalAmount} {typeLabel}</span>
      </div>

      <div className="water-glasses-row">
        {Array.from({ length: goalAmount }, (_, i) => (
          <button
            key={i}
            className={`water-glass ${i < count ? 'filled' : ''}`}
            onClick={() => toggle(i)}
            aria-label={`${goalType} ${i + 1}`}
          >
            {goalType === 'glass' ? (
              <svg viewBox="0 0 24 32" width="24" height="32">
                <path
                  d="M4 2 L6 30 L18 30 L20 2 Z"
                  fill="none"
                  stroke={i < count ? '#29b6f6' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {i < count && (
                  <clipPath id={`clip-${i}`}>
                    <path d="M4 2 L6 30 L18 30 L20 2 Z" />
                  </clipPath>
                )}
                {i < count && (
                  <rect x="0" y="8" width="24" height="24" fill="url(#waterGrad)" clipPath={`url(#clip-${i})`} />
                )}
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#29b6f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0277bd" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <svg viewBox="0 0 24 38" width="20" height="32">
                <path
                  d="M9 4 L15 4 L15 8 L18 12 L18 36 L6 36 L6 12 L9 8 Z"
                  fill="none"
                  stroke={i < count ? '#29b6f6' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <rect x="8" y="0" width="8" height="4" fill={i < count ? '#29b6f6' : 'rgba(255,255,255,0.3)'} rx={1} />
                {i < count && (
                  <clipPath id={`clip-bottle-${i}`}>
                     <path d="M9 4 L15 4 L15 8 L18 12 L18 36 L6 36 L6 12 L9 8 Z" />
                  </clipPath>
                )}
                {i < count && (
                  <rect x="0" y="14" width="24" height="24" fill="url(#waterGrad)" clipPath={`url(#clip-bottle-${i})`} />
                )}
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#29b6f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0277bd" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </button>
        ))}
      </div>

      <div className="water-bar-container">
        <div className="water-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {count >= goalAmount && (
        <p className="water-complete-msg">🎉 Daily goal hit! Great hydration!</p>
      )}
    </div>
  );
};

export default WaterTracker;
