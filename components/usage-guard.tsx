"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface UsageGuardProps {
  action: "quiz_attempt" | "meal_log"
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function UsageGuard({ action, children, fallback }: UsageGuardProps) {
  const { canPerformAction, isPremium } = useSubscription()
  const [canAccess, setCanAccess] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAccess()
  }, [action])

  const checkAccess = async () => {
    const hasAccess = await canPerformAction(action)
    setCanAccess(hasAccess)
  }

  if (canAccess === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!canAccess) {
    const actionName = action === "quiz_attempt" ? "quiz attempts" : "meal logging"

    return (
      fallback || (
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-50 rounded-full w-fit">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-xl">Daily Limit Reached</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You've reached your daily limit for {actionName}. Upgrade to Premium for unlimited access!
            </p>

            <div className="space-y-2">
              <Button onClick={() => router.push("/pricing")} className="w-full bg-red-500 hover:bg-red-600">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    )
  }

  return <>{children}</>
}
