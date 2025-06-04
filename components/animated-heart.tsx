"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface AnimatedHeartProps {
  size?: number
  delay?: number
  duration?: number
  className?: string
}

export function AnimatedHeart({ size = 20, delay = 0, duration = 3, className = "" }: AnimatedHeartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.2, 0],
        y: [0, -100, -200, -300],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 2 + 1,
        ease: "easeOut",
      }}
      className={`absolute ${className}`}
      style={{
        left: `${Math.random() * 100}%`,
        bottom: 0,
      }}
    >
      <Heart size={size} className="text-pink-500 fill-pink-500/30" />
    </motion.div>
  )
}
