"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Heart, AlertCircle, Sparkles, ArrowRight, X } from "lucide-react"

interface UserNotFoundModalProps {
  isOpen: boolean
  onClose: () => void
  onGoToPlans: () => void
  email: string
}

export function UserNotFoundModal({ isOpen, onClose, onGoToPlans, email }: UserNotFoundModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative">
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
                  <AlertCircle className="w-8 h-8 text-white" />
                </motion.div>

                <CardTitle className="text-2xl font-bold text-center text-white">Ops! Usuário não encontrado</CardTitle>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      O e-mail <strong className="text-gray-900">{email}</strong> não foi encontrado em nosso sistema ou
                      não possui um plano ativo.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      <span className="font-semibold text-gray-900">Que tal criar sua página do amor?</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Escolha um de nossos planos e comece a celebrar seu relacionamento de forma única!
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={onGoToPlans}
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-white" />
                    Ver Planos
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Tentar outro e-mail
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center pt-4 border-t border-gray-100"
                >
                  <p className="text-xs text-gray-500">Já tem uma conta? Verifique se digitou o e-mail corretamente</p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
