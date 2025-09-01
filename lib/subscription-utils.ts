import { createClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS, FREE_LIMITS } from "@/lib/subscription-plans"

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  flutterwave_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface UserUsage {
  id: string
  user_id: string
  date: string
  quiz_attempts: number
  meal_logs: number
  created_at: string
}

// Client-side subscription utilities
export class SubscriptionManager {
  private supabase = createClient()

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await this.supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (error) return null
    return data
  }

  async getUserUsage(date?: string): Promise<UserUsage | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return null

    const targetDate = date || new Date().toISOString().split("T")[0]

    const { data, error } = await this.supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", targetDate)
      .single()

    if (error) return null
    return data
  }

  async incrementUsage(type: "quiz_attempts" | "meal_logs"): Promise<boolean> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return false

    const today = new Date().toISOString().split("T")[0]

    // Get or create today's usage record
    const { data: existingUsage } = await this.supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    if (existingUsage) {
      // Update existing record
      const { error } = await this.supabase
        .from("user_usage")
        .update({
          [type]: existingUsage[type] + 1,
        })
        .eq("id", existingUsage.id)

      return !error
    } else {
      // Create new record
      const { error } = await this.supabase.from("user_usage").insert({
        user_id: user.id,
        date: today,
        [type]: 1,
      })

      return !error
    }
  }

  async canPerformAction(action: "quiz_attempt" | "meal_log"): Promise<boolean> {
    const subscription = await this.getCurrentSubscription()

    // Premium users have unlimited access
    if (subscription && subscription.status === "active") {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan_id)
      if (plan && plan.price > 0) {
        return true
      }
    }

    // Check free tier limits
    const usage = await this.getUserUsage()
    const currentUsage = usage ? (action === "quiz_attempt" ? usage.quiz_attempts : usage.meal_logs) : 0

    const limit = action === "quiz_attempt" ? FREE_LIMITS.dailyQuizAttempts : FREE_LIMITS.dailyMealLogs

    return currentUsage < limit
  }

  async isPremiumUser(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription()
    if (!subscription || subscription.status !== "active") return false

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan_id)
    return plan ? plan.price > 0 : false
  }

  async cancelSubscription(): Promise<boolean> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) return false

    const { error } = await this.supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "active")

    return !error
  }
}

// Server-side subscription utilities
export async function getServerSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error) return null
  return data
}

export async function isServerPremiumUser(userId: string): Promise<boolean> {
  const subscription = await getServerSubscription(userId)
  if (!subscription || subscription.status !== "active") return false

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan_id)
  return plan ? plan.price > 0 : false
}
