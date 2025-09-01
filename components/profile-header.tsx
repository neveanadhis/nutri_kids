import { Card, CardContent } from "@/components/ui/card"

interface ProfileHeaderProps {
  profile: any
  user: any
}

export function ProfileHeader({ profile, user }: ProfileHeaderProps) {
  const displayName = profile?.display_name || "Student"
  const age = profile?.age
  const grade = profile?.grade
  const joinDate = new Date(user.created_at).toLocaleDateString()

  const getAvatarEmoji = (name: string) => {
    const emojis = ["🧑‍🎓", "👩‍🎓", "👨‍🎓", "🧑‍🍳", "👩‍🍳", "👨‍🍳"]
    const index = name.length % emojis.length
    return emojis[index]
  }

  return (
    <Card className="bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-xl">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-6xl">{getAvatarEmoji(displayName)}</div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-2">{displayName}</h2>
            <div className="space-y-1 text-purple-100">
              {age && <p>Age: {age} years old</p>}
              {grade && <p>Grade: {grade}</p>}
              <p>Member since: {joinDate}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">🌟</div>
            <div className="text-sm text-purple-100">Nutrition Explorer</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
