import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressOverviewProps {
  correctAnswers: number
  totalQuestions: number
  recentMeals: any[]
}

export function ProgressOverview({ correctAnswers, totalQuestions, recentMeals }: ProgressOverviewProps) {
  const progressPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  const mealsThisWeek = recentMeals.length
  const weeklyGoal = 7 // 1 meal per day
  const mealProgress = Math.min((mealsThisWeek / weeklyGoal) * 100, 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">🎯 Quiz Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Correct Answers</span>
              <span>
                {correctAnswers}/{totalQuestions}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
          <p className="text-sm text-gray-600">
            {totalQuestions === 0
              ? "Take your first quiz to see your progress!"
              : `Great job! You've answered ${correctAnswers} questions correctly.`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">🍎 Weekly Meals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>This Week</span>
              <span>
                {mealsThisWeek}/{weeklyGoal}
              </span>
            </div>
            <Progress value={mealProgress} className="h-3" />
          </div>
          <p className="text-sm text-gray-600">
            {mealsThisWeek === 0
              ? "Log your first meal to start tracking!"
              : `You've logged ${mealsThisWeek} meal${mealsThisWeek === 1 ? "" : "s"} this week.`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
