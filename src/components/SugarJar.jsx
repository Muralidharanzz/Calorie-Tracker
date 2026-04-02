import React from 'react';

/**
 * Visualizer for Daily Snack / Sugar Allowance
 * Warns the user when their snack calories get too high or sugar is detected.
 */
const SugarJar = ({ entries, user }) => {
  if (!user?.sugarControlMode) return null;

  const todayString = new Date().toISOString().split('T')[0];
  const todaysEntries = entries.filter(e => e.date.startsWith(todayString));
  
  // Sugar logs
  const sugarKeywords = ['sugar', 'cake', 'candy', 'soda', 'coke', 'chocolate', 'cookie', 'ice cream', 'sweet', 'donut', 'syrup', 'dessert'];
  const hasSugar = todaysEntries.some(e => sugarKeywords.some(kw => e.foodName.toLowerCase().includes(kw)));
  
  // Snack calories
  const snackCalories = todaysEntries
    .filter(e => e.mealType === 'Snacks')
    .reduce((acc, e) => acc + e.calories, 0);

  const snackLimit = Math.round(user.dailyCalorieGoal * 0.25); // 25% of goal is a better limit for the jar
  const pct = Math.min((snackCalories / snackLimit) * 100, 100);

  const isDanger = pct >= 80 || hasSugar;
  const jarColor = isDanger ? '#ff5252' : '#ffb74d';

  return (
    <div className="water-tracker dashboard" style={{ marginTop: 16 }}>
      <div className="water-header">
        <span className="water-title">🍯 Sugar & Snacks Jar</span>
        <span className="water-count" style={{ color: isDanger ? '#ff5252' : undefined }}>
          {snackCalories}/{snackLimit} kcal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        {/* Jar SVG */}
        <div style={{ flexShrink: 0, position: 'relative', width: 44, height: 50 }}>
           <svg viewBox="0 0 40 50" width="100%" height="100%">
             {/* Jar Body */}
             <path
               d="M8 10 C 2 10, 2 18, 2 20 L 2 44 C 2 48, 6 50, 10 50 L 30 50 C 34 50, 38 48, 38 44 L 38 20 C 38 18, 38 10, 32 10 Z"
               fill="none"
               stroke="rgba(255,255,255,0.2)"
               strokeWidth="2"
             />
             {/* Jar Lid */}
             <rect x="10" y="2" width="20" height="8" rx="2" fill="rgba(255,255,255,0.4)" />
             
             {/* Fill Content */}
             {pct > 0 && (
               <clipPath id="jarClip">
                 <path d="M8 10 C 2 10, 2 18, 2 20 L 2 44 C 2 48, 6 50, 10 50 L 30 50 C 34 50, 38 48, 38 44 L 38 20 C 38 18, 38 10, 32 10 Z" />
               </clipPath>
             )}
             {pct > 0 && (
               <rect 
                 x="0" 
                 y={50 - (pct / 100) * 40} 
                 width="40" 
                 height={(pct / 100) * 40} 
                 fill={jarColor} 
                 clipPath="url(#jarClip)" 
                 style={{ transition: 'y 0.5s ease, height 0.5s ease' }}
               />
             )}
             
             {/* Warning icon if strict mode caught sugar */}
             {hasSugar && (
               <text x="20" y="32" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">!</text>
             )}
           </svg>
        </div>

        <div style={{ flexGrow: 1 }}>
          <p style={{ fontSize: '0.85rem', color: isDanger ? '#ff8a80' : 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
            {hasSugar 
              ? "Sugar spike detected! Your grade will take a heavy penalty today." 
              : pct >= 100 
                ? "Jar is overflowing! Try to avoid any more snacks." 
                : "Keep an eye on this jar to maintain your Sugar Detox streak."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SugarJar;
