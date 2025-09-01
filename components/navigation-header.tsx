"use client"

import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Settings, LogOut, User } from "lucide-react"

interface UserData {
  user: any
  profile: any
  isPremium: boolean
}

export function NavigationHeader() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data?.user) {
          router.push("/auth/login")
          return
        }

        // Get user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

        // Get subscription status
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "active")
          .single()

        const isPremium = subscription && subscription.plan_id !== "free"

        setUserData({
          user: data.user,
          profile,
          isPremium,
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/nutrikids-logo.png" alt="NutriKids" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-semibold text-gray-900">NutriKids</span>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </header>
    )
  }

  if (!userData) {
    return null
  }

  const { user, profile, isPremium } = userData

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/nutrikids-logo.png" alt="NutriKids" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-semibold text-gray-900">NutriKids</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
            Home
          </Link>
          <Link href="/quiz" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
            Learn
          </Link>
          <Link href="/log-meal" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
            Track
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
            Rewards
          </Link>
          {!isPremium && (
            <Link
              href="/pricing"
              className="text-red-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1"
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold relative">
                {profile?.display_name?.charAt(0) || user.email?.charAt(0) || "U"}
                {isPremium && (
                  <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 bg-white rounded-full p-0.5" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              {isPremium ? (
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Billing & Subscription
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="flex items-center gap-2 text-red-600">
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
