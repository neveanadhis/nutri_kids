import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { ProgressOverview } from "@/components/progress-overview"

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user stats
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*, quiz_questions(*)")
    .eq("user_id", data.user.id)

  const { data: userBadges } = await supabase.from("user_badges").select("*, badges(*)").eq("user_id", data.user.id)

  const displayName = profile?.display_name || "Student"
  const mealsCount = meals?.length || 0
  const correctAnswers = quizAttempts?.filter((attempt) => attempt.is_correct).length || 0
  const totalQuestions = quizAttempts?.length || 0
  const badgesCount = userBadges?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-green-600 text-balance">Welcome back, {displayName}! 🌟</h1>
          <p className="text-lg text-gray-600 text-pretty">Ready to learn about nutrition and eat healthy today?</p>
        </div>

        {/* Stats Overview */}
        <DashboardStats
          mealsLogged={mealsCount}
          quizScore={totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}
          badgesEarned={badgesCount}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Progress Overview */}
        <ProgressOverview
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          recentMeals={meals?.slice(0, 3) || []}
        />

        {/* Recent Activity */}
        <RecentActivity recentMeals={meals?.slice(0, 2) || []} recentBadges={userBadges?.slice(0, 2) || []} />
      </div>
    </div>
  )
}
