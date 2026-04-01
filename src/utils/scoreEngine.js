/**
 * Calculates a 100-point Discipline Score (A-F grade) based on daily logging habits.
 * @param {Array} todayEntries - The entries for the current day
 * @param {number} dailyGoal - The user's calorie goal
 * @param {number} streak - The current day streak
 * @returns {Object} { score, grade, color, breakdown }
 */
export function calculateScore(todayEntries, dailyGoal, streak, mealTimes = {}) {
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

  // 1. Total Volume (±100 Buffer)
  const totalCals = todayEntries.reduce((acc, e) => acc + e.calories, 0);
  const diff = totalCals - dailyGoal;
  const devAbs = Math.abs(diff);
  const currentHour = new Date().getHours();

  // "Ghost Town" only applies late in the day (after 6 PM)
  if (currentHour >= 18 && totalCals < (dailyGoal * 0.25)) {
    score -= 40;
    addBreakdown('Ghost Town (Extreme Under-tracking)', -40, 'penalty');
  } else if (currentHour >= 18 && diff < -100) {
    // Under-eating (more than 100 calories below goal)
    // Lose 2 points for every 50 calories below buffer
    const penalty = Math.round(((Math.abs(diff) - 100) / 50) * 2);
    score -= penalty;
    addBreakdown(`Volume (${Math.abs(diff)} kcal Under)`, -penalty, 'penalty');
  }

  // Perfect Zone Check
  if (devAbs <= 100) {
    addBreakdown('Perfect Calorie Range (±100)', 0, 'bonus');
  }
  
  // Overeating: > 100 over goal
  if (diff > 100) {
    const penalty = Math.round(((diff - 100) / 50) * 2);
    const finalPenalty = Math.min(penalty, 50);
    score -= finalPenalty;
    addBreakdown(`Volume (${diff} kcal Over)`, -finalPenalty, 'penalty');
  }

  // 2. Exact Meal Timing Logic (60 min strict buffer)
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

  const currentMins = new Date().getHours() * 60 + new Date().getMinutes();

  ['Breakfast', 'Lunch', 'Dinner'].forEach(mealName => {
     const mealEntries = todayEntries.filter(e => e.mealType === mealName);
     const targetMins = getMinutesOfDay(mt[mealName]);
     
     if (mealEntries.length > 0) {
        // Find the earliest timestamp they logged this meal
        const earliestTime = Math.min(...mealEntries.map(e => new Date(e.date).getTime()));
        const firstLogDate = new Date(earliestTime);
        const firstLogMins = firstLogDate.getHours() * 60 + firstLogDate.getMinutes();
        const diffMins = firstLogMins - targetMins;

        // If they logged it strictly > 60 mins past their Profile target
        if (diffMins > 60) {
           score -= 5;
           addBreakdown(`Late ${mealName} (>60m)`, -5, 'penalty');
        }
     } else {
        // Missing meal - only penalize if it is currently PAST the exact target + 60 minutes
        if (currentMins > (targetMins + 60)) {
           score -= 10;
           addBreakdown(`Skipped ${mealName}`, -10, 'penalty');
        }
     }
  });

  // 3. Late Night Snacking / Eating (Logged after 10:00 PM)
  // We use the entry's ISO string. Since users log in real-time, we check the 'HH'
  const lateCalories = todayEntries.reduce((acc, e) => {
    const d = new Date(e.date);
    const hours = d.getHours();
    if (hours >= 22 || hours < 4) { // 10 PM to 4 AM
      return acc + e.calories;
    }
    return acc;
  }, 0);
  
  if (lateCalories > (dailyGoal * 0.25)) {
    score -= 15;
    addBreakdown('Heavy Late-Night Eating (>25%)', -15, 'penalty');
  }

  // 4. Sugar / Junk Snack Spike
  const maxSnack = todayEntries
    .filter(e => e.mealType === 'Snacks')
    .reduce((max, e) => Math.max(max, e.calories), 0);
  
  if (maxSnack > (dailyGoal * 0.35)) {
    score -= 15;
    addBreakdown('Unhealthy Snack Spike (>35%)', -15, 'penalty');
  }

  // 5. Streak Bonus
  if (streak >= 7) {
    score += 10;
    addBreakdown('7+ Day Consistency Streak', 10, 'bonus');
  } else if (streak >= 3) {
    score += 5;
    addBreakdown('3+ Day Consistency Streak', 5, 'bonus');
  }

  // Ensure score stays bounded
  if (score < 0) score = 0;
  // Let it go slightly over 100 (e.g. 110 with streaks) to feel rewarding

  // Grade Assignment
  let grade = 'F';
  let color = '#ff5252'; // Red

  if (score >= 95) { grade = 'A+'; color = '#00e676'; } // Green
  else if (score >= 90) { grade = 'A'; color = '#00e676'; }
  else if (score >= 80) { grade = 'B'; color = '#00e676'; }
  else if (score >= 70) { grade = 'C'; color = '#ffc107'; } // Amber
  else if (score >= 60) { grade = 'D'; color = '#ffc107'; } 

  return { score, grade, color, breakdown };
}
