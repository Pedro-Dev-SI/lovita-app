"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { CouplePage, Music, Memory } from "@/lib/types"
import { TimeCounter } from "@/components/time-counter"
import { Confetti } from "@/components/animations/confetti"
import { Hearts } from "@/components/animations/hearts"
import { isAnniversary } from "@/lib/utils/date"
import { Card, CardContent } from "@/components/ui/card"
import { MusicIcon, Camera, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface CouplePageProps {
  params: {
    slug: string
  }
}

export default function CouplePage({ params }: CouplePageProps) {
  const [couplePage, setCouplePage] = useState<CouplePage | null>(null)
  const [music, setMusic] = useState<Music[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [anniversaryType, setAnniversaryType] = useState<"monthly" | "yearly" | null>(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Fetch couple page
        const { data: pageData, error: pageError } = await supabase
          .from("couple_pages")
          .select("*")
          .eq("page_slug", params.slug)
          .eq("is_active", true)
          .single()

        if (pageError) throw pageError
        setCouplePage(pageData)

        // Check if it's an anniversary
        const anniversary = isAnniversary(pageData.relationship_start_date)
        setAnniversaryType(anniversary)

        // Fetch music
        const { data: musicData } = await supabase
          .from("music")
          .select("*")
          .eq("couple_page_id", pageData.id)
          .order("created_at", { ascending: false })

        setMusic(musicData || [])

        // Fetch memories
        const { data: memoriesData } = await supabase
          .from("memories")
          .select("*")
          .eq("couple_page_id", pageData.id)
          .order("memory_date", { ascending: false })

        setMemories(memoriesData || [])
      } catch (error) {
        console.error("Error fetching page data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [params.slug])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${couplePage?.partner1_name} & ${couplePage?.partner2_name}`,
          text: "Veja nossa página do amor!",
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Link copiado para a área de transferência!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#20231F] via-[#82181C] to-[#B61862] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-white text-center"
        >
          <Heart className="w-12 h-12 mx-auto mb-4 fill-white" />
          <div>Carregando página do amor...</div>
        </motion.div>
      </div>
    )
  }

  if (!couplePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#20231F] via-[#82181C] to-[#B61862] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
          <p>Esta página do amor não existe ou foi desativada.</p>
        </div>
      </div>
    )
  }

  const primaryMusic = music.find((m) => m.is_primary) || music[0]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #20231F 0%, ${couplePage.theme_color} 100%)`,
      }}
    >
      {/* Anniversary Animations */}
      <Confetti show={anniversaryType === "monthly"} />
      <Hearts show={anniversaryType === "yearly"} />

      {/* Background Animation */}
      {couplePage.background_animation === "hearts" && !anniversaryType && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <Heart
              key={i}
              className="absolute text-white/10 animate-pulse"
              size={16 + Math.random() * 24}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed top-4 right-4 z-50"
      >
        <Button
          onClick={handleShare}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            {couplePage.partner1_name} & {couplePage.partner2_name}
          </motion.h1>
          <p className="text-xl text-white/80">
            Juntos desde {new Date(couplePage.relationship_start_date).toLocaleDateString("pt-BR")}
          </p>
        </motion.div>

        {/* Time Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">Tempo Juntos</h2>
          <TimeCounter startDate={couplePage.relationship_start_date} />
        </motion.div>

        {/* Music Section */}
        {primaryMusic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <MusicIcon className="w-6 h-6 text-[#FFB7CB]" />
                  <h3 className="text-xl font-bold text-white">Nossa Música</h3>
                </div>
                <div className="text-white">
                  <h4 className="font-semibold">{primaryMusic.song_title}</h4>
                  {primaryMusic.artist && <p className="text-white/70">{primaryMusic.artist}</p>}
                  {primaryMusic.spotify_url && (
                    <div className="mt-4">
                      <iframe
                        src={primaryMusic.spotify_url.replace("track/", "embed/track/")}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Memories Gallery */}
        {memories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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
                      className="aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer group"
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
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            onClick={() => setShowQR(!showQR)}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 mb-6"
          >
            {showQR ? "Ocultar" : "Mostrar"} QR Code
          </Button>

          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block"
            >
              <QRCodeGenerator url={window.location.href} size={200} />
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-white/60"
        >
          <p>Feito com ❤️ para celebrar o amor</p>
          <p className="text-sm mt-2">Crie sua própria página em lovita.com</p>
        </motion.div>
      </div>
    </div>
  )
}
