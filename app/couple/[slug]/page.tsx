"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { CouplePage, Music, Memory } from "@/lib/types"
import { TimeCounter } from "@/components/time-counter"
import { Confetti } from "@/components/animations/confetti"
import { Hearts } from "@/components/animations/hearts"
import { FloatingHearts } from "@/components/animations/floating-hearts"
import { FloatingStars } from "@/components/animations/floating-stars"
import { isAnniversary } from "@/lib/utils/date"
import { Share2, Heart, Play, Pause, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { ThemeBackground } from "@/components/animations/theme-background"
import { MemoryGallery } from "@/components/memory-gallery"

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)

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

  // Auto-play music after page loads
  useEffect(() => {
    if (music.length > 0) {
      const timer = setTimeout(() => {
        setIsPlaying(true)
        setShowMusicPlayer(true)
      }, 2000) // Wait 2 seconds after page loads

      return () => clearTimeout(timer)
    }
  }, [music])

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

  const toggleMusic = () => {
    setIsPlaying(!isPlaying)
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
  const heartColor = getHeartColorFromTheme(couplePage.theme_color)

  return (
    <ThemeBackground theme={couplePage.theme_color}>
      {/* Anniversary Animations */}
      <Confetti show={anniversaryType === "monthly"} />
      <Hearts show={anniversaryType === "yearly"} />

      {/* Background Animation */}
      {!anniversaryType && couplePage.background_animation === "hearts" && (
        <FloatingHearts color={heartColor} count={20} />
      )}
      {!anniversaryType && couplePage.background_animation === "confetti" ? (
        <Confetti show={true} />
      ) : null}
      {!anniversaryType && couplePage.background_animation === "stars" ? (
        <FloatingStars color="#fbbf24" count={20} />
      ) : null}

      {/* Music Player - Floating */}
      {primaryMusic && primaryMusic.spotify_url && (
        <div className="fixed bottom-6 left-6 z-50">
          <iframe
            src={`${primaryMusic.spotify_url.replace("track/", "embed/track/")}?utm_source=generator&autoplay=1&theme=0`}
            width="320"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg shadow-lg"
          />
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
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center justify-center gap-2">
              {couplePage.partner1_name} & {couplePage.partner2_name}
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block text-3xl ml-2 align-middle"
              >
                ❤️
              </motion.span>
            </h1>
          </div>
          <p className="text-xl text-white/80 mt-2">
            Juntos desde {formatDateBR(couplePage.relationship_start_date)}
          </p>
        </div>

        {/* Time Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block"
            >
              ✨
            </motion.span>{" "}
            Tempo Juntos{" "}
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="inline-block"
            >
              ✨
            </motion.span>
          </h2>
          <TimeCounter startDate={couplePage.relationship_start_date} />
        </motion.div>

        {/* Memories Gallery */}
        {memories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <MemoryGallery memories={memories} />
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
              className="inline-block bg-white p-4 rounded-lg shadow-lg"
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
          <p>
            Feito com{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="inline-block text-red-400"
            >
              ❤️
            </motion.span>{" "}
            para celebrar o amor
          </p>
          <p className="text-sm mt-2">Crie sua própria página em lovita.com</p>
        </motion.div>
      </div>
    </ThemeBackground>
  )
}

// Helper function to get heart color based on theme
function getHeartColorFromTheme(themeColor: string): string {
  switch (themeColor) {
    case "#B61862": // Pink theme
      return "#ff6b81"
    case "#1E40AF": // Blue theme
      return "#60a5fa"
    case "#047857": // Green theme
      return "#34d399"
    case "#7C3AED": // Purple theme
      return "#a78bfa"
    case "#B45309": // Amber theme
      return "#fbbf24"
    default:
      return "#ff6b81"
  }
}

// Função utilitária para formatar a data corretamente:
function formatDateBR(dateString: string) {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}
