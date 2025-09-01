"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"
import { Loader2 } from "lucide-react"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)

  useEffect(() => {
    if (!planId || !selectedPlan || selectedPlan.price === 0) {
      router.push("/pricing")
    }
  }, [planId, selectedPlan, router])

  const handlePayment = async () => {
    if (!selectedPlan) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlan.id }),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Redirect to Flutterwave payment page
        window.location.href = data.data.link
      } else {
        setError(data.error || "Payment initialization failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedPlan) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
            <p className="text-2xl font-bold text-red-500 mt-2">
              {selectedPlan.currency} {selectedPlan.price.toLocaleString()}
              <span className="text-sm text-gray-500 ml-1">/{selectedPlan.interval}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What you'll get:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {selectedPlan.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <Button onClick={handlePayment} disabled={isLoading} className="w-full bg-red-500 hover:bg-red-600">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Flutterwave. Your payment information is encrypted and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
