"use client"

import { useState } from "react"
import type { Memory } from "@/lib/types"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface MemoryGalleryProps {
  memories: Memory[]
}

export function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleMemoryClick = (memory: Memory, index: number) => {
    setSelectedMemory(memory)
    setCurrentIndex(index)
  }

  const handleClose = () => {
    setSelectedMemory(null)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? memories.length - 1 : prev - 1))
    setSelectedMemory(memories[currentIndex === 0 ? memories.length - 1 : currentIndex - 1])
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === memories.length - 1 ? 0 : prev + 1))
    setSelectedMemory(memories[currentIndex === memories.length - 1 ? 0 : currentIndex + 1])
  }

  if (memories.length === 0) {
    return null
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Camera className="w-6 h-6 text-[#FFB7CB]" />
            <h3 className="text-xl font-bold text-white">Nossas Memórias</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleMemoryClick(memory, index)}
                className="aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer group relative"
              >
                {memory.media_url && (
                  <>
                    {memory.media_type === "image" ? (
                      <img
                        src={memory.media_url || "/placeholder.svg"}
                        alt={memory.title || "Memória"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <video src={memory.media_url} className="w-full h-full object-cover" controls />
                    )}
                  </>
                )}
                {memory.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
                    <p className="text-white text-sm font-medium truncate">{memory.title}</p>
                    {memory.memory_date && (
                      <p className="text-white/60 text-xs">
                        {new Date(memory.memory_date).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Ver detalhes</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full screen memory view */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex items-center justify-between w-full max-w-6xl">
              <Button variant="ghost" size="icon" onClick={handlePrevious} className="text-white hover:bg-white/20">
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <motion.div
                key={selectedMemory.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center max-w-4xl w-full"
              >
                {selectedMemory.media_url && (
                  <div className="w-full max-h-[70vh] overflow-hidden rounded-lg mb-4">
                    {selectedMemory.media_type === "image" ? (
                      <img
                        src={selectedMemory.media_url || "/placeholder.svg"}
                        alt={selectedMemory.title || "Memória"}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={selectedMemory.media_url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                      />
                    )}
                  </div>
                )}

                <div className="text-center text-white">
                  {selectedMemory.title && <h3 className="text-xl font-bold mb-2">{selectedMemory.title}</h3>}
                  {selectedMemory.memory_date && (
                    <p className="text-white/70 mb-2">
                      {new Date(selectedMemory.memory_date).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  {selectedMemory.description && <p className="text-white/90">{selectedMemory.description}</p>}
                </div>
              </motion.div>

              <Button variant="ghost" size="icon" onClick={handleNext} className="text-white hover:bg-white/20">
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
