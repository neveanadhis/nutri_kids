import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentActivityProps {
  recentMeals: any[]
  recentBadges: any[]
}

export function RecentActivity({ recentMeals, recentBadges }: RecentActivityProps) {
  const hasActivity = recentMeals.length > 0 || recentBadges.length > 0

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 flex items-center gap-2">📈 Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasActivity ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🌱</div>
            <p>Start your nutrition journey by logging a meal or taking a quiz!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBadges.map((userBadge: any) => (
              <div key={userBadge.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl">{userBadge.badges.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800">Badge Earned!</div>
                  <div className="text-sm text-gray-600">{userBadge.badges.name}</div>
                </div>
              </div>
            ))}

            {recentMeals.map((meal: any) => (
              <div key={meal.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">🍽️</div>
                <div>
                  <div className="font-semibold text-gray-800">Meal Logged</div>
                  <div className="text-sm text-gray-600 truncate max-w-xs">{meal.meal_description}</div>
                  {meal.nutrition_score && (
                    <div className="text-xs text-green-600">Nutrition Score: {meal.nutrition_score}/5 ⭐</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
