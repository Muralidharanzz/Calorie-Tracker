import React, { useMemo } from 'react';

const Companion = ({ remaining, isExceeded, mealTypesLogged, user }) => {
  const persona = user.companionPersona || 'balanced';
  const nameLabel = user.userName ? ` ${user.userName}` : '';

  const getRecommendation = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Morning';
    else if (hour < 17) timeGreeting = 'Afternoon';
    else timeGreeting = 'Evening';

    // Helper to pick random message
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // STRICT PERSONA
    if (persona === 'strict') {
      if (isExceeded) return { 
        message: pick([
          `You broke your limit${nameLabel}. Unacceptable. Fast until tomorrow.`,
          `Calorie limit breached. Drink water and stop eating immediately.`,
          `You failed your objective for today. Discipline is required tomorrow.`
        ]), 
        type: "warning", 
        icon: "💂" 
      };
      if (remaining > 1000) return { 
        message: pick([
          `You are under-eating heavily this ${timeGreeting}. Fuel your body immediately.`,
          `Stop starving yourself. Consume a nutrient-dense, high-protein meal.`,
          `Macros are low. Execute a meal plan now to reach your target.`
        ]), 
        type: "positive", 
        icon: "💂" 
      };
      if (remaining > 500) return { 
        message: pick([
          `Adequate space remains. Consume a measured meal now.`,
          `You have runway. Proceed with a calculated, balanced plate.`,
          `Status nominal. A moderate meal of 500 calories is authorized.`
        ]), 
        type: "positive", 
        icon: "💂" 
      };
      if (remaining > 200) return { 
        message: pick([
          `Approaching limits. Restrict intake to a minor snack. No sugar.`,
          `Proceed with caution. Only a small, high-protein snack is permitted.`,
          `Warning: Limits approaching. A simple piece of fruit or almonds is allowed.`
        ]), 
        type: "neutral", 
        icon: "💂" 
      };
      if (remaining > 0) return { 
        message: pick([
          `Threshold critical. Stop eating for the day. Herbal tea is permitted.`,
          `Cease intake. You are exactly at your limit boundary.`,
          `Objective nearly complete. Do not ruin it with late snacking.`
        ]), 
        type: "neutral", 
        icon: "💂" 
      };
      return { 
        message: pick([
          `Goal met precisely. Maintain this discipline.`,
          `Calculation perfect. Exceptional discipline today.`,
          `Objective achieved. Zero deviation.`
        ]), 
        type: "positive", 
        icon: "💂" 
      };
    }

    // CHEERLEADER PERSONA
    if (persona === 'cheerleader') {
      if (isExceeded) return { 
        message: pick([
          `Oopsie, slightly over! But you're still doing amazing${nameLabel}! 💖✨`,
          `Don't even stress about going over! Tomorrow is a beautiful new day! 🌟`,
          `A little over your goal? Who cares! You are still a superstar! Drink some water and relax! 🍓💧`
        ]), 
        type: "warning", 
        icon: "🎉" 
      };
      if (remaining > 1000) return { 
        message: pick([
          `Good ${timeGreeting}${nameLabel}! Wow, so many calories left! Treat yourself to a delicious healthy meal! 🥑`,
          `You have a ton of room left! You deserve a massive, colourful plate of food! 🍕💖`,
          `Time to eat something yummy! Fuel that gorgeous body! 🥗✨`
        ]), 
        type: "positive", 
        icon: "🎉" 
      };
      if (remaining > 500) return { 
        message: pick([
          `You're doing fantastic this ${timeGreeting}! Grab a yummy bowl or smoothie! 🥤🔥`,
          `Perfect time for a super fun, balanced meal! You've totally got this! 🌟`,
          `Keep that energy up! A hearty, beautiful plate is calling your name! 🍒💖`
        ]), 
        type: "positive", 
        icon: "🎉" 
      };
      if (remaining > 200) return { 
        message: pick([
          `Almost there bestie! A sweet little snack would be totally perfect right now! 🫐🌟`,
          `You are SO close to your goal! How about some Greek yogurt with honey? 🍯💖`,
          `Just a little room left! A tasty piece of fruit is exactly what you need! 🍏✨`
        ]), 
        type: "neutral", 
        icon: "🎉" 
      };
      if (remaining > 0) return { 
        message: pick([
          `Nailed it! You're right on the finish line! Sip some tea and relax, you superstar! ⭐️🍵`,
          `Look at you go! You basically hit your goal perfectly! I am SO proud! 🎆💯`,
          `Amazing precision! Let's wrap up this beautiful day with some water and self-care! 💖✨`
        ]), 
        type: "neutral", 
        icon: "🎉" 
      };
      return { 
        message: pick([
          `PERFECT SCORE! You are absolutely crushing your goals! I am so proud! 🎆💯`,
          `Exactly on the dot! You are a literal magician! Best day ever! 🌟💖`,
          `Unbelievable! You hit it PERFECTLY! Let's celebrate your incredible consistency! 🎉✨`
        ]), 
        type: "positive", 
        icon: "🎉" 
      };
    }

    // BALANCED (DEFAULT)
    if (isExceeded) return { 
      message: pick([
        `You've gone slightly over your goal today${nameLabel}. No stress—drink plenty of water and focus on a fresh start tomorrow. 💪`,
        `A little over budget today, but that's perfectly normal! Consistency over perfection. 🌊`,
        `You exceeded your limit, but don't let it derail you. Tomorrow is a brand new opportunity. 🌱`
      ]), 
      type: "warning", 
      icon: "✨" 
    };
    if (remaining > 1000) return { 
      message: pick([
        `Good ${timeGreeting.toLowerCase()}${nameLabel}! You have plenty of calories left. A hearty, balanced meal with protein is a great choice. 🥗`,
        `You've got a lot of runway left today. Make sure to fuel up with some complex carbs and healthy fats! 🥑`,
        `It's a great time for a larger meal. Try to hit your protein targets to stay full longer. 🥩`
      ]), 
      type: "positive", 
      icon: "✨" 
    };
    if (remaining > 500) return { 
      message: pick([
        `Perfect zone for a moderate meal! Think grilled chicken, a quinoa bowl, or a loaded smoothie. 🍗`,
        `You have a good chunk of calories left for a solid meal. Listen to your body and eat until satisfied. 🍲`,
        `This ${timeGreeting.toLowerCase()} is perfect for a balanced plate. Keep up the great pace! 🍛`
      ]), 
      type: "positive", 
      icon: "✨" 
    };
    if (remaining > 200) return { 
      message: pick([
        `Getting close to your limit! How about a light snack? A handful of almonds or yogurt would be ideal. 🫐`,
        `You're approaching your goal. A small, high-protein snack will help bridge the gap without going over. 🥚`,
        `Almost there! If you're hungry, grab some fruit or veggies to crunch on. 🥕`
      ]), 
      type: "neutral", 
      icon: "✨" 
    };
    if (remaining > 0) return { 
      message: pick([
        `You've almost hit your goal perfectly! A piece of fruit or a cup of green tea is the way to go. 🍏`,
        `You are right at your limit. Great job managing your intake today! 🍵`,
        `Excellent pacing. You're practically at the finish line. Drink some water to finish out the day strong. 💧`
      ]), 
      type: "neutral", 
      icon: "✨" 
    };
    return { 
      message: pick([
        `You crushed your goal right on the dot${nameLabel}! Great discipline today. 🔥`,
        `Perfect accuracy. Hitting your exact calorie goal is no easy feat! 🎯`,
        `Exactly zero calories remaining. Phenomenal job staying on track today. 🏆`
      ]), 
      type: "positive", 
      icon: "✨" 
    };
  };

  // We only want the message to recalculate randomly when the major dependencies change
  const currentRec = useMemo(() => getRecommendation(), [remaining, isExceeded, persona, nameLabel]);

  return (
    <div className={`companion-card ${currentRec.type}`}>
      <div className="companion-header">
        <span className="companion-icon">{currentRec.icon}</span>
        <h3>Caltos Advisor</h3>
      </div>
      <p className="companion-message">{currentRec.message}</p>
    </div>
  );
};

export default Companion;
