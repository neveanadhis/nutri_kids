import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 text-balance">Welcome back, {displayName}! 👋</h1>
          <p className="text-lg text-gray-600 text-pretty">Ready to make today another healthy one?</p>

          <div className="pt-2">
            <a
              href="/log-meal"
              className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              🍽️ Log Today's Meal
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Today's Feedback */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Feedback</h2>
            <div className="bg-gray-50 rounded-xl p-6 flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Great job, {displayName}! 😊</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You've logged your breakfast and lunch. Keep up the healthy choices! 🥗 Remember to add your dinner
                  later.
                </p>
              </div>
              <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center text-3xl">🥦</div>
            </div>
          </div>

          {/* Your Progress */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Nutrition Quiz</span>
                  <span className="text-sm text-gray-500">
                    {correctAnswers}/{Math.max(totalQuestions, 4)} quizzes completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min((correctAnswers / Math.max(totalQuestions, 4)) * 100, 75)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Badges Earned 🏆</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">🥬</div>
              <p className="text-xs font-medium text-gray-700">Veggie Victor</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">🍎</div>
              <p className="text-xs font-medium text-gray-700">Fruit Fanatic</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">💧</div>
              <p className="text-xs font-medium text-gray-700">Hydration Hero</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">🔒</div>
              <p className="text-xs font-medium text-gray-500">Breakfast Champ</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">🔒</div>
              <p className="text-xs font-medium text-gray-500">Balanced Plate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
