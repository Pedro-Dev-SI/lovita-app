"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface HeartsProps {
  show: boolean
}

export function Hearts({ show }: HeartsProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; size: number }>>([])

  useEffect(() => {
    if (show) {
      const newHearts = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 16 + Math.random() * 16,
      }))
      setHearts(newHearts)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            top: "100%",
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: 0,
            x: Math.sin(heart.id) * 50,
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            ease: "easeOut",
          }}
        >
          <Heart size={heart.size} className="fill-pink-500 text-pink-500" />
        </motion.div>
      ))}
    </div>
  )
}
