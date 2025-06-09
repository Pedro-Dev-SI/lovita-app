"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, Check, Star, X, ArrowRight, Clock, Music, Zap, ImageIcon } from "lucide-react"
import Link from "next/link"
import { DemoModeBanner } from "@/components/demo-mode-banner"
import { FAQSection } from "@/components/faq-section"
import { FloatingElements } from "@/components/floating-elements"
import { AnimatedHeart } from "@/components/animated-heart"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-poppins">

      <div className="container mx-auto px-4 pt-24">
        <DemoModeBanner />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center overflow-hidden">
        <FloatingElements />

        {/* Animated Hearts Background */}
        {Array.from({ length: 8 }).map((_, i) => (
          <AnimatedHeart key={i} size={16 + Math.random() * 8} delay={i * 0.5} duration={3 + Math.random() * 2} />
        ))}

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-20 bg-pink-100 text-pink-600 hover:bg-pink-100 px-6 py-3 rounded-full text-sm font-medium shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
              </motion.div>
              Crie sua página do amor
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gray-900">Uma página especial</span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              para o seu amor
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Criem juntos uma página única com contador de tempo, músicas especiais, galeria de memórias e muito mais.
            <motion.span
              animate={{ color: ["#6b7280", "#ec4899", "#6b7280"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {" "}
              Celebrem cada momento da jornada de vocês.
            </motion.span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="#plans">
                  <Heart className="w-5 h-5 mr-2 fill-white" />
                  Criar nossa página
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-pink-300 rounded-full px-8 py-4 text-lg font-medium transition-all duration-300"
              >
                <Link href="/example">Ver exemplo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 max-w-5xl mx-auto relative z-10"
        >
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-12 min-h-[400px] flex items-center justify-center relative overflow-hidden">
              {/* Floating hearts in preview */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(i) * 10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + i * 10}%`,
                  }}
                >
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                </motion.div>
              ))}

              <div className="text-center relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Heart className="w-12 h-12 text-white fill-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">João & Maria</h3>
                <p className="text-gray-600 mb-6">Juntos há 2 anos, 3 meses e 15 dias</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: "2", label: "Anos", color: "text-pink-600" },
                    { value: "3", label: "Meses", color: "text-purple-600" },
                    { value: "15", label: "Dias", color: "text-rose-600" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.2, type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                      className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                        className={`text-2xl font-bold ${item.color}`}
                      >
                        {item.value}
                      </motion.div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">Nossos Planos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para sua página personalizada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Forever Plan */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative bg-white rounded-2xl shadow-lg border-2 border-pink-500 overflow-hidden"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-bl-lg flex items-center gap-1"
              >
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-medium">Recomendado</span>
              </motion.div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-center mb-2 font-poppins">Para sempre</h3>
                <div className="text-center mb-6">
                  <div className="text-gray-500 line-through">R$ 54,00</div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                    className="text-3xl font-bold"
                  >
                    R$ 27,00 <span className="text-sm font-normal text-gray-500">/uma vez</span>
                  </motion.div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    { icon: Check, text: "Texto dedicado" },
                    { icon: Clock, text: "Contador em tempo real" },
                    { icon: Zap, text: "QR Code exclusivo" },
                    { icon: ImageIcon, text: "Máximo de 8 imagens" },
                    { icon: Music, text: "Com música" },
                    { icon: Sparkles, text: "Fundo dinâmico" },
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center"
                      >
                        <Icon className="w-5 h-5 text-green-500 mr-3" />
                        <span>{item.text}</span>
                      </motion.li>
                    )
                  })}
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/plans">Surpreenda agora</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Annual Plan */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-center mb-2 font-poppins">Anual</h3>
                <div className="text-center mb-6">
                  <div className="text-gray-500 line-through">R$ 34,00</div>
                  <div className="text-3xl font-bold">
                    R$ 17,00 <span className="text-sm font-normal text-gray-500">/por ano</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    { icon: Check, text: "Texto dedicado", enabled: true },
                    { icon: Clock, text: "Contador em tempo real", enabled: true },
                    { icon: Zap, text: "QR Code exclusivo", enabled: true },
                    { icon: ImageIcon, text: "Máximo de 4 imagens", enabled: true },
                    { icon: X, text: "Sem música", enabled: false },
                    { icon: X, text: "Sem fundo dinâmico", enabled: false },
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: item.enabled ? 5 : 0 }}
                        className="flex items-center"
                      >
                        <Icon className={`w-5 h-5 mr-3 ${item.enabled ? "text-green-500" : "text-red-500"}`} />
                        <span className={item.enabled ? "" : "text-gray-400"}>{item.text}</span>
                      </motion.li>
                    )
                  })}
                </ul>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/plans">Surpreenda agora</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">Tudo que vocês precisam</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades especiais para tornar sua página única e memorável
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⏰",
                title: "Contador de Tempo",
                description: "Acompanhem em tempo real há quanto tempo estão juntos",
              },
              {
                icon: "🎵",
                title: "Músicas Especiais",
                description: "Adicionem suas músicas favoritas com player integrado",
              },
              {
                icon: "📸",
                title: "Galeria de Memórias",
                description: "Guardem suas fotos e vídeos mais especiais",
              },
              {
                icon: "📱",
                title: "QR Code Único",
                description: "Compartilhem facilmente com um QR code personalizado",
              },
              {
                icon: "✨",
                title: "Animações Especiais",
                description: "Efeitos mágicos em datas comemorativas",
              },
              {
                icon: "📧",
                title: "Lembretes Automáticos",
                description: "Notificações por email em aniversários",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                className="text-center p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                  className="text-5xl mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-poppins group-hover:text-pink-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="text-xl font-bold font-poppins bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Lovita
            </span>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            </motion.div>
          </motion.div>
          <p className="text-gray-600">© 2025 Lovita. Feito com ❤️ para casais apaixonados.</p>
          <p className="text-gray-600">Desenvolvido por <a href="https://www.linkedin.com/in/pedro-selvate/" target="_blank" className="text-pink-500 hover:text-pink-600 transition-colors">Pedro Selvate</a></p>
        </div>
      </footer>
    </div>
  )
}
