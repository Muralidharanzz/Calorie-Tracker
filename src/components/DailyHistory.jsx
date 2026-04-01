import React, { useState, useRef } from 'react';
import WeeklyChart from './WeeklyChart';

const MEAL_ORDER = { 'Breakfast': 1, 'Lunch': 2, 'Snacks': 3, 'Dinner': 4 };

/* ── Swipeable entry row ────────────────────────────── */
const SwipeEntry = ({ entry, onDelete }) => {
  const startX = useRef(null);
  const [offset, setOffset] = useState(0);
  const [deleted, setDeleted] = useState(false);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setOffset(Math.max(dx, -80)); // only left swipe, max 80px
  };
  const onTouchEnd = () => {
    if (offset < -50) {
      // Committed delete
      setDeleted(true);
      setTimeout(() => onDelete(entry.id), 300);
    } else {
      setOffset(0);
    }
  };

  if (deleted) return null;

  return (
    <li className="entry-item swipe-entry" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Delete hint behind */}
      <div className="swipe-delete-bg">
        <span>🗑</span>
      </div>

      {/* Sliding row */}
      <div
        className="swipe-row"
        style={{ transform: `translateX(${offset}px)`, transition: offset === 0 ? 'transform 0.3s ease' : 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <span className="entry-name">{entry.foodName}</span>
        <div className="entry-actions">
          <span className="entry-cals">{entry.calories}</span>
          <button className="delete-btn" onClick={() => onDelete(entry.id)}>×</button>
        </div>
      </div>
    </li>
  );
};

/* ── Main component ────────────────────────────────── */
const DailyHistory = ({ entries, getEntriesForDate, deleteEntry, duplicateDay }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dailyEntries = getEntriesForDate(selectedDate);
  const totalCalories = dailyEntries.reduce((acc, curr) => acc + curr.calories, 0);

  const grouped = dailyEntries.reduce((acc, curr) => {
    if (!acc[curr.mealType]) acc[curr.mealType] = [];
    acc[curr.mealType].push(curr);
    return acc;
  }, {});
  const sortedMeals = Object.keys(grouped).sort((a, b) => MEAL_ORDER[a] - MEAL_ORDER[b]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };
  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };
  const handleDuplicate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    duplicateDay(d.toISOString().split('T')[0], selectedDate);
  };

  return (
    <section className="history-view">

      {/* 7-day bar chart */}
      <WeeklyChart entries={entries} goal={2000} />

      {/* Day selector */}
      <div className="date-selector">
        <button className="icon-btn" onClick={handlePrevDay}>←</button>
        <h3>{selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate}</h3>
        <button className="icon-btn" onClick={handleNextDay}>→</button>
      </div>

      <div className="history-summary">
        <div>Total: <strong>{totalCalories} kcal</strong></div>
        <button className="btn-secondary" onClick={handleDuplicate}>↻ Repeat Yesterday</button>
      </div>

      {sortedMeals.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <p>No meals logged for this day.</p>
          <p className="empty-hint">Swipe left on entries to delete them.</p>
        </div>
      ) : (
        <div className="meal-sections">
          {sortedMeals.map(meal => (
            <div key={meal} className="meal-section">
              <h4>{meal}</h4>
              <ul className="entry-list">
                {grouped[meal].map(entry => (
                  <SwipeEntry key={entry.id} entry={entry} onDelete={deleteEntry} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyHistory;
