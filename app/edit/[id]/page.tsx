"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Heart, ArrowLeft, Music, Camera, Trash2 } from "lucide-react"
import Link from "next/link"
import type { CouplePage, User, Memory, Music as MusicType } from "@/lib/types"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface EditPageProps {
  params: {
    id: string
  }
}

export default function EditPage({ params }: EditPageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [couplePage, setCouplePage] = useState<CouplePage | null>(null)
  const [memories, setMemories] = useState<Memory[]>([])
  const [music, setMusic] = useState<MusicType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    partner1_name: "",
    partner2_name: "",
    relationship_start_date: "",
    theme_color: "#B61862",
    background_animation: "hearts",
    love_story: "",
  })

  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    memory_date: "",
  })

  const [newMusic, setNewMusic] = useState({
    song_title: "",
    artist: "",
    spotify_url: "",
    is_primary: false,
  })

  const [memoryImageFile, setMemoryImageFile] = useState<File | null>(null)

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) {
          router.push("/login")
          return
        }

        // Get user data
        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()
        setUser(userData as User)

        // Get couple page
        const { data: pageData, error: pageError } = await supabase
          .from("couple_pages")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", authUser.id)
          .single()

        if (pageError) throw pageError
        setCouplePage(pageData)

        setFormData({
          partner1_name: pageData.partner1_name,
          partner2_name: pageData.partner2_name,
          relationship_start_date: pageData.relationship_start_date,
          theme_color: pageData.theme_color,
          background_animation: pageData.background_animation,
          love_story: pageData.love_story || "",
        })

        // Get memories
        const { data: memoriesData } = await supabase
          .from("memories")
          .select("*")
          .eq("couple_page_id", pageData.id)
          .order("memory_date", { ascending: false })

        setMemories(memoriesData || [])

        // Get music
        const { data: musicData } = await supabase
          .from("music")
          .select("*")
          .eq("couple_page_id", pageData.id)
          .order("created_at", { ascending: false })

        setMusic(musicData || [])
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from("couple_pages")
        .update({
          partner1_name: formData.partner1_name,
          partner2_name: formData.partner2_name,
          relationship_start_date: formData.relationship_start_date,
          theme_color: formData.theme_color,
          background_animation: formData.background_animation,
          love_story: formData.love_story,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (error) throw error

      toast({
        title: "Página atualizada!",
        description: "As informações da página foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !couplePage || !user) return

    // Check subscription limits
    if (memories.filter((m) => m.media_type === "image").length >= user.max_images) {
      toast({
        title: "Limite atingido",
        description: `Seu plano permite no máximo ${user.max_images} imagens.`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${couplePage.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage.from("memories").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("memories").getPublicUrl(fileName)

      // Save to database
      const { error: dbError } = await supabase.from("memories").insert({
        couple_page_id: couplePage.id,
        title: newMemory.title || "Nova memória",
        description: newMemory.description,
        media_url: publicUrl,
        media_type: "image",
        memory_date: newMemory.memory_date || new Date().toISOString().split("T")[0],
      })

      if (dbError) throw dbError

      // Refresh memories
      const { data: memoriesData } = await supabase
        .from("memories")
        .select("*")
        .eq("couple_page_id", couplePage.id)
        .order("memory_date", { ascending: false })

      setMemories(memoriesData || [])
      setNewMemory({ title: "", description: "", memory_date: "" })

      toast({
        title: "Imagem adicionada!",
        description: "A memória foi adicionada com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleAddMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couplePage || !user || !user.has_music) {
      toast({
        title: "Recurso não disponível",
        description: "Seu plano não inclui o recurso de música.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("music").insert({
        couple_page_id: couplePage.id,
        song_title: newMusic.song_title,
        artist: newMusic.artist,
        spotify_url: newMusic.spotify_url,
        is_primary: newMusic.is_primary,
      })

      if (error) throw error

      // Refresh music
      const { data: musicData } = await supabase
        .from("music")
        .select("*")
        .eq("couple_page_id", couplePage.id)
        .order("created_at", { ascending: false })

      setMusic(musicData || [])
      setNewMusic({ song_title: "", artist: "", spotify_url: "", is_primary: false })

      toast({
        title: "Música adicionada!",
        description: "A música foi adicionada com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      const { error } = await supabase.from("memories").delete().eq("id", memoryId)

      if (error) throw error

      setMemories(memories.filter((m) => m.id !== memoryId))

      toast({
        title: "Memória removida",
        description: "A memória foi removida com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteMusic = async (musicId: string) => {
    try {
      const { error } = await supabase.from("music").delete().eq("id", musicId)

      if (error) throw error

      setMusic(music.filter((m) => m.id !== musicId))

      toast({
        title: "Música removida",
        description: "A música foi removida com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAddMemory = async () => {
    if (!memoryImageFile || !couplePage || !user) return
    if (!newMemory.title || !newMemory.memory_date) return

    // Check subscription limits
    if (memories.filter((m) => m.media_type === "image").length >= user.max_images) {
      toast({
        title: "Limite atingido",
        description: `Seu plano permite no máximo ${user.max_images} imagens.`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileExt = memoryImageFile.name.split(".").pop()
      const fileName = `${couplePage.id}/${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from("memories").upload(fileName, memoryImageFile)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from("memories").getPublicUrl(fileName)
      // Save to database
      const { error: dbError } = await supabase.from("memories").insert({
        couple_page_id: couplePage.id,
        title: newMemory.title || "Nova memória",
        description: newMemory.description,
        media_url: publicUrl,
        media_type: "image",
        memory_date: newMemory.memory_date || new Date().toISOString().split("T")[0],
      })
      if (dbError) throw dbError
      // Refresh memories
      const { data: memoriesData } = await supabase
        .from("memories")
        .select("*")
        .eq("couple_page_id", couplePage.id)
        .order("memory_date", { ascending: false })
      setMemories(memoriesData || [])
      setNewMemory({ title: "", description: "", memory_date: "" })
      setMemoryImageFile(null)
      toast({
        title: "Imagem adicionada!",
        description: "A memória foi adicionada com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!couplePage || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-600">Página não encontrada</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao dashboard
          </Link>
        </Button>

        <div className="grid gap-8">
          {/* Page Info */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Editar Página do Casal</CardTitle>
              <CardDescription className="text-gray-600">
                Plano: {user.subscription_plan === "forever" ? "Para Sempre" : "Anual"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePage} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner1" className="text-gray-700 font-medium">
                      Nome do Primeiro Parceiro
                    </Label>
                    <Input
                      id="partner1"
                      value={formData.partner1_name}
                      onChange={(e) => setFormData({ ...formData, partner1_name: e.target.value })}
                      required
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partner2" className="text-gray-700 font-medium">
                      Nome do Segundo Parceiro
                    </Label>
                    <Input
                      id="partner2"
                      value={formData.partner2_name}
                      onChange={(e) => setFormData({ ...formData, partner2_name: e.target.value })}
                      required
                      className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-gray-700 font-medium">
                    Data de Início do Relacionamento
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.relationship_start_date}
                    onChange={(e) => setFormData({ ...formData, relationship_start_date: e.target.value })}
                    required
                    className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-color" className="text-gray-700 font-medium">
                    Cor do Tema
                  </Label>
                  <Select
                    value={formData.theme_color}
                    onValueChange={(value) => setFormData({ ...formData, theme_color: value })}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="#B61862">Rosa Romântico</SelectItem>
                      <SelectItem value="#1E40AF">Azul Sereno</SelectItem>
                      <SelectItem value="#047857">Verde Esperança</SelectItem>
                      <SelectItem value="#7C3AED">Roxo Encantado</SelectItem>
                      <SelectItem value="#B45309">Âmbar Aconchegante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {user.has_dynamic_background && (
                  <div className="space-y-2">
                    <Label htmlFor="animation" className="text-gray-700 font-medium">
                      Animação de Fundo
                    </Label>
                    <Select
                      value={formData.background_animation}
                      onValueChange={(value) => setFormData({ ...formData, background_animation: value })}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hearts">Corações Flutuantes</SelectItem>
                        <SelectItem value="confetti">Confete Colorido</SelectItem>
                        <SelectItem value="stars">Estrelas Cadentes</SelectItem>
                        <SelectItem value="none">Sem Animação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2 relative">
                  <Label htmlFor="love-story" className="text-gray-700 font-medium">
                    Uma breve história de vocês (opcional)
                  </Label>
                  <div className="flex items-start gap-2">
                    <Textarea
                      id="love-story"
                      ref={textareaRef}
                      value={formData.love_story}
                      onChange={(e) => setFormData({ ...formData, love_story: e.target.value })}
                      placeholder="Conte algo especial, use emojis se quiser! 💖✨"
                      className="border-gray-200 focus:border-pink-500 focus:ring-pink-500 min-h-[80px]"
                      maxLength={1000}
                    />
                    <button
                      type="button"
                      className="mt-2 ml-1 p-2 rounded-full bg-pink-100 hover:bg-pink-200 border border-pink-200 text-xl"
                      onClick={() => setShowEmojiPicker((v) => !v)}
                      aria-label="Adicionar emoji"
                    >
                      😊
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute z-50 left-0 mt-2">
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                          const textarea = textareaRef.current
                          if (!textarea) return
                          const start = textarea.selectionStart
                          const end = textarea.selectionEnd
                          const text = formData.love_story
                          const newText = text.slice(0, start) + emoji.native + text.slice(end)
                          setFormData({ ...formData, love_story: newText })
                          setShowEmojiPicker(false)
                          setTimeout(() => {
                            textarea.focus()
                            textarea.selectionStart = textarea.selectionEnd = start + emoji.native.length
                          }, 0)
                        }}
                        previewPosition="none"
                        theme="light"
                        style={{ position: 'absolute', left: 0, top: 40, zIndex: 100 }}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Memories Section */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-pink-500" />
                Galeria de Memórias ({memories.filter((m) => m.media_type === "image").length}/{user.max_images})
              </CardTitle>
              <CardDescription className="text-gray-600">Adicione fotos especiais do relacionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Memory Form */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memory-title" className="text-gray-700 font-medium">
                      Título da Memória
                    </Label>
                    <Input
                      id="memory-title"
                      value={newMemory.title}
                      onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                      placeholder="Ex: Nossa primeira viagem"
                      className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memory-date" className="text-gray-700 font-medium">
                      Data da Memória
                    </Label>
                    <Input
                      id="memory-date"
                      type="date"
                      value={newMemory.memory_date}
                      onChange={(e) => setNewMemory({ ...newMemory, memory_date: e.target.value })}
                      className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memory-description" className="text-gray-700 font-medium">
                    Descrição (opcional)
                  </Label>
                  <Textarea
                    id="memory-description"
                    value={newMemory.description}
                    onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                    placeholder="Conte a história dessa memória..."
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memory-image" className="text-gray-700 font-medium">
                    Imagem
                  </Label>
                  <Input
                    id="memory-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMemoryImageFile(e.target.files?.[0] || null)}
                    disabled={uploading || memories.filter((m) => m.media_type === "image").length >= user.max_images}
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                  {uploading && <p className="text-sm text-gray-500">Enviando imagem...</p>}
                </div>
                <Button
                  onClick={handleAddMemory}
                  disabled={
                    uploading ||
                    !newMemory.title ||
                    !newMemory.memory_date ||
                    !memoryImageFile ||
                    memories.filter((m) => m.media_type === "image").length >= user.max_images
                  }
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white mt-2"
                >
                  {uploading ? "Adicionando..." : "Adicionar Memória"}
                </Button>
              </div>

              {/* Memories Accordion */}
              {memories.length > 0 && (
                <Accordion type="multiple" className="w-full">
                  {memories.map((memory, idx) => (
                    <AccordionItem key={memory.id} value={memory.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-4">
                          <img
                            src={memory.media_url || "/placeholder.svg"}
                            alt={memory.title || "Memória"}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{memory.title}</div>
                            <div className="text-xs text-gray-500">{memory.memory_date ? new Date(memory.memory_date).toLocaleDateString("pt-BR") : null}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={memory.media_url || "/placeholder.svg"}
                              alt={memory.title || "Memória"}
                              className="w-40 h-40 object-cover rounded-lg border"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-lg mb-2">{memory.title}</div>
                            <div className="text-sm text-gray-700 mb-2">{memory.description}</div>
                            <div className="text-xs text-gray-500 mb-2">{memory.memory_date ? new Date(memory.memory_date).toLocaleDateString("pt-BR") : null}</div>
                            <Button
                              onClick={() => handleDeleteMemory(memory.id)}
                              variant="destructive"
                              size="sm"
                              className="mt-2"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remover
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {/* Music Section */}
          {user.has_music && (
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Music className="w-5 h-5 text-pink-500" />
                  Músicas Especiais
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Adicione as músicas que marcaram o relacionamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Music Form */}
                <form onSubmit={handleAddMusic} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="song-title" className="text-gray-700 font-medium">
                        Nome da Música *
                      </Label>
                      <Input
                        id="song-title"
                        value={newMusic.song_title}
                        onChange={(e) => setNewMusic({ ...newMusic, song_title: e.target.value })}
                        required
                        placeholder="Ex: Perfect"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="artist" className="text-gray-700 font-medium">
                        Artista
                      </Label>
                      <Input
                        id="artist"
                        value={newMusic.artist}
                        onChange={(e) => setNewMusic({ ...newMusic, artist: e.target.value })}
                        placeholder="Ex: Ed Sheeran"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spotify-url" className="text-gray-700 font-medium">
                      Link do Spotify (opcional)
                    </Label>
                    <Input
                      id="spotify-url"
                      value={newMusic.spotify_url}
                      onChange={(e) => setNewMusic({ ...newMusic, spotify_url: e.target.value })}
                      placeholder="https://open.spotify.com/track/..."
                      className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is-primary"
                      checked={newMusic.is_primary}
                      onChange={(e) => setNewMusic({ ...newMusic, is_primary: e.target.checked })}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <Label htmlFor="is-primary" className="text-gray-700">
                      Música principal (aparece em destaque na página)
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    Adicionar Música
                  </Button>
                </form>

                {/* Music List */}
                {music.length > 0 && (
                  <div className="space-y-4">
                    {music.map((song) => (
                      <div key={song.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {song.song_title}
                            {song.is_primary && (
                              <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full">
                                Principal
                              </span>
                            )}
                          </h4>
                          {song.artist && <p className="text-sm text-gray-600">{song.artist}</p>}
                          {song.spotify_url && (
                            <a
                              href={song.spotify_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 hover:underline"
                            >
                              Ouvir no Spotify
                            </a>
                          )}
                        </div>
                        <Button onClick={() => handleDeleteMusic(song.id)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview Link */}
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualizar Página</h3>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Link href={`/couple/${couplePage.page_slug}`} target="_blank">
                  Ver Página do Amor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
