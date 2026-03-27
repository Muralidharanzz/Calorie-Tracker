import React, { useState } from 'react';

const MEAL_ORDER = { 'Breakfast': 1, 'Lunch': 2, 'Snacks': 3, 'Dinner': 4 };

const DailyHistory = ({ entries, getEntriesForDate, deleteEntry, duplicateDay }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const dailyEntries = getEntriesForDate(selectedDate);
  const totalCalories = dailyEntries.reduce((acc, curr) => acc + curr.calories, 0);

  // Group by meal
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

  const handleDuplicateYesterday = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const prevDateString = d.toISOString().split('T')[0];
    duplicateDay(prevDateString, selectedDate);
  };

  return (
    <section className="history-view">
      <div className="date-selector">
        <button className="icon-btn" onClick={handlePrevDay}>&larr;</button>
        <h3>{selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate}</h3>
        <button className="icon-btn" onClick={handleNextDay}>&rarr;</button>
      </div>

      <div className="history-summary">
        <div>Total: <strong>{totalCalories} kcal</strong></div>
        <button className="btn-secondary" onClick={handleDuplicateYesterday}>
          ↻ Repeat Yesterday
        </button>
      </div>

      {sortedMeals.length === 0 ? (
        <div className="empty-state" style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No meals logged for this day.</div>
      ) : (
        <div className="meal-sections">
          {sortedMeals.map(meal => (
            <div key={meal} className="meal-section">
              <h4>{meal}</h4>
              <ul className="entry-list">
                {grouped[meal].map(entry => (
                  <li key={entry.id} className="entry-item">
                    <span className="entry-name">{entry.foodName}</span>
                    <div className="entry-actions">
                      <span className="entry-cals">{entry.calories}</span>
                      <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>×</button>
                    </div>
                  </li>
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
