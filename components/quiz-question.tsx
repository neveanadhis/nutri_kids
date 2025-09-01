"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

interface QuizQuestionProps {
  question: Question
  selectedAnswer?: string
  onAnswerSelect: (questionId: string, answer: string) => void
  questionNumber: number
}

export function QuizQuestion({ question, selectedAnswer, onAnswerSelect, questionNumber }: QuizQuestionProps) {
  const options = [
    { key: "A", text: question.option_a },
    { key: "B", text: question.option_b },
    { key: "C", text: question.option_c },
    { key: "D", text: question.option_d },
  ]

  const getDifficultyEmoji = (level: number) => {
    switch (level) {
      case 1:
        return "🟢"
      case 2:
        return "🟡"
      case 3:
        return "🔴"
      default:
        return "🟢"
    }
  }

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1:
        return "Easy"
      case 2:
        return "Medium"
      case 3:
        return "Hard"
      default:
        return "Easy"
    }
  }

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
              Question {questionNumber}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              {getDifficultyEmoji(question.difficulty_level)} {getDifficultyText(question.difficulty_level)}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl text-gray-800 text-balance leading-relaxed">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <Button
            key={option.key}
            variant="outline"
            onClick={() => onAnswerSelect(question.id, option.key)}
            className={`w-full p-4 h-auto text-left justify-start transition-all duration-200 ${
              selectedAnswer === option.key
                ? "border-2 border-teal-500 bg-teal-50 text-teal-800 shadow-md transform scale-[1.02]"
                : "border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-start gap-3 w-full">
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  selectedAnswer === option.key
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-teal-100"
                }`}
              >
                {option.key}
              </span>
              <span className="text-base text-pretty leading-relaxed">{option.text}</span>
            </div>
          </Button>
        ))}

        {/* Helpful hint */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            💡 <span className="font-medium">Tip:</span> Take your time and think about what you've learned about
            nutrition!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
