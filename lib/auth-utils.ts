export function getAuthRedirectUrl(): string {
  // In production, use the production URL
  if (process.env.NODE_ENV === "production") {
    // Try to get the production URL from environment variable first
    const productionUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (productionUrl) {
      return productionUrl
    }

    // Fallback to window.location.origin if available (client-side)
    if (typeof window !== "undefined") {
      return window.location.origin
    }

    // If we can't determine the URL, return a placeholder
    // This should be replaced with your actual production URL
    return "https://your-app-domain.vercel.app"
  }

  // In development, use the dev URL or localhost
  return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"
}
