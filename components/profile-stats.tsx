import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProfileStatsProps {
  stats: {
    mealsLogged: number
    correctAnswers: number
    totalQuestions: number
    quizAccuracy: number
    badgesEarned: number
  }
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const achievements = [
    {
      title: "Meals Logged",
      value: stats.mealsLogged,
      icon: "🍎",
      color: "from-green-400 to-green-500",
      target: 50,
    },
    {
      title: "Quiz Accuracy",
      value: stats.quizAccuracy,
      icon: "🎯",
      color: "from-blue-400 to-blue-500",
      target: 100,
      suffix: "%",
    },
    {
      title: "Correct Answers",
      value: stats.correctAnswers,
      icon: "✅",
      color: "from-teal-400 to-teal-500",
      target: 100,
    },
    {
      title: "Badges Earned",
      value: stats.badgesEarned,
      icon: "🏆",
      color: "from-yellow-400 to-yellow-500",
      target: 10,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {achievements.map((achievement) => (
        <Card key={achievement.title} className="bg-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <span>{achievement.icon}</span>
              {achievement.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-gray-800">
              {achievement.value}
              {achievement.suffix || ""}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>
                  {achievement.value}/{achievement.target}
                </span>
              </div>
              <Progress value={Math.min((achievement.value / achievement.target) * 100, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
