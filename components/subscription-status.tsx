"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Calendar, Activity } from "lucide-react"
import { SUBSCRIPTION_PLANS, FREE_LIMITS } from "@/lib/subscription-plans"
import { useRouter } from "next/navigation"

export function SubscriptionStatus() {
  const { subscription, usage, isPremium, isLoading } = useSubscription()
  const router = useRouter()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentPlan = subscription
    ? SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan_id)
    : SUBSCRIPTION_PLANS.find((p) => p.id === "free")

  const quizProgress = usage ? (usage.quiz_attempts / FREE_LIMITS.dailyQuizAttempts) * 100 : 0
  const mealProgress = usage ? (usage.meal_logs / FREE_LIMITS.dailyMealLogs) * 100 : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Subscription Status</CardTitle>
        {isPremium && <Crown className="h-5 w-5 text-yellow-500" />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{currentPlan?.name}</p>
            <p className="text-sm text-gray-500">
              {isPremium ? "Premium features unlocked" : "Free plan with limited features"}
            </p>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-green-500" : ""}>
            {subscription?.status || "Free"}
          </Badge>
        </div>

        {subscription && isPremium && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Renews on {new Date(subscription.current_period_end).toLocaleDateString()}</span>
          </div>
        )}

        {!isPremium && usage && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Quiz Attempts</span>
                <span>
                  {usage.quiz_attempts}/{FREE_LIMITS.dailyQuizAttempts}
                </span>
              </div>
              <Progress value={Math.min(quizProgress, 100)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Meal Logs</span>
                <span>
                  {usage.meal_logs}/{FREE_LIMITS.dailyMealLogs}
                </span>
              </div>
              <Progress value={Math.min(mealProgress, 100)} className="h-2" />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isPremium ? (
            <Button onClick={() => router.push("/pricing")} className="flex-1 bg-red-500 hover:bg-red-600">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          ) : (
            <Button onClick={() => router.push("/billing")} variant="outline" className="flex-1">
              <Activity className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
