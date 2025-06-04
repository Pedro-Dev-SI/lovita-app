"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles, Star } from "lucide-react"

export function FloatingElements() {
  const elements = [
    { Icon: Heart, color: "text-pink-500", size: 16 },
    { Icon: Sparkles, color: "text-purple-500", size: 14 },
    { Icon: Star, color: "text-rose-500", size: 12 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => {
        const Element = elements[i % elements.length]
        const Icon = Element.Icon

        return (
          <motion.div
            key={i}
            className={`absolute ${Element.color} opacity-20`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={Element.size} className="fill-current" />
          </motion.div>
        )
      })}
    </div>
  )
}
