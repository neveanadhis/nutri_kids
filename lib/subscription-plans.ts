export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: "monthly" | "yearly"
  features: string[]
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "KES",
    interval: "monthly",
    features: [
      "Basic meal logging",
      "3 quiz attempts per day",
      "Basic badges",
      "Simple nutrition feedback",
      "Progress tracking",
    ],
  },
  {
    id: "premium_monthly",
    name: "Premium",
    price: 500,
    currency: "KES",
    interval: "monthly",
    popular: true,
    features: [
      "Unlimited meal logging",
      "Unlimited quiz attempts",
      "Advanced nutrition analysis",
      "Personalized meal recommendations",
      "All badges and achievements",
      "Detailed progress analytics",
      "Export progress reports",
      "Priority support",
    ],
  },
  {
    id: "premium_yearly",
    name: "Premium Yearly",
    price: 5000,
    currency: "KES",
    interval: "yearly",
    features: [
      "All Premium features",
      "2 months free",
      "Family sharing (up to 4 kids)",
      "Advanced parental insights",
      "Custom meal plans",
      "Nutrition expert consultations",
    ],
  },
]

export const FREE_LIMITS = {
  dailyQuizAttempts: 3,
  dailyMealLogs: 5,
  maxBadges: 10,
}
