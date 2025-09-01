import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardStats from "@/components/dashboard-stats"
import QuickActions from "@/components/quick-actions"
import ProgressOverview from "@/components/progress-overview"
import RecentActivity from "@/components/recent-activity"
import { SubscriptionStatus } from "@/components/subscription-status"

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const dummyProgressData = {
    correctAnswers: 0,
    totalQuestions: 0,
    recentMeals: [],
  }

  const dummyRecentActivityData = {
    recentMeals: [],
    recentBadges: [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Welcome to NutriKids! 🌟</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your fun journey to healthy eating starts here! Track your meals, take quizzes, and earn awesome badges! 🏆
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <SubscriptionStatus />
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Progress and Activity Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ProgressOverview {...dummyProgressData} />
          <RecentActivity {...dummyRecentActivityData} />
        </div>
      </div>
    </div>
  )
}
