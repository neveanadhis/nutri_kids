import { createServerClient } from "@supabase/ssr"

/**
 * Server client that doesn't use cookies - for use in API routes or
 * when cookies are not available
 */
export function createServerClientWithoutCookies() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op
      },
    },
  })
}
