import React, { useState, useEffect } from 'react';

const TOTAL_GLASSES = 8;
const STORAGE_KEY = 'ct_water';

/**
 * Water intake tracker — 8 glasses, persisted to localStorage, resets at midnight.
 */
const WaterTracker = () => {
  const [glasses, setGlasses] = useState(() => {
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
      count: glasses
    }));
  }, [glasses]);

  const toggle = (idx) => {
    // Tap filled glass → unfill from that index; tap empty → fill up to that index
    setGlasses(idx < glasses ? idx : idx + 1);
  };

  const pct = (glasses / TOTAL_GLASSES) * 100;

  return (
    <div className="water-tracker dashboard">
      <div className="water-header">
        <span className="water-title">💧 Water Intake</span>
        <span className="water-count">{glasses}/{TOTAL_GLASSES} glasses</span>
      </div>

      <div className="water-glasses-row">
        {Array.from({ length: TOTAL_GLASSES }, (_, i) => (
          <button
            key={i}
            className={`water-glass ${i < glasses ? 'filled' : ''}`}
            onClick={() => toggle(i)}
            aria-label={`Glass ${i + 1}`}
          >
            <svg viewBox="0 0 24 32" width="24" height="32">
              {/* Glass outline */}
              <path
                d="M4 2 L6 30 L18 30 L20 2 Z"
                fill="none"
                stroke={i < glasses ? '#29b6f6' : 'rgba(255,255,255,0.15)'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Water fill */}
              {i < glasses && (
                <clipPath id={`clip-${i}`}>
                  <path d="M4 2 L6 30 L18 30 L20 2 Z" />
                </clipPath>
              )}
              {i < glasses && (
                <rect
                  x="0" y="8" width="24" height="24"
                  fill="url(#waterGrad)"
                  clipPath={`url(#clip-${i})`}
                  className="water-fill-rect"
                />
              )}
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#29b6f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0277bd" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="water-bar-container">
        <div
          className="water-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>

      {glasses === TOTAL_GLASSES && (
        <p className="water-complete-msg">🎉 Daily goal hit! Great hydration!</p>
      )}
    </div>
  );
};

export default WaterTracker;
