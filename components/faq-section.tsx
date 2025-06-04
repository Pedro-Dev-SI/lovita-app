"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const faqs = [
  {
    question: "Como funciona o Lovita?",
    answer:
      "O Lovita permite que casais criem uma página personalizada com contador de tempo juntos, galeria de memórias, músicas especiais e muito mais. Basta escolher um plano, criar sua conta e personalizar sua página do amor.",
  },
  {
    question: "Qual a diferença entre os planos?",
    answer:
      "O plano 'Para Sempre' oferece recursos completos como até 8 imagens, música, fundo dinâmico e animações exclusivas por um pagamento único. O plano 'Anual' tem recursos básicos como até 4 imagens e renovação anual.",
  },
  {
    question: "Posso compartilhar minha página?",
    answer:
      "Sim! Cada página tem um QR code exclusivo e URL personalizada que vocês podem compartilhar com amigos e família. A página fica sempre disponível online.",
  },
  {
    question: "Como adiciono músicas na página?",
    answer:
      "No plano 'Para Sempre', você pode adicionar links do Spotify ou YouTube das suas músicas favoritas. Elas aparecerão com player integrado na sua página.",
  },
  {
    question: "As notificações funcionam automaticamente?",
    answer:
      "Sim! O sistema envia automaticamente lembretes por email nos seus mêsversários e aniversários de namoro, para que vocês nunca esqueçam das datas especiais.",
  },
  {
    question: "Posso editar minha página depois de criada?",
    answer:
      "Claro! Você pode editar informações, adicionar novas memórias, trocar músicas e personalizar sua página sempre que quiser através do painel de controle.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Totalmente! Utilizamos criptografia de ponta e hospedagem segura. Suas informações pessoais e memórias ficam protegidas e privadas.",
  },
  {
    question: "Como funciona o suporte?",
    answer:
      "Oferecemos suporte 24 horas por email. Nossa equipe está sempre pronta para ajudar com qualquer dúvida ou problema que você possa ter.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h2 className="text-4xl font-bold font-poppins bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Perguntas Frequentes
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre o Lovita e descubra como criar a página perfeita para seu amor
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0 pb-6 px-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
