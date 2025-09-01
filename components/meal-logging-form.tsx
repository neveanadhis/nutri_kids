"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { generateNutritionFeedback } from "@/lib/nutrition-feedback"
import Link from "next/link"

interface MealLoggingFormProps {
  userId: string
}

export function MealLoggingForm({ userId }: MealLoggingFormProps) {
  const [mealDescription, setMealDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    message: string
    score: number
    tips: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealDescription.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Generate AI feedback (simulated)
      const nutritionFeedback = generateNutritionFeedback(mealDescription)

      // Save to database
      const supabase = createClient()
      const { error: dbError } = await supabase.from("meals").insert({
        user_id: userId,
        meal_description: mealDescription.trim(),
        ai_feedback: nutritionFeedback.message,
        nutrition_score: nutritionFeedback.score,
      })

      if (dbError) throw dbError

      setFeedback(nutritionFeedback)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log meal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogAnother = () => {
    setMealDescription("")
    setFeedback(null)
    setError(null)
  }

  if (feedback) {
    return (
      <Card className="bg-white shadow-xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">{feedback.score >= 4 ? "🌟" : feedback.score >= 3 ? "👍" : "💪"}</div>
          <CardTitle className="text-2xl text-green-600">Great job logging your meal!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nutrition Score */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">Nutrition Score</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl">
                  {star <= feedback.score ? "⭐" : "☆"}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600">{feedback.score}/5 stars</div>
          </div>

          {/* AI Feedback */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">🤖 Nutrition Assistant Says:</h3>
            <p className="text-blue-700">{feedback.message}</p>
          </div>

          {/* Tips */}
          {feedback.tips.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">💡 Tips for Next Time:</h3>
              <ul className="space-y-1">
                {feedback.tips.map((tip, index) => (
                  <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleLogAnother}
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
            >
              Log Another Meal 🍎
            </Button>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-2 border-green-300 hover:border-green-400 bg-transparent"
              >
                Back to Dashboard 🏠
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">What did you eat? 🤔</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meal-description" className="text-lg font-semibold text-gray-700">
              Describe your meal:
            </Label>
            <Textarea
              id="meal-description"
              placeholder="I had a turkey sandwich with lettuce and tomato, an apple, and a glass of milk..."
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              className="min-h-32 text-base resize-none"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500">{mealDescription.length}/500 characters</div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={!mealDescription.trim() || isLoading}
              className="flex-1 h-12 text-lg bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
            >
              {isLoading ? "Getting Feedback..." : "Get Nutrition Feedback! 🚀"}
            </Button>
            <Link href="/" className="flex-1">
              <Button type="button" variant="outline" className="w-full h-12 border-2 border-gray-300 bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Helpful Tips */}
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">💡 Tips for better feedback:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Be specific about portion sizes (e.g., "1 cup of rice", "2 slices of bread")</li>
            <li>• Include cooking methods (e.g., "grilled chicken", "steamed vegetables")</li>
            <li>• Mention drinks and snacks too!</li>
            <li>• Don't forget about sauces, dressings, or toppings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
