import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement_type: string
  requirement_value: number
}

interface UserBadge {
  id: string
  badge_id: string
  earned_at: string
  badges: Badge
}

interface BadgeCollectionProps {
  userBadges: UserBadge[]
  allBadges: Badge[]
  stats: {
    mealsLogged: number
    correctAnswers: number
    totalQuestions: number
    quizAccuracy: number
    badgesEarned: number
  }
}

export function BadgeCollection({ userBadges, allBadges, stats }: BadgeCollectionProps) {
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge_id))

  const getProgressTowardsBadge = (badge: Badge) => {
    let current = 0
    const target = badge.requirement_value

    switch (badge.requirement_type) {
      case "meals_logged":
        current = stats.mealsLogged
        break
      case "quiz_score":
        current = stats.quizAccuracy
        break
      case "quiz_correct":
        current = stats.correctAnswers
        break
      case "streak_days":
        current = 0 // Would need to implement streak tracking
        break
      default:
        current = 0
    }

    return { current, target, percentage: Math.min((current / target) * 100, 100) }
  }

  const earnedBadges = allBadges.filter((badge) => earnedBadgeIds.has(badge.id))
  const availableBadges = allBadges.filter((badge) => !earnedBadgeIds.has(badge.id))

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            🏆 Your Badges ({earnedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>No badges earned yet. Keep learning to earn your first badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => {
                const userBadge = userBadges.find((ub) => ub.badge_id === badge.id)
                const earnedDate = userBadge ? new Date(userBadge.earned_at).toLocaleDateString() : ""

                return (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-lg border-2 border-yellow-300 shadow-md"
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{badge.icon}</div>
                      <h3 className="font-bold text-yellow-800">{badge.name}</h3>
                      <p className="text-sm text-yellow-700">{badge.description}</p>
                      <p className="text-xs text-yellow-600">Earned: {earnedDate}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            🎯 Badges to Earn ({availableBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBadges.map((badge) => {
              const progress = getProgressTowardsBadge(badge)

              return (
                <div
                  key={badge.id}
                  className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-center space-y-3">
                    <div className="text-3xl opacity-50">{badge.icon}</div>
                    <h3 className="font-bold text-gray-700">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progress</span>
                        <span>
                          {progress.current}/{progress.target}
                        </span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {progress.percentage >= 100
                          ? "Ready to claim!"
                          : `${Math.round(progress.percentage)}% complete`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
