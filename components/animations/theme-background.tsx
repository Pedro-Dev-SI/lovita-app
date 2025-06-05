"use client"

import type React from "react"

import { motion } from "framer-motion"

interface ThemeBackgroundProps {
  theme: string
  children: React.ReactNode
}

export function ThemeBackground({ theme, children }: ThemeBackgroundProps) {
  // Define theme-specific properties
  const getThemeProperties = () => {
    switch (theme) {
      case "#B61862": // Pink theme
        return {
          gradient: "from-[#20231F] via-[#82181C] to-[#B61862]",
          overlayColor: "rgba(182, 24, 98, 0.05)",
          particleColor: "rgba(255, 183, 203, 0.3)",
        }
      case "#1E40AF": // Blue theme
        return {
          gradient: "from-[#0F172A] via-[#1E3A8A] to-[#1E40AF]",
          overlayColor: "rgba(30, 64, 175, 0.05)",
          particleColor: "rgba(191, 219, 254, 0.3)",
        }
      case "#047857": // Green theme
        return {
          gradient: "from-[#064E3B] via-[#065F46] to-[#047857]",
          overlayColor: "rgba(4, 120, 87, 0.05)",
          particleColor: "rgba(167, 243, 208, 0.3)",
        }
      case "#7C3AED": // Purple theme
        return {
          gradient: "from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]",
          overlayColor: "rgba(124, 58, 237, 0.05)",
          particleColor: "rgba(216, 180, 254, 0.3)",
        }
      case "#B45309": // Amber theme
        return {
          gradient: "from-[#78350F] via-[#92400E] to-[#B45309]",
          overlayColor: "rgba(180, 83, 9, 0.05)",
          particleColor: "rgba(252, 211, 77, 0.3)",
        }
      case "patodavida": // Tema Patodavida
        return {
          gradient: "from-[#7EC3E6] via-[#5EA7D1] to-[#B3E0FF]", // azul mais escuro
          overlayColor: "rgba(94, 167, 209, 0.10)",
          particleColor: "rgba(255, 255, 255, 0.18)",
        }
      default: // Default/fallback
        return {
          gradient: "from-[#20231F] via-[#82181C] to-[#B61862]",
          overlayColor: "rgba(182, 24, 98, 0.05)",
          particleColor: "rgba(255, 183, 203, 0.3)",
        }
    }
  }

  const { gradient, overlayColor, particleColor } = getThemeProperties()

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${gradient}`}>
      {/* Animated overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 20%, ${overlayColor} 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              backgroundColor: particleColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(1px)",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
