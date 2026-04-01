import React, { useMemo } from 'react';

/**
 * Calculates current daily logging streak.
 */
export const getCurrentStreak = (entries) => {
  if (!entries || !entries.length) return 0;
  
  const datesWithEntries = new Set(
    entries.map(e => e.date.split('T')[0])
  );

  let count = 0;
  const d = new Date();

  while (true) {
    const dateStr = d.toISOString().split('T')[0];
    if (datesWithEntries.has(dateStr)) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
};

const StreakCounter = ({ entries }) => {
  const streak = useMemo(() => getCurrentStreak(entries), [entries]);

  if (streak === 0) return null;

  return (
    <div className="streak-badge" title={`${streak}-day logging streak!`}>
      <span className="streak-flame">🔥</span>
      <span className="streak-count">{streak}</span>
      <span className="streak-label">day streak</span>
    </div>
  );
};

export default StreakCounter;
