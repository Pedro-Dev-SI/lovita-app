"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface FloatingHeartsProps {
  color: string
  count?: number
  size?: number
}

export function FloatingHearts({ color, count = 15, size = 24 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number; size: number }>>([])

  useEffect(() => {
    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.max(size * 0.5, Math.random() * size * 1.5),
    }))
    setHearts(newHearts)
  }, [count, size])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: `${heart.x}%` }}
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: [0, -Math.random() * 300 - 100],
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1, 0.8],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            delay: heart.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 5,
            ease: "easeOut",
          }}
        >
          <Heart
            size={heart.size}
            className="fill-current"
            style={{ color: color || "#ff6b81", filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))" }}
          />
        </motion.div>
      ))}
    </div>
  )
}
