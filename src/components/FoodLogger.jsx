import React, { useState, useRef, useEffect } from 'react';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const FoodLogger = ({ onAddEntry, recentFoods }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  
  const calRef = useRef(null);

  // Auto-fill from recent foods
  const handleRecentClick = (food) => {
    setFoodName(food.foodName);
    setCalories(food.calories);
    // Auto-focus on calorie field for super fast adjustments? Or just user taps "Save"
  };

  const handleSave = () => {
    if (!foodName || !calories) return;

    onAddEntry({
      foodName,
      calories: Number(calories),
      mealType
    });

    // Reset but maybe keep the current mealType unless they want to change it
    setFoodName('');
    setCalories('');
    
    // Auto-focus back on foodName for the next item
  };

  return (
    <section className="food-logger">
      <div className="flex-between">
        <h2>Log Food</h2>
        <span className="fast-text">⚡ ultra-fast</span>
      </div>

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

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Food name" 
          className="input" 
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          autoFocus
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
            onClick={() => setMealType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={handleSave}>
        Save & Add Another
      </button>
    </section>
  );
};

export default FoodLogger;
