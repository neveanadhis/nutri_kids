import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizInterface } from "@/components/quiz-interface"

export default async function QuizPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get quiz questions
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .order("difficulty_level", { ascending: true })
    .limit(5) // 5 questions per quiz

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Quiz Questions Available</h1>
          <p className="text-gray-600">Please check back later!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <QuizInterface questions={questions} userId={data.user.id} />
      </div>
    </div>
  )
}
