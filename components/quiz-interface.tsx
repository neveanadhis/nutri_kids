"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"
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

interface QuizInterfaceProps {
  questions: Question[]
  userId: string
}

export function QuizInterface({ questions, userId }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const targetProgress = ((currentQuestionIndex + 1) / questions.length) * 100
    setProgress(targetProgress)
  }, [currentQuestionIndex, questions.length])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id]

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
    setShowAnswerFeedback(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinishQuiz()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setShowAnswerFeedback(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setShowAnswerFeedback(false)
    }
  }

  const handleFinishQuiz = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const attempts = questions.map((question) => ({
        user_id: userId,
        question_id: question.id,
        selected_answer: selectedAnswers[question.id],
        is_correct: selectedAnswers[question.id] === question.correct_answer,
      }))

      const { error } = await supabase.from("quiz_attempts").insert(attempts)

      if (error) throw error

      setShowResults(true)
    } catch (error) {
      console.error("Error saving quiz results:", error)
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (showResults) {
    const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correct_answer).length
    const score = Math.round((correctCount / questions.length) * 100)

    return (
      <QuizResults
        questions={questions}
        selectedAnswers={selectedAnswers}
        score={score}
        correctCount={correctCount}
        totalQuestions={questions.length}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-teal-600 text-balance">Nutrition Quiz! 🧠</h1>
        <p className="text-lg text-gray-600 text-pretty">Test your knowledge and learn something new</p>
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-teal-600">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3 bg-gray-200 transition-all duration-500 ease-out"
              style={{
                background: "linear-gradient(to right, #14b8a6, #06b6d4)",
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Just started! 🚀</span>
              <span>Almost done! 🎉</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="transform transition-all duration-300 ease-in-out">
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
          showFeedback={showAnswerFeedback}
        />
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="border-2 border-gray-300 hover:border-gray-400 bg-transparent disabled:opacity-50"
            >
              ← Previous
            </Button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? "bg-teal-500 scale-125"
                      : selectedAnswers[questions[index].id]
                        ? "bg-green-400"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!showAnswerFeedback || isLoading}
              className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isLastQuestion ? "Finish Quiz 🎯" : "Next →"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                Exit Quiz
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
