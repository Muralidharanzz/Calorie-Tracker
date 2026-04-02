/**
 * Calculates a 100-point Discipline Score (A-F grade) based on daily logging habits.
 * @param {Array} todayEntries - The entries for the current day
 * @param {number} dailyGoal - The user's calorie goal
 * @param {number} streak - The current day streak
 * @returns {Object} { score, grade, color, breakdown }
 */
export function calculateScore(todayEntries, dailyGoal, streak, mealTimes = {}, dateStr = null, user = {}) {
  let score = 100;
  const breakdown = [];
  
  const addBreakdown = (label, points, type) => {
    breakdown.push({ label, points, type });
  };

  addBreakdown('Base Score', 100, 'base');

  if (todayEntries.length === 0) {
    return {
      score: 0,
      grade: '-',
      color: '#7a9c87', // neutral
      breakdown: [{ label: 'No entries yet', points: 0, type: 'neutral' }]
    };
  }

  // Handle past day evaluation
  const isPastDay = dateStr && dateStr !== new Date().toISOString().split('T')[0];
  const currentHour = isPastDay ? 23 : new Date().getHours();
  const currentMins = isPastDay ? 23 * 60 + 59 : new Date().getHours() * 60 + new Date().getMinutes();

  // 1. Total Volume (±100 Buffer)
  const totalCals = todayEntries.reduce((acc, e) => acc + e.calories, 0);
  const diff = totalCals - dailyGoal;
  const devAbs = Math.abs(diff);

  // "Ghost Town" only applies late in the day (after 6 PM)
  if (currentHour >= 18 && totalCals < (dailyGoal * 0.25)) {
    score -= 40;
    addBreakdown('Ghost Town (Extreme Under-tracking)', -40, 'penalty');
  } else if (currentHour >= 18 && diff < -100) {
    // Under-eating
    const penalty = Math.round(((Math.abs(diff) - 100) / 50) * 2);
    score -= penalty;
    addBreakdown(`Volume (${Math.abs(diff)} kcal Under)`, -penalty, 'penalty');
  }

  if (devAbs <= 100) {
    addBreakdown('Perfect Calorie Range (±100)', 0, 'bonus');
  }
  
  if (diff > 100) {
    const penalty = Math.round(((diff - 100) / 50) * 2);
    const finalPenalty = Math.min(penalty, 50);
    score -= finalPenalty;
    addBreakdown(`Volume (${diff} kcal Over)`, -finalPenalty, 'penalty');
  }

  // 2. Exact Meal Timing Logic
  const mt = {
     Breakfast: mealTimes?.Breakfast || '09:00',
     Lunch: mealTimes?.Lunch || '13:00',
     Dinner: mealTimes?.Dinner || '19:00'
  };

  const getMinutesOfDay = (timeStr) => {
     if (!timeStr) return 0;
     const [h, m] = timeStr.split(':').map(Number);
     return h * 60 + (m || 0);
  };

  ['Breakfast', 'Lunch', 'Dinner'].forEach(mealName => {
     const mealEntries = todayEntries.filter(e => e.mealType === mealName);
     const targetMins = getMinutesOfDay(mt[mealName]);
     
     if (mealEntries.length > 0) {
        const earliestTime = Math.min(...mealEntries.map(e => new Date(e.date).getTime()));
        const firstLogDate = new Date(earliestTime);
        const firstLogMins = firstLogDate.getHours() * 60 + firstLogDate.getMinutes();
        const diffMins = firstLogMins - targetMins;

        if (diffMins > 60) {
           score -= 5;
           addBreakdown(`Late ${mealName} (>60m)`, -5, 'penalty');
        }
     } else {
        if (currentMins > (targetMins + 60)) {
           score -= 10;
           addBreakdown(`Skipped ${mealName}`, -10, 'penalty');
        }
     }
  });

  // 3. Late Night Snacking / Eating (10:00 PM to 6:00 AM)
  const lateCalories = todayEntries.reduce((acc, e) => {
    const d = new Date(e.date);
    const hours = d.getHours();
    if (hours >= 22 || hours < 6) { 
      return acc + e.calories;
    }
    return acc;
  }, 0);
  
  if (lateCalories > (dailyGoal * 0.25)) {
    score -= 15;
    addBreakdown('Outside Active Hours (>25%)', -15, 'penalty');
  }

  // 4. Sugar & Junk Spike
  const maxSnack = todayEntries
    .filter(e => e.mealType === 'Snacks')
    .reduce((max, e) => Math.max(max, e.calories), 0);
  
  if (maxSnack > (dailyGoal * 0.35)) {
    score -= 15;
    addBreakdown('Unhealthy Snack Spike (>35%)', -15, 'penalty');
  }

  // -- NEW: Sugar Cut Penalty 
  const sugarKeywords = ['sugar', 'cake', 'candy', 'soda', 'coke', 'chocolate', 'cookie', 'ice cream', 'sweet', 'donut', 'syrup', 'dessert'];
  const sugarLogs = todayEntries.filter(e => {
    const name = e.foodName.toLowerCase();
    return sugarKeywords.some(kw => name.includes(kw));
  });

  if (sugarLogs.length > 0) {
    if (user?.sugarControlMode) {
      score -= 20;
      addBreakdown('Strict Sugar Cut Penalty', -20, 'penalty');
    } else {
      score -= 5; // Light penalty even if not in strict mode
      addBreakdown('Sugar Item Logged', -5, 'penalty');
    }
  } else if (todayEntries.length > 0 && user?.sugarControlMode) {
    // Reward for achieving a completely sugar free day!
    score += 10;
    addBreakdown('Sugar-Free Day Bonus', 10, 'bonus');
  }

  // 5. Streak Bonus
  if (streak >= 7) {
    score += 10;
    addBreakdown('7+ Day Consistency Streak', 10, 'bonus');
  } else if (streak >= 3) {
    score += 5;
    addBreakdown('3+ Day Consistency Streak', 5, 'bonus');
  }

  if (score < 0) score = 0;

  let grade = 'F';
  let color = '#ff5252';

  if (score >= 95) { grade = 'A+'; color = '#00e676'; } 
  else if (score >= 90) { grade = 'A'; color = '#00e676'; }
  else if (score >= 80) { grade = 'B'; color = '#00e676'; }
  else if (score >= 70) { grade = 'C'; color = '#ffc107'; }
  else if (score >= 60) { grade = 'D'; color = '#ffc107'; } 

  return { score, grade, color, breakdown };
}
