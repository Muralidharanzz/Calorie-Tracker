/**
 * Calculates a 100-point Discipline Score (A-F grade) based on daily logging habits.
 * @param {Array} todayEntries - The entries for the current day
 * @param {number} dailyGoal - The user's calorie goal
 * @param {number} streak - The current day streak
 * @returns {Object} { score, grade, color, breakdown }
 */
export function calculateScore(todayEntries, dailyGoal, streak) {
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

  // 1. Total Volume
  const totalCals = todayEntries.reduce((acc, e) => acc + e.calories, 0);
  const pctOfGoal = totalCals / dailyGoal;
  const currentHour = new Date().getHours();

  // Volume penalties for Under-tracking should only apply late in the day (after 6 PM)
  if (currentHour >= 18) {
    // The Ghost Town: Logged less than 25% of goal
    if (pctOfGoal < 0.25) {
      score -= 40;
      addBreakdown('Ghost Town (Extreme Under-tracking)', -40, 'penalty');
    } 
    // Under-eating but tracked something (25% to 85%)
    else if (pctOfGoal < 0.85) {
      const dev = (0.85 - pctOfGoal) * 100;
      const penalty = Math.round(dev * 0.5);
      score -= penalty;
      addBreakdown('Calorie Volume (Under Goal)', -penalty, 'penalty');
    }
  }

  // Perfect Zone Check (Applies anytime they hit it)
  if (pctOfGoal >= 0.85 && pctOfGoal <= 1.05) {
    addBreakdown('Perfect Calorie Range', 0, 'bonus');
  }
  // Overeating: > 105% (Applies anytime)
  if (pctOfGoal > 1.05) {
    const dev = (pctOfGoal - 1.05) * 100;
    const penalty = Math.round(dev * 0.5);
    const finalPenalty = Math.min(penalty, 50);
    score -= finalPenalty;
    addBreakdown('Calorie Volume (Exceeded)', -finalPenalty, 'penalty');
  }

  // 2. Meal Balance (OMAD / Missing Meals) - Time Aware
  const loggedMeals = new Set(todayEntries.map(e => e.mealType));
  
  if (!loggedMeals.has('Breakfast') && currentHour >= 10) {
    score -= 10;
    addBreakdown('Skipped Breakfast', -10, 'penalty');
  }
  if (!loggedMeals.has('Lunch') && currentHour >= 15) {
    score -= 10;
    addBreakdown('Missed Lunch', -10, 'penalty');
  }
  if (!loggedMeals.has('Dinner') && currentHour >= 21) {
    score -= 10;
    addBreakdown('Missed Dinner', -10, 'penalty');
  }

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
