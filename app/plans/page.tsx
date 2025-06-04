"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Star, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { CheckoutModal } from "@/components/checkout-modal"

export default function PlansPage() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    forever: false,
    annual: false,
  })
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"forever" | "annual" | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  const handleSelectPlan = async (plan: "forever" | "annual") => {
    setLoading({ ...loading, [plan]: true })

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // If not logged in, show checkout modal to collect email
        setSelectedPlan(plan)
        setShowCheckoutModal(true)
        setLoading({ ...loading, [plan]: false })
        return
      }

      // Check if user exists in our system
      const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (userData) {
        // User exists, update subscription plan
        const { error } = await supabase
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

        if (error) throw error

        toast({
          title: "Plano selecionado com sucesso!",
          description: "Agora você pode criar sua página do amor.",
        })

        // Redirect to create page
        router.push("/create")
      } else {
        // User authenticated but not in our system, show checkout modal
        setSelectedPlan(plan)
        setUserEmail(user.email || "")
        setShowCheckoutModal(true)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao selecionar plano",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading({ ...loading, [plan]: false })
    }
  }

  const handleCheckoutSubmit = async (email: string, plan: "forever" | "annual") => {
    try {
      // Check if user exists in our system
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, email, subscription_plan")
        .eq("email", email)
        .single()

      if (existingUser) {
        // User exists, proceed with plan update (this would be handled by Stripe webhook in production)
        toast({
          title: "Usuário encontrado!",
          description: "Redirecionando para o pagamento...",
        })

        // Here we would redirect to Stripe checkout
        // For now, we'll simulate the process
        console.log("Redirecting to Stripe for existing user:", email, plan)
      } else {
        // New user, create auth user first then proceed with payment
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?plan=${plan}`,
          },
        })

        if (error) throw error

        toast({
          title: "Link de verificação enviado!",
          description: "Verifique seu e-mail para continuar com o pagamento.",
        })
      }

      setShowCheckoutModal(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const plans = [
    {
      id: "forever",
      name: "Para sempre",
      originalPrice: "R$ 54,00",
      price: "R$ 27,00",
      unit: "/uma vez",
      recommended: true,
      features: [
        { name: "Texto dedicado", included: true },
        { name: "Contador em tempo real", included: true },
        { name: "Data de início", included: true },
        { name: "QR Code exclusivo", included: true },
        { name: "Máximo de 8 imagens", included: true },
        { name: "Com música", included: true },
        { name: "Fundo dinâmico", included: true },
        { name: "Com animações exclusivas", included: true },
        { name: "URL personalizada", included: true },
        { name: "Suporte 24 horas", included: true },
      ],
    },
    {
      id: "annual",
      name: "Anual",
      originalPrice: "R$ 34,00",
      price: "R$ 17,00",
      unit: "/por ano",
      recommended: false,
      features: [
        { name: "Texto dedicado", included: true },
        { name: "Contador em tempo real", included: true },
        { name: "Data de início", included: true },
        { name: "QR Code exclusivo", included: true },
        { name: "Máximo de 4 imagens", included: true },
        { name: "Com música", included: false },
        { name: "Fundo dinâmico", included: false },
        { name: "Com animações exclusivas", included: false },
        { name: "URL personalizada", included: true },
        { name: "Suporte 24 horas", included: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Nossos Planos
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Escolha o plano ideal para sua página personalizada. Você pode escolher entre os planos abaixo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 ${
                plan.recommended ? "border-pink-500" : "border-gray-200"
              } shadow-lg`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-medium">Recomendado</span>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-center mb-6">
                  <div className="text-gray-500 line-through text-lg">{plan.originalPrice}</div>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.unit}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id as "forever" | "annual")}
                  disabled={loading[plan.id]}
                  className={`w-full py-6 text-lg ${
                    plan.recommended
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      : "bg-gray-800 hover:bg-gray-900"
                  } text-white`}
                >
                  {loading[plan.id] ? (
                    "Processando..."
                  ) : (
                    <>
                      Surpreenda agora
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSubmit={handleCheckoutSubmit}
        selectedPlan={selectedPlan}
        initialEmail={userEmail}
      />
    </div>
  )
}
