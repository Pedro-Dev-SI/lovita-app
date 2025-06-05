"use client"

import { motion } from "framer-motion"
import type { CSSProperties } from "react"

interface FloatingDucksProps {
  count?: number
}

export function FloatingDucks({ count = 10 }: FloatingDucksProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100
        const top = Math.random() * 80 + 10 // evitar topo/rodapé
        const duration = 10 + Math.random() * 8
        const delay = Math.random() * 5
        const size = 40 + Math.random() * 24
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
            animate={{ opacity: [0, 1, 0.8, 1], y: [0, -30 - Math.random() * 30, 0] }}
            transition={{ duration, delay, repeat: Infinity }}
          >
            <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="32" cy="40" rx="18" ry="6" fill="#FDE68A" opacity="0.3" />
              <path d="M16 32c0-8 8-16 16-16s16 8 16 16-8 8-16 8-16 0-16-8z" fill="#FFE066" />
              <circle cx="44" cy="24" r="8" fill="#FFE066" />
              <ellipse cx="47" cy="22" rx="2" ry="1" fill="#F59E42" />
              <ellipse cx="40" cy="22" rx="1.5" ry="1" fill="#fff" />
              <ellipse cx="40.5" cy="22" rx="0.5" ry="0.5" fill="#222" />
              <path d="M52 24c2 0 4 1 4 2s-2 2-4 2v-4z" fill="#F59E42" />
            </svg>
          </motion.span>
        )
      })}
    </div>
  )
} 