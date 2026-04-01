import React, { useMemo } from 'react';

const COLORS = {
  Breakfast: '#ffb300',
  Lunch: '#00e676',
  Dinner: '#7c4dff',
  Snacks: '#29b6f6',
};

/**
 * Small SVG arc rings showing calorie distribution per meal type.
 */
const MealRings = ({ entries }) => {
  const today = new Date().toISOString().split('T')[0];

  const byMeal = useMemo(() => {
    const todayEntries = entries.filter(e => e.date.startsWith(today));
    const totals = { Breakfast: 0, Lunch: 0, Dinner: 0, Snacks: 0 };
    todayEntries.forEach(e => {
      if (totals[e.mealType] !== undefined) totals[e.mealType] += e.calories;
    });
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    return { totals, grand };
  }, [entries, today]);

  if (byMeal.grand === 0) return null;

  const size = 52;
  const strokeWidth = 6;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="meal-rings-row">
      {Object.entries(byMeal.totals).map(([meal, cals]) => {
        if (cals === 0) return null;
        const pct = Math.min(cals / byMeal.grand, 1);
        const dash = pct * circ;

        return (
          <div key={meal} className="meal-ring-item">
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
              <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={COLORS[meal]} strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - dash}
                style={{
                  transition: 'stroke-dashoffset 1s ease',
                  filter: `drop-shadow(0 0 4px ${COLORS[meal]}88)`
                }}
              />
            </svg>
            <span className="meal-ring-label">{meal.slice(0, 3)}</span>
            <span className="meal-ring-cals">{cals}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MealRings;
