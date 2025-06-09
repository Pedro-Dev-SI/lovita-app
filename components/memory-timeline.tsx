"use client"

import { useState, useMemo } from "react"
import type { Memory } from "@/lib/types"
import { ChevronLeft, ChevronRight, Camera } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface MemoryTimelineProps {
  memories: Memory[]
}

function formatDateBR(dateString: string) {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export function MemoryTimeline({ memories }: MemoryTimelineProps) {
  // Ordenar por data crescente
  const orderedMemories = useMemo(() =>
    [...memories].sort((a, b) => (a.memory_date || "") > (b.memory_date || "") ? 1 : -1),
    [memories]
  )
  const [current, setCurrent] = useState(0)

  if (orderedMemories.length === 0) return null

  const memory = orderedMemories[current]

  const goPrev = () => setCurrent((prev) => (prev === 0 ? orderedMemories.length - 1 : prev - 1))
  const goNext = () => setCurrent((prev) => (prev === orderedMemories.length - 1 ? 0 : prev + 1))

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-4 mb-6">
        <Camera className="w-6 h-6 text-[#FFB7CB]" />
        <h3 className="text-xl font-bold text-white">Nossas Memórias</h3>
      </div>
      <div className="flex items-center justify-center w-full max-w-2xl">
        <Button onClick={goPrev} variant="ghost" size="icon" className="text-white/80 hover:bg-white/10">
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center w-[320px] md:w-[400px] min-h-[420px]"
            >
              {memory.media_url && (
                <img
                  src={memory.media_url}
                  alt={memory.title || "Memória"}
                  className="w-full h-[300px] object-cover rounded-xl mb-4 border"
                />
              )}
              <h4 className="text-lg font-bold text-white mb-1 text-center">{memory.title}</h4>
              <p className="text-xs text-white/70 mb-2">{formatDateBR(memory.memory_date || "")}</p>
              {memory.description && (
                <p className="text-white/90 text-center whitespace-pre-line break-words">{memory.description}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Button onClick={goNext} variant="ghost" size="icon" className="text-white/80 hover:bg-white/10">
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
      <div className="flex gap-1 mt-4">
        {orderedMemories.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${idx === current ? "bg-pink-400" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  )
} 