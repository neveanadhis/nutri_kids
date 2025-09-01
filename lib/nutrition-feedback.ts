// Simulated AI nutrition feedback generator
// In a real app, this would call an AI service like OpenAI or Anthropic

interface NutritionFeedback {
  message: string
  score: number // 1-5 stars
  tips: string[]
}

export function generateNutritionFeedback(mealDescription: string): NutritionFeedback {
  const meal = mealDescription.toLowerCase()

  // Analyze meal content
  const hasVegetables = /vegetable|lettuce|tomato|carrot|broccoli|spinach|pepper|cucumber|onion|salad|greens/i.test(
    meal,
  )
  const hasFruits = /apple|banana|orange|berry|grape|fruit|strawberry|blueberry|peach|pear/i.test(meal)
  const hasProtein = /chicken|fish|turkey|beef|egg|beans|nuts|cheese|yogurt|milk|protein/i.test(meal)
  const hasWholeGrains = /brown rice|whole wheat|oats|quinoa|whole grain/i.test(meal)
  const hasProcessedFood = /pizza|burger|fries|chips|soda|candy|cookie|cake|ice cream|fast food/i.test(meal)
  const hasSugar = /candy|soda|cookie|cake|ice cream|donut|chocolate|sweet/i.test(meal)

  let score = 3 // Base score
  const tips: string[] = []
  let message = ""

  // Adjust score based on meal content
  if (hasVegetables) score += 0.5
  if (hasFruits) score += 0.5
  if (hasProtein) score += 0.5
  if (hasWholeGrains) score += 0.5
  if (hasProcessedFood) score -= 1
  if (hasSugar) score -= 0.5

  // Cap score between 1 and 5
  score = Math.max(1, Math.min(5, Math.round(score)))

  // Generate message based on score
  if (score >= 4) {
    message =
      "Excellent choice! Your meal has a great balance of nutrients that will give you energy and help you grow strong. Keep up the fantastic eating habits!"
  } else if (score >= 3) {
    message =
      "Good job! Your meal has some healthy elements. With a few small changes, you can make it even more nutritious and delicious."
  } else {
    message =
      "Thanks for logging your meal! Every meal is a chance to fuel your body with good nutrition. Let's look at some ways to make your next meal even healthier."
  }

  // Generate tips based on what's missing
  if (!hasVegetables) {
    tips.push("Try adding colorful vegetables like carrots, bell peppers, or leafy greens to get important vitamins")
  }
  if (!hasFruits) {
    tips.push("Include a piece of fruit for natural sweetness and vitamin C")
  }
  if (!hasProtein) {
    tips.push("Add protein like chicken, fish, eggs, or beans to help build strong muscles")
  }
  if (!hasWholeGrains) {
    tips.push("Choose whole grain bread, brown rice, or oats for lasting energy")
  }
  if (hasProcessedFood) {
    tips.push("Try to limit processed foods and choose fresh, whole foods when possible")
  }
  if (hasSugar) {
    tips.push("Enjoy sweet treats in moderation and try fruit for natural sweetness")
  }

  // Add general tips if no specific issues
  if (tips.length === 0) {
    tips.push("Remember to drink plenty of water throughout the day")
    tips.push("Try to eat a rainbow of colorful foods for the best nutrition")
  }

  return { message, score, tips }
}
