import { type NextRequest, NextResponse } from "next/server"
import { flutterwaveServer } from "@/lib/flutterwave/server"
import { createServerClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function POST(request: NextRequest) {
  try {
    const { transaction_id, tx_ref } = await request.json()

    if (!transaction_id || !tx_ref) {
      return NextResponse.json({ error: "Missing transaction details" }, { status: 400 })
    }

    const verification = await flutterwaveServer.verifyPayment(transaction_id)

    if (verification.status === "success" && verification.data.status === "successful") {
      const supabase = createServerClient()

      // Extract user ID from tx_ref
      const userId = tx_ref.split("_")[1]

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "successful",
          flutterwave_transaction_id: transaction_id,
        })
        .eq("flutterwave_transaction_id", tx_ref)

      // Find the plan based on payment amount
      const plan = SUBSCRIPTION_PLANS.find((p) => p.price === verification.data.amount)

      if (plan) {
        // Calculate subscription period
        const currentPeriodStart = new Date()
        const currentPeriodEnd = new Date()

        if (plan.interval === "monthly") {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
        } else if (plan.interval === "yearly") {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
        }

        // Create or update subscription
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .single()

        if (existingSubscription) {
          // Update existing subscription
          await supabase
            .from("subscriptions")
            .update({
              plan_id: plan.id,
              status: "active",
              current_period_start: currentPeriodStart.toISOString(),
              current_period_end: currentPeriodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
        } else {
          // Create new subscription
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: plan.id,
            status: "active",
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
          })
        }
      }

      return NextResponse.json({
        status: "success",
        message: "Payment verified and subscription activated",
      })
    } else {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
