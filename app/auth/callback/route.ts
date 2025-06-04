import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const plan = requestUrl.searchParams.get("plan")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user has a plan
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: userData } = await supabase.from("users").select("subscription_plan").eq("id", user.id).single()

      // If plan parameter exists and user has no plan, update user's plan
      if (plan && userData?.subscription_plan === "none") {
        await supabase
          .from("users")
          .update({
            subscription_plan: plan,
            subscription_start_date: new Date().toISOString(),
            subscription_end_date:
              plan === "annual" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
            max_images: plan === "forever" ? 8 : 4,
            has_music: plan === "forever",
            has_dynamic_background: plan === "forever",
            has_exclusive_animations: plan === "forever",
          })
          .eq("id", user.id)

        // Redirect to create page
        return NextResponse.redirect(new URL("/create", requestUrl.origin))
      }

      // If user has no plan, redirect to plans page
      if (userData?.subscription_plan === "none") {
        return NextResponse.redirect(new URL("/plans", requestUrl.origin))
      }

      // If user has a plan, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    }
  }

  // Default redirect
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
