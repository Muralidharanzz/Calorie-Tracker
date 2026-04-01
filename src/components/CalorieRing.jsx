import React, { useEffect, useRef } from 'react';

/**
 * SVG donut ring showing calorie progress.
 * Animates strokeDashoffset on mount and whenever pct changes.
 */
const CalorieRing = ({ consumed, goal, size = 160 }) => {
  const pct = Math.min(consumed / goal, 1);
  const isOver = consumed > goal;

  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  const fillRef = useRef(null);

  useEffect(() => {
    if (!fillRef.current) return;
    // Start from 0, animate to target
    fillRef.current.style.transition = 'none';
    fillRef.current.style.strokeDashoffset = circ;
    // Force reflow
    fillRef.current.getBoundingClientRect();
    fillRef.current.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
    fillRef.current.style.strokeDashoffset = circ - pct * circ;
  }, [pct, circ]);

  const trackColor = 'rgba(255,255,255,0.06)';
  const fillColor = isOver ? 'url(#dangerGrad)' : 'url(#accentGrad)';
  const glowColor = isOver ? 'rgba(255,82,82,0.35)' : 'rgba(0,230,118,0.35)';

  return (
    <div className="calorie-ring-wrapper" style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e676" />
            <stop offset="100%" stopColor="#00c853" />
          </linearGradient>
          <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" />
            <stop offset="100%" stopColor="#ff8a80" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />

        {/* Fill arc */}
        <circle
          ref={fillRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          filter="url(#ringGlow)"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>

      {/* Center label */}
      <div className="calorie-ring-center" style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2
      }}>
        <span className="ring-consumed">{consumed}</span>
        <span className="ring-label">/ {goal}</span>
        <span className="ring-unit">kcal</span>
      </div>
    </div>
  );
};

export default CalorieRing;
