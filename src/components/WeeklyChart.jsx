import React, { useMemo } from 'react';

/**
 * A 7-day calorie bar chart rendered as inline SVG.
 */
const WeeklyChart = ({ entries, goal }) => {
  const bars = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      const total = entries
        .filter(e => e.date.startsWith(dateStr))
        .reduce((s, e) => s + e.calories, 0);
      days.push({ dateStr, label, total });
    }
    return days;
  }, [entries]);

  const maxVal = Math.max(...bars.map(b => b.total), goal, 1);

  const WIDTH = 320;
  const HEIGHT = 120;
  const BAR_W = 32;
  const GAP = (WIDTH - bars.length * BAR_W) / (bars.length + 1);
  const GOAL_Y = HEIGHT - (goal / maxVal) * HEIGHT;

  return (
    <div className="weekly-chart-wrapper">
      <h3 className="chart-title">7-Day Overview</h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT + 28}`}
        width="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Goal line */}
        <line
          x1={0} y1={GOAL_Y}
          x2={WIDTH} y2={GOAL_Y}
          stroke="rgba(0,230,118,0.3)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={WIDTH - 4} y={GOAL_Y - 4} fill="rgba(0,230,118,0.6)"
          fontSize="9" textAnchor="end">Goal</text>

        {/* Bars */}
        {bars.map((bar, i) => {
          const barH = bar.total > 0 ? Math.max((bar.total / maxVal) * HEIGHT, 4) : 0;
          const x = GAP + i * (BAR_W + GAP);
          const y = HEIGHT - barH;
          const isOver = bar.total > goal;
          const isToday = i === 6;
          const fill = isOver
            ? 'url(#dangerBar)'
            : isToday
              ? 'url(#accentBar)'
              : 'rgba(0,230,118,0.35)';

          return (
            <g key={bar.dateStr}>
              <defs>
                <linearGradient id="accentBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#00c853" />
                </linearGradient>
                <linearGradient id="dangerBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5252" />
                  <stop offset="100%" stopColor="#d50000" />
                </linearGradient>
              </defs>

              <rect
                x={x} y={y}
                width={BAR_W} height={barH}
                rx={6}
                fill={fill}
                style={{ transition: 'height 1s ease, y 1s ease' }}
              />
              {bar.total > 0 && (
                <text x={x + BAR_W / 2} y={y - 4}
                  fill={isOver ? '#ff5252' : '#00e676'}
                  fontSize="8" textAnchor="middle" fontWeight="700">
                  {bar.total}
                </text>
              )}
              <text
                x={x + BAR_W / 2} y={HEIGHT + 16}
                fill={isToday ? '#00e676' : 'rgba(255,255,255,0.4)'}
                fontSize="9" textAnchor="middle"
                fontWeight={isToday ? '700' : '400'}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WeeklyChart;
