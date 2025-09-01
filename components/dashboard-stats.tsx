import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  mealsLogged: number
  quizScore: number
  badgesEarned: number
}

export function DashboardStats({ mealsLogged, quizScore, badgesEarned }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-blue-400 to-blue-500 border-0 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{mealsLogged}</div>
          <div className="text-blue-100">Meals Logged 🍎</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-400 to-green-500 border-0 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{quizScore}%</div>
          <div className="text-green-100">Quiz Score 🧠</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-400 to-purple-500 border-0 text-white">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{badgesEarned}</div>
          <div className="text-purple-100">Badges Earned 🏆</div>
        </CardContent>
      </Card>
    </div>
  )
}
