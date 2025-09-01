"use client"

import { useState, useEffect } from "react"
import { SubscriptionManager, type UserSubscription, type UserUsage } from "@/lib/subscription-utils"

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [usage, setUsage] = useState<UserUsage | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const subscriptionManager = new SubscriptionManager()

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    setIsLoading(true)
    try {
      const [subData, usageData, premiumStatus] = await Promise.all([
        subscriptionManager.getCurrentSubscription(),
        subscriptionManager.getUserUsage(),
        subscriptionManager.isPremiumUser(),
      ])

      setSubscription(subData)
      setUsage(usageData)
      setIsPremium(premiumStatus)
    } catch (error) {
      console.error("Error loading subscription data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canPerformAction = async (action: "quiz_attempt" | "meal_log"): Promise<boolean> => {
    return subscriptionManager.canPerformAction(action)
  }

  const incrementUsage = async (type: "quiz_attempts" | "meal_logs"): Promise<boolean> => {
    const success = await subscriptionManager.incrementUsage(type)
    if (success) {
      // Refresh usage data
      const newUsage = await subscriptionManager.getUserUsage()
      setUsage(newUsage)
    }
    return success
  }

  const cancelSubscription = async (): Promise<boolean> => {
    const success = await subscriptionManager.cancelSubscription()
    if (success) {
      await loadSubscriptionData()
    }
    return success
  }

  return {
    subscription,
    usage,
    isPremium,
    isLoading,
    canPerformAction,
    incrementUsage,
    cancelSubscription,
    refreshData: loadSubscriptionData,
  }
}
