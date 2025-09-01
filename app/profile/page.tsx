import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileHeader } from "@/components/profile-header"
import { BadgeCollection } from "@/components/badge-collection"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileEdit } from "@/components/profile-edit"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user badges
  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", data.user.id)
    .order("earned_at", { ascending: false })

  // Get all available badges
  const { data: allBadges } = await supabase.from("badges").select("*").order("requirement_value", { ascending: true })

  // Get user stats
  const { data: meals } = await supabase.from("meals").select("*").eq("user_id", data.user.id)

  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("is_correct", true)

  const { data: totalQuizAttempts } = await supabase.from("quiz_attempts").select("*").eq("user_id", data.user.id)

  const stats = {
    mealsLogged: meals?.length || 0,
    correctAnswers: quizAttempts?.length || 0,
    totalQuestions: totalQuizAttempts?.length || 0,
    quizAccuracy: totalQuizAttempts?.length
      ? Math.round(((quizAttempts?.length || 0) / totalQuizAttempts.length) * 100)
      : 0,
    badgesEarned: userBadges?.length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-purple-600 text-balance">Your Profile 👤</h1>
          <p className="text-lg text-gray-600 text-pretty">Track your progress and show off your achievements!</p>
        </div>

        {/* Profile Header */}
        <ProfileHeader profile={profile} user={data.user} />

        {/* Profile Stats */}
        <ProfileStats stats={stats} />

        {/* Badge Collection */}
        <BadgeCollection userBadges={userBadges || []} allBadges={allBadges || []} stats={stats} />

        {/* Profile Edit */}
        <ProfileEdit profile={profile} userId={data.user.id} />
      </div>
    </div>
  )
}
