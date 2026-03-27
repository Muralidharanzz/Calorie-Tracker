import { useState, useEffect } from 'react';

// Keys for localStorage
const STORAGE_KEYS = {
  USER: 'ct_user',
  ENTRIES: 'ct_entries',
  WEIGHTS: 'ct_weights',
  RECENT_FOODS: 'ct_recent_foods'
};

const defaultUser = {
  userName: '',
  dailyCalorieGoal: 2000,
  companionPersona: 'balanced', // 'balanced', 'strict', 'cheerleader'
  mealTimes: { Breakfast: '09:00', Lunch: '13:00', Dinner: '19:00' }
};

export function useDataStore() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : defaultUser;
  });

  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return stored ? JSON.parse(stored) : [];
  });

  const [recentFoods, setRecentFoods] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_FOODS);
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_FOODS, JSON.stringify(recentFoods));
  }, [recentFoods]);

  // Actions
  const updateUserName = (name) => {
    setUser({ ...user, userName: name });
  };

  const updateUserGoal = (goal) => {
    setUser({ ...user, dailyCalorieGoal: goal });
  };

  const updateCompanionPersona = (persona) => {
    setUser({ ...user, companionPersona: persona });
  };

  const updateMealTimes = (times) => {
    setUser({ ...user, mealTimes: times });
  };

  const addEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setEntries((prev) => [...prev, newEntry]);

    // Update recent foods map (keep last 20 unique items)
    setRecentFoods((prev) => {
      const filtered = prev.filter(item => item.foodName.toLowerCase() !== entry.foodName.toLowerCase());
      const updated = [{ foodName: entry.foodName, calories: entry.calories }, ...filtered].slice(0, 20);
      return updated;
    });
  };

  const getEntriesForDate = (dateString) => {
    // dateString format: YYYY-MM-DD
    return entries.filter(e => e.date.startsWith(dateString));
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const duplicateDay = (sourceDateString, targetDateString) => {
    const sourceEntries = getEntriesForDate(sourceDateString);
    const newEntries = sourceEntries.map(e => ({
      ...e,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: targetDateString + e.date.substring(10) // replace date part but keep time if possible, or just generate new ISO 
    }));
    setEntries(prev => [...prev, ...newEntries]);
  };

  return {
    user,
    entries,
    recentFoods,
    updateUserName,
    updateUserGoal,
    updateCompanionPersona,
    updateMealTimes,
    addEntry,
    getEntriesForDate,
    deleteEntry,
    duplicateDay
  };
}
