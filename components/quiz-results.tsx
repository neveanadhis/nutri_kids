"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation: string
  difficulty_level: number
}

interface QuizResultsProps {
  questions: Question[]
  selectedAnswers: Record<string, string>
  score: number
  correctCount: number
  totalQuestions: number
}

export function QuizResults({ questions, selectedAnswers, score, correctCount, totalQuestions }: QuizResultsProps) {
  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🏆"
    if (score >= 80) return "🌟"
    if (score >= 70) return "👍"
    if (score >= 60) return "💪"
    return "📚"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're a nutrition expert!"
    if (score >= 80) return "Excellent work! You know your nutrition facts!"
    if (score >= 70) return "Great job! You're learning well!"
    if (score >= 60) return "Good effort! Keep studying and you'll improve!"
    return "Keep learning! Every quiz makes you smarter!"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-500"
    if (score >= 60) return "from-yellow-400 to-yellow-500"
    return "from-orange-400 to-orange-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4">{getScoreEmoji(score)}</div>
        <h1 className="text-4xl font-bold text-teal-600 text-balance">Quiz Complete!</h1>
        <p className="text-lg text-gray-600 text-pretty">{getScoreMessage(score)}</p>
      </div>

      {/* Score Card */}
      <Card className={`bg-gradient-to-r ${getScoreColor(score)} text-white shadow-xl`}>
        <CardContent className="p-8 text-center">
          <div className="text-5xl font-bold mb-2">{score}%</div>
          <div className="text-xl mb-4">
            {correctCount} out of {totalQuestions} correct
          </div>
          <Progress
            value={score}
            className="h-4 bg-white/20 transition-all duration-1000 ease-out"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">📝 Review Your Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id]
            const isCorrect = userAnswer === question.correct_answer
            const options = {
              A: question.option_a,
              B: question.option_b,
              C: question.option_c,
              D: question.option_d,
            }

            return (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2 text-balance">{question.question}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Your answer:</span>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userAnswer}: {options[userAnswer as keyof typeof options]}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Correct answer:</span>
                          <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                            {question.correct_answer}: {options[question.correct_answer as keyof typeof options]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <span className="font-medium">💡 Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/quiz" className="flex-1">
          <Button
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
          >
            Take Another Quiz 🎯
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg border-2 border-gray-300 hover:border-gray-400 bg-transparent"
          >
            Back to Dashboard 🏠
          </Button>
        </Link>
      </div>
    </div>
  )
}
