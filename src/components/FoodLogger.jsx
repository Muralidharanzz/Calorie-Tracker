import React, { useState, useRef } from 'react';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FoodLogger = ({ onAddEntry, recentFoods, user }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [saved, setSaved] = useState(false);
  const [ripple, setRipple] = useState(null); // { meal, x, y }

  const calRef = useRef(null);

  const currentHour = new Date().getHours();
  const isOutsideActiveHours = currentHour >= 22 || currentHour < 6;

  const handleRecentClick = (food) => {
    setFoodName(food.foodName);
    setCalories(food.calories);
  };

  const handleSave = () => {
    if (!foodName || !calories) return;

    if (user?.sugarControlMode) {
      const sugarKeywords = ['sugar', 'cake', 'candy', 'soda', 'coke', 'chocolate', 'cookie', 'ice cream', 'sweet', 'donut', 'syrup', 'dessert'];
      const isSugary = sugarKeywords.some(kw => foodName.toLowerCase().includes(kw));
      const hours = new Date().getHours();
      
      if (isSugary && hours >= 15) { // Afternoon/Late in the day
        const confirm = window.confirm("Wait! This looks like a sugary treat. 🚫\n\nTry drinking a glass of water first to see if you're just thirsty.\n\nDo you still want to log this and take a health score penalty?");
        if (!confirm) return;
      }
    }

    onAddEntry({ foodName, calories: Number(calories), mealType });

    setFoodName('');
    setCalories('');

    // Success pulse
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  // Ripple on meal button tap
  const handleMealTap = (type, e) => {
    setMealType(type);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ meal: type, x, y });
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <section className="food-logger">
      <h2>Log Food</h2>

      {recentFoods.length > 0 && (
        <div className="recent-foods-row">
          {recentFoods.slice(0, 5).map((food, idx) => (
            <div
              key={idx}
              className="recent-chip"
              onClick={() => handleRecentClick(food)}
            >
              <span className="chip-name">{food.foodName}</span>
              <span className="chip-cals">{food.calories}</span>
            </div>
          ))}
        </div>
      )}

      {isOutsideActiveHours ? (
        <div className="empty-state" style={{ margin: '32px 0', padding: '24px', background: 'rgba(255,82,82,0.1)', borderRadius: 12 }}>
          <span className="empty-icon">🌙</span>
          <p style={{ color: '#ff5252', fontWeight: 600 }}>Logging Closed</p>
          <p className="empty-hint">To help maintain healthy habits, you cannot log food between 10:00 PM and 6:00 AM.</p>
        </div>
      ) : (
        <>
          <div className="input-group">
            <input
              type="text"
              placeholder="Food name"
              className="input"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Calories"
              className="input input-calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              ref={calRef}
            />
          </div>

          <div className="meal-types">
            {MEAL_TYPES.map(type => (
              <button
                key={type}
                className={`meal-btn ${mealType === type ? 'active' : ''}`}
                onClick={(e) => handleMealTap(type, e)}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {type}
                {ripple?.meal === type && (
                  <span
                    className="meal-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            className={`btn-primary ${saved ? 'btn-saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Added!' : 'Save & Add Another'}
          </button>
        </>
      )}
    </section>
  );
};

export default FoodLogger;
