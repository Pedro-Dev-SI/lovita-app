"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Heart, X, CreditCard, Sparkles } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, plan: "forever" | "annual") => void
  selectedPlan: "forever" | "annual" | null
  initialEmail?: string
}

export function CheckoutModal({ isOpen, onClose, onSubmit, selectedPlan, initialEmail = "" }: CheckoutModalProps) {
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)

  const planDetails = {
    forever: {
      name: "Para Sempre",
      price: "R$ 27,00",
      originalPrice: "R$ 54,00",
      unit: "uma vez",
      color: "from-pink-500 to-purple-600",
    },
    annual: {
      name: "Anual",
      price: "R$ 17,00",
      originalPrice: "R$ 34,00",
      unit: "por ano",
      color: "from-gray-700 to-gray-900",
    },
  }

  const currentPlan = selectedPlan ? planDetails[selectedPlan] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan || !email) return

    setLoading(true)
    try {
      await onSubmit(email, selectedPlan)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && currentPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${currentPlan.color} p-6 text-white relative`}>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>

                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CreditCard className="w-8 h-8 text-white" />
                </motion.div>

                <CardTitle className="text-2xl font-bold text-center text-white mb-2">
                  Plano {currentPlan.name}
                </CardTitle>
                <div className="text-center">
                  <div className="text-white/70 line-through text-sm">{currentPlan.originalPrice}</div>
                  <div className="text-3xl font-bold">
                    {currentPlan.price}
                    <span className="text-lg font-normal text-white/80">/{currentPlan.unit}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      <span className="font-semibold text-gray-900">Quase lá!</span>
                    </div>
                    <p className="text-sm text-gray-600">Digite seu e-mail para continuar com o pagamento</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkout-email" className="text-gray-700 font-medium">
                        E-mail
                      </Label>
                      <Input
                        id="checkout-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        disabled={loading || !email}
                        className={`w-full h-12 bg-gradient-to-r ${currentPlan.color} hover:opacity-90 text-white font-medium`}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <Heart className="w-5 h-5 mr-2 fill-white" />
                        )}
                        {loading ? "Processando..." : "Continuar para pagamento"}
                      </Button>
                    </motion.div>
                  </form>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Pagamento seguro processado via Stripe</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
