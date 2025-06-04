"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, ExternalLink, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CouplePage, User } from "@/lib/types"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [couplePages, setCouplePages] = useState<CouplePage[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/login")
        return
      }

      // Get user data including subscription plan
      const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (userData) {
        setUser(userData as User)

        // If user has no subscription plan, redirect to plans page
        if (userData.subscription_plan === "none") {
          router.push("/plans")
          return
        }
      }

      // Fetch couple pages
      const { data: pages } = await supabase
        .from("couple_pages")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })

      setCouplePages(pages || [])
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
            <p className="text-gray-600">
              {user?.subscription_plan === "forever"
                ? "Plano Para Sempre"
                : user?.subscription_plan === "annual"
                  ? "Plano Anual"
                  : ""}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Create New Page Card */}
        <Card className="mb-8 bg-white shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-500" />
              Criar Nova Página
            </CardTitle>
            <CardDescription className="text-gray-600">
              Crie uma página personalizada para seu relacionamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <Link href="/create">Criar Página</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Existing Pages */}
        {couplePages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {couplePages.map((page) => (
              <Card key={page.id} className="bg-white shadow-sm border-gray-100">
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    {page.partner1_name} & {page.partner2_name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Juntos desde {new Date(page.relationship_start_date).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href={`/couple/${page.page_slug}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Página
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href={`/edit/${page.id}`}>
                        <Settings className="w-4 h-4 mr-2" />
                        Editar
                      </Link>
                    </Button>
                  </div>

                  {page.qr_code_url && (
                    <div className="pt-4">
                      <QRCodeGenerator url={`${window.location.origin}/couple/${page.page_slug}`} size={150} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-sm border-gray-100">
            <CardContent className="text-center py-12">
              <p className="text-gray-600 mb-4">Você ainda não criou nenhuma página</p>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Link href="/create">Criar Primeira Página</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
