import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-800">What would you like to do today? 🚀</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/log-meal">
            <Button
              size="lg"
              className="w-full h-20 text-lg bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 shadow-lg"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🍽️</div>
                <div>Log a Meal</div>
              </div>
            </Button>
          </Link>

          <Link href="/quiz">
            <Button
              size="lg"
              className="w-full h-20 text-lg bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white border-0 shadow-lg"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div>Take Quiz</div>
              </div>
            </Button>
          </Link>
        </div>

        <Link href="/profile">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 text-lg border-2 border-gray-300 hover:border-gray-400 bg-transparent"
          >
            <div className="text-center">
              <div className="text-xl mb-1">👤</div>
              <div>View Profile & Badges</div>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
