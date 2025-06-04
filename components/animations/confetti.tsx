"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiProps {
  show: boolean
}

export function Confetti({ show }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string }>>([])

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ["#B61862", "#FFB7CB", "#9F2525", "#C3B8BB"][Math.floor(Math.random() * 4)],
      }))
      setPieces(newPieces)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded"
          style={{
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            top: "-10px",
          }}
          initial={{ y: -10, rotate: 0 }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
            x: Math.random() * 100 - 50,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
