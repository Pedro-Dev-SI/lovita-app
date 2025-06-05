"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { CSSProperties } from "react"

interface FloatingStarsProps {
  count?: number
  color?: string
}

export function FloatingStars({ count = 20, color = "#fbbf24" }: FloatingStarsProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100
        const top = Math.random() * 100
        const duration = 6 + Math.random() * 8
        const delay = Math.random() * 4
        const size = 12 + Math.random() * 10
        const style: CSSProperties = {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          position: "absolute",
        }
        return (
          <motion.span
            key={i}
            style={style}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, -60 - Math.random() * 40, 0] }}
            transition={{ duration, delay, repeat: Infinity }}
          >
            <Star className="drop-shadow-lg" color={color} fill={color} />
          </motion.span>
        )
      })}
    </div>
  )
} 