"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useSubscription } from "@/hooks/use-subscription"
import { Crown, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DashboardStatsProps {
  mealsLogged?: number
  quizScore?: number
  badgesEarned?: number
}

export default function DashboardStats({ mealsLogged = 0, quizScore = 0, badgesEarned = 0 }: DashboardStatsProps) {
  const { usage, isPremium, isLoading } = useSubscription()
  const [todayStats, setTodayStats] = useState({ meals: 0, quizzes: 0 })
  const router = useRouter()

  useEffect(() => {
    if (usage) {
      setTodayStats({
        meals: usage.meal_logs,
        quizzes: usage.quiz_attempts,
      })
    }
  }, [usage])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-blue-400 to-blue-500 border-0 text-white relative">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{todayStats.meals}</div>
          <div className="text-blue-100">Meals Today 🍎</div>
          {!isPremium && (
            <div className="absolute top-2 right-2">
              <Lock className="h-4 w-4 text-blue-200" />
            </div>
          )}
          {isPremium && (
            <div className="absolute top-2 right-2">
              <Crown className="h-4 w-4 text-yellow-300" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-400 to-green-500 border-0 text-white relative">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{todayStats.quizzes}</div>
          <div className="text-green-100">Quizzes Today 🧠</div>
          {!isPremium && (
            <div className="absolute top-2 right-2">
              <Lock className="h-4 w-4 text-green-200" />
            </div>
          )}
          {isPremium && (
            <div className="absolute top-2 right-2">
              <Crown className="h-4 w-4 text-yellow-300" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-400 to-purple-500 border-0 text-white relative">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">{badgesEarned}</div>
          <div className="text-purple-100">Badges Earned 🏆</div>
          {!isPremium && (
            <Button
              onClick={() => router.push("/pricing")}
              size="sm"
              className="mt-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Unlock More
            </Button>
          )}
          {isPremium && (
            <div className="absolute top-2 right-2">
              <Crown className="h-4 w-4 text-yellow-300" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
