"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/use-subscription"

interface PremiumFeatureBannerProps {
  feature: string
  description: string
  className?: string
}

export function PremiumFeatureBanner({ feature, description, className = "" }: PremiumFeatureBannerProps) {
  const { isPremium } = useSubscription()
  const router = useRouter()

  if (isPremium) return null

  return (
    <Card
      className={`border-2 border-dashed border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}
    >
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Premium Feature</span>
          <Sparkles className="h-5 w-5 text-yellow-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{feature}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <Button
          onClick={() => router.push("/pricing")}
          size="sm"
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  )
}
