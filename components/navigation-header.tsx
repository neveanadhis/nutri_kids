import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function NavigationHeader() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

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
        </nav>

        {/* User Avatar */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
            {profile?.display_name?.charAt(0) || data.user.email?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  )
}
