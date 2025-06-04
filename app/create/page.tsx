"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function CreatePage() {
  const [formData, setFormData] = useState({
    partner1_name: "",
    partner2_name: "",
    relationship_start_date: "",
    theme_color: "#B61862",
    background_animation: "hearts",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const generateSlug = (name1: string, name2: string) => {
    return `${name1.toLowerCase().replace(/\s+/g, "-")}-${name2.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const slug = generateSlug(formData.partner1_name, formData.partner2_name)
      const pageUrl = `${window.location.origin}/couple/${slug}`

      const { data, error } = await supabase
        .from("couple_pages")
        .insert({
          user_id: user.id,
          partner1_name: formData.partner1_name,
          partner2_name: formData.partner2_name,
          relationship_start_date: formData.relationship_start_date,
          page_slug: slug,
          theme_color: formData.theme_color,
          background_animation: formData.background_animation,
          qr_code_url: pageUrl,
        })
        .select()
        .single()

      if (error) throw error

      // Create notification settings
      await supabase.from("notifications").insert([
        {
          couple_page_id: data.id,
          notification_type: "monthly",
          is_active: true,
        },
        {
          couple_page_id: data.id,
          notification_type: "yearly",
          is_active: true,
        },
      ])

      toast({
        title: "Página criada com sucesso!",
        description: "Sua página do amor foi criada e está pronta para ser compartilhada.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao dashboard
          </Link>
        </Button>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Criar Página do Casal</CardTitle>
            <CardDescription className="text-gray-600">
              Preencha as informações para criar sua página personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Ex: João"
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
                    placeholder="Ex: Maria"
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
                    <SelectItem value="#9F2525">Vermelho Paixão</SelectItem>
                    <SelectItem value="#82181C">Bordô Elegante</SelectItem>
                    <SelectItem value="#C3B8BB">Rosa Suave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectItem value="none">Sem Animação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Página do Amor"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
