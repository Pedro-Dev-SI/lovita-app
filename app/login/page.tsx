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
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
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

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Determine redirect URL based on whether a plan was selected
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {emailSent ? "Verifique seu e-mail" : "Acesse sua conta"}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {emailSent
                  ? "Enviamos um link mágico para seu e-mail. Clique no link para fazer login."
                  : "Entre com seu e-mail para acessar ou criar sua página do amor"}
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
                      "Enviando..."
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Enviar link mágico
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-10 h-10 text-green-600" />
                  </div>

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
    </div>
  )
}
