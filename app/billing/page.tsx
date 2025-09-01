"use client"

import { useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, CreditCard, Crown, AlertTriangle } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import { useRouter } from "next/navigation"

export default function BillingPage() {
  const { subscription, isPremium, isLoading, cancelSubscription } = useSubscription()
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  const handleCancelSubscription = async () => {
    setIsCancelling(true)
    try {
      const success = await cancelSubscription()
      if (success) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = subscription
    ? SUBSCRIPTION_PLANS.find((p) => p.id === subscription.plan_id)
    : SUBSCRIPTION_PLANS.find((p) => p.id === "free")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{currentPlan?.name}</h3>
                  <p className="text-gray-600">
                    {currentPlan?.price === 0
                      ? "Free forever"
                      : `${currentPlan?.currency} ${currentPlan?.price.toLocaleString()}/${currentPlan?.interval}`}
                  </p>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-green-500" : ""}>
                  {subscription?.status || "Free"}
                </Badge>
              </div>

              {subscription && isPremium && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {new Date(subscription.current_period_start).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                {!isPremium ? (
                  <Button onClick={() => router.push("/pricing")} className="w-full bg-red-500 hover:bg-red-600">
                    Upgrade to Premium
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={() => router.push("/pricing")} variant="outline" className="w-full">
                      Change Plan
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Cancel Subscription
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Cancel Subscription
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your subscription? You'll lose access to premium features at
                            the end of your current billing period.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelSubscription}
                            disabled={isCancelling}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No billing history available</p>
              <p className="text-sm">Your payment history will appear here once you make a purchase</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
