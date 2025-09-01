"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<"success" | "failed" | null>(null)

  const transactionId = searchParams.get("transaction_id")
  const txRef = searchParams.get("tx_ref")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId || !txRef) {
        setVerificationStatus("failed")
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: transactionId,
            tx_ref: txRef,
          }),
        })

        const data = await response.json()

        if (data.status === "success") {
          setVerificationStatus("success")
        } else {
          setVerificationStatus("failed")
        }
      } catch (error) {
        setVerificationStatus("failed")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [transactionId, txRef])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationStatus === "success" ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {verificationStatus === "success" ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verificationStatus === "success" ? (
            <>
              <p className="text-gray-600">
                Congratulations! Your premium subscription has been activated. You now have access to all premium
                features.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/")} className="w-full bg-red-500 hover:bg-red-600">
                  Go to Dashboard
                </Button>
                <Button onClick={() => router.push("/profile")} variant="outline" className="w-full">
                  View Profile
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                We couldn't verify your payment. Please contact support if you believe this is an error.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/pricing")} className="w-full bg-red-500 hover:bg-red-600">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
