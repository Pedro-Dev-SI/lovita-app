"use client"

import { useEffect, useState } from "react"
import { calculateTimeTogether } from "@/lib/utils/date"
import { motion } from "framer-motion"

interface TimeCounterProps {
  startDate: string
}

export function TimeCounter({ startDate }: TimeCounterProps) {
  const [time, setTime] = useState(calculateTimeTogether(startDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeTogether(startDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate])

  const timeUnits = [
    { label: "Anos", value: time.years },
    { label: "Meses", value: time.months },
    { label: "Dias", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Minutos", value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <div className="text-2xl md:text-3xl font-bold text-white">{unit.value.toString().padStart(2, "0")}</div>
          <div className="text-sm text-white/80">{unit.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
