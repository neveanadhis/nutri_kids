"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/use-subscription"

export function UpgradePrompt() {
  const { isPremium } = useSubscription()
  const router = useRouter()

  if (isPremium) return null

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-yellow-600" />
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Premium Features!</h3>
        <p className="text-gray-600 mb-4">Get unlimited quizzes, detailed nutrition analysis, and exclusive badges</p>

        <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Unlimited Access</span>
          </div>
          <div className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>Premium Badges</span>
          </div>
        </div>

        <Button
          onClick={() => router.push("/pricing")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6"
        >
          Upgrade Now - Starting at KES 500/month
        </Button>
      </CardContent>
    </Card>
  )
}
