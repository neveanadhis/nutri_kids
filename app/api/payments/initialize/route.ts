import { type NextRequest, NextResponse } from "next/server"
import { flutterwaveServer } from "@/lib/flutterwave/server"
import { createServerClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await request.json()

    // Find the selected plan
    const selectedPlan = SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
    if (!selectedPlan || selectedPlan.price === 0) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    // Generate unique transaction reference
    const tx_ref = `nutrikids_${user.id}_${Date.now()}`

    // Initialize payment with Flutterwave
    const paymentData = {
      amount: selectedPlan.price,
      currency: selectedPlan.currency,
      email: user.email!,
      phone_number: profile.phone || undefined,
      name: profile.full_name || user.email!,
      tx_ref,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
      customer: {
        email: user.email!,
        phone_number: profile.phone || undefined,
        name: profile.full_name || user.email!,
      },
      customizations: {
        title: "NutriKids Premium Subscription",
        description: `${selectedPlan.name} subscription for NutriKids`,
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/nutrikids-logo.png`,
      },
    }

    const response = await flutterwaveServer.initializePayment(paymentData)

    if (response.status === "success") {
      // Store pending payment in database
      await supabase.from("payments").insert({
        user_id: user.id,
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        status: "pending",
        flutterwave_transaction_id: tx_ref,
      })

      return NextResponse.json({
        status: "success",
        data: {
          link: response.data.link,
          tx_ref,
        },
      })
    } else {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
