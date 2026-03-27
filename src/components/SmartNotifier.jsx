import React, { useEffect, useState } from 'react';

const SmartNotifier = ({ entries, user }) => {
  const [notification, setNotification] = useState(null);

  const customTimes = user.mealTimes || { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' };
  
  const activeMealTimes = [
    { type: 'Breakfast', hour: parseInt(customTimes.Breakfast.split(':')[0], 10), message: "Good morning! Don't forget to fuel up and log your Breakfast! 🍳" },
    { type: 'Lunch', hour: parseInt(customTimes.Lunch.split(':')[0], 10), message: "Midday check-in! Did you have your Lunch yet? Log it now! 🥗" },
    { type: 'Dinner', hour: parseInt(customTimes.Dinner.split(':')[0], 10), message: "Evening time! Time to wind down and log your Dinner. 🍲" }
  ];

  useEffect(() => {
    const checkMealReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const todayString = now.toISOString().split('T')[0];
      
      const todaysEntries = entries.filter(e => e.date.startsWith(todayString));
      const loggedMeals = new Set(todaysEntries.map(e => e.mealType));

      for (const meal of activeMealTimes) {
        // If it's the hour or slightly past, and they haven't logged it yet
        if (currentHour >= meal.hour && currentHour < meal.hour + 3 && !loggedMeals.has(meal.type)) {
          // Check if we already showed them a notification for this meal today
          const dismissedKey = `ct_dismissed_${todayString}_${meal.type}`;
          if (!localStorage.getItem(dismissedKey)) {
            setNotification({ meal: meal.type, message: meal.message, key: dismissedKey });
            return; // Show one at a time
          }
        }
      }
    };

    // Check immediately, then every 10 minutes
    checkMealReminders();
    const interval = setInterval(checkMealReminders, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [entries]);

  const handleDismiss = () => {
    if (notification) {
      localStorage.setItem(notification.key, 'true');
      setNotification(null);
    }
  };

  if (!notification) return null;

  return (
    <div className="smart-toast show">
      <div className="toast-content">
        <div className="toast-icon">🔔</div>
        <div>
          <h4>Friendly Reminder</h4>
          <p>{notification.message}</p>
        </div>
      </div>
      <button className="toast-close" onClick={handleDismiss}>×</button>
    </div>
  );
};

export default SmartNotifier;
