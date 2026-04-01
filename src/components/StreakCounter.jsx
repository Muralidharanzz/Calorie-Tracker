import React, { useMemo } from 'react';

/**
 * Calculates and displays the current daily logging streak (consecutive days with ≥1 entry).
 */
const StreakCounter = ({ entries }) => {
  const streak = useMemo(() => {
    if (!entries.length) return 0;

    // Build a set of unique dates that have entries
    const datesWithEntries = new Set(
      entries.map(e => e.date.split('T')[0])
    );

    // Walk backwards from today counting consecutive days
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
  }, [entries]);

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
