"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubscriptionPlan } from "@/lib/subscription-plans"

interface PricingCardProps {
  plan: SubscriptionPlan
  currentPlan?: string
  onSelectPlan: (planId: string) => void
}

export function PricingCard({ plan, currentPlan, onSelectPlan }: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id
  const isFree = plan.price === 0

  return (
    <Card className={`relative ${plan.popular ? "border-red-500 shadow-lg" : "border-gray-200"}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">
            {plan.currency} {plan.price.toLocaleString()}
          </span>
          {!isFree && <span className="text-gray-500 ml-1">/{plan.interval}</span>}
        </div>
        {plan.interval === "yearly" && <p className="text-sm text-green-600 font-medium">Save 17%</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelectPlan(plan.id)}
          disabled={isCurrentPlan}
          className={`w-full mt-6 ${plan.popular ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-800"}`}
        >
          {isCurrentPlan ? "Current Plan" : isFree ? "Get Started" : "Upgrade Now"}
        </Button>
      </CardContent>
    </Card>
  )
}
