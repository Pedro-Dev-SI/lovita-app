"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, Mail, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { UserNotFoundModal } from "@/components/user-not-found-modal"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams?.get("plan")

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Check if user has a subscription plan
        const { data: userData } = await supabase.from("users").select("subscription_plan").eq("id", user.id).single()

        if (userData?.subscription_plan === "none") {
          // If user has no plan, redirect to plans page
          router.push("/plans")
        } else {
          // If user has a plan, redirect to dashboard
          router.push("/dashboard")
        }
      }
    }
    checkUser()
  }, [router])

  const checkUserExists = async (email: string) => {
    try {
      // First check if user exists in our users table

      const dataTeste = await supabase
        .from("users")
        .select("id, email, subscription_plan, subscription_end_date")
        .eq("email", email)
        .single()

      console.log(dataTeste)

      const { data: userData, error } = await supabase
        .from("users")
        .select("id, email, subscription_plan, subscription_end_date")
        .eq("email", email)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error, other errors should be thrown
        throw error
      }

      if (!userData) {
        // User doesn't exist in our system
        return { exists: false, hasActivePlan: false }
      }

      // Check if user has an active plan
      const hasActivePlan =
        userData.subscription_plan !== "none" &&
        (userData.subscription_plan === "forever" ||
          (userData.subscription_end_date && new Date(userData.subscription_end_date) > new Date()))

      return {
        exists: true,
        hasActivePlan,
        userData,
      }
    } catch (error) {
      console.error("Error checking user:", error)
      return { exists: false, hasActivePlan: false }
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if user exists and has active plan
      const { exists, hasActivePlan } = await checkUserExists(email)

      if (!exists || !hasActivePlan) {
        // Show modal for user not found or no active plan
        setShowUserNotFoundModal(true)
        setLoading(false)
        return
      }

      // User exists and has active plan, proceed with magic link
      const redirectTo = plan
        ? `${window.location.origin}/auth/callback?plan=${plan}`
        : `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      })

      if (error) throw error

      setEmailSent(true)
      toast({
        title: "Link mágico enviado!",
        description: "Verifique seu e-mail para fazer login.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowUserNotFoundModal(false)
  }

  const handleGoToPlans = () => {
    setShowUserNotFoundModal(false)
    // Scroll to plans section on homepage
    router.push("/#plans")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {emailSent ? "Verifique seu e-mail" : "Acesse sua conta"}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {emailSent
                  ? "Enviamos um link mágico para seu e-mail. Clique no link para fazer login."
                  : "Entre com seu e-mail para acessar sua página do amor"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {!emailSent ? (
                <form onSubmit={handleMagicLink} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Mail className="w-5 h-5 mr-2" />
                    )}
                    {loading ? "Verificando..." : "Enviar link mágico"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Mail className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Enviamos um link para <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Não recebeu? Verifique sua caixa de spam ou tente novamente.
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setEmailSent(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Tentar com outro e-mail
                  </Button>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Ao continuar, você concorda com nossos{" "}
                  <Link href="/terms" className="text-pink-600 hover:text-pink-700 underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Not Found Modal */}
      <UserNotFoundModal
        isOpen={showUserNotFoundModal}
        onClose={handleModalClose}
        onGoToPlans={handleGoToPlans}
        email={email}
      />
    </div>
  )
}
