import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { WebhookPayload } from "@/lib/flutterwave/types"

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json()

    // Verify webhook signature (recommended for production)
    const signature = request.headers.get("verif-hash")
    const expectedSignature = process.env.FLUTTERWAVE_WEBHOOK_HASH

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    if (payload.event === "charge.completed" && payload.data.status === "successful") {
      const supabase = createServerClient()

      // Extract user ID from tx_ref
      const userId = payload.data.tx_ref.split("_")[1]

      // Update payment status
      await supabase
        .from("payments")
        .update({
          status: "successful",
          flutterwave_transaction_id: payload.data.flw_ref,
        })
        .eq("flutterwave_transaction_id", payload.data.tx_ref)

      console.log(`Payment completed for user ${userId}: ${payload.data.amount} ${payload.data.currency}`)
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
