import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MealLoggingForm } from "@/components/meal-logging-form"

export default async function LogMealPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 text-balance">Log Your Meal! 🍽️</h1>
          <p className="text-lg text-gray-600 text-pretty">
            Tell us what you ate and get personalized nutrition feedback
          </p>
        </div>

        {/* Meal Logging Form */}
        <MealLoggingForm userId={data.user.id} />
      </div>
    </div>
  )
}
