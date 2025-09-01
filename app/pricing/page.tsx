"use client"

import { useState } from "react"
import { PricingCard } from "@/components/pricing-card"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<string>("free")

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      // Handle free plan selection
      setCurrentPlan(planId)
    } else {
      // Redirect to payment flow
      window.location.href = `/payment?plan=${planId}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your nutrition journey for free, or unlock premium features to accelerate your learning and get
            personalized insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} currentPlan={currentPlan} onSelectPlan={handleSelectPlan} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access to premium features
                until the end of your billing period.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our free plan gives you access to core features forever. You can upgrade to premium anytime to unlock
                advanced features.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept M-Pesa, bank transfers, and major credit/debit cards through our secure payment partner
                Flutterwave.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
