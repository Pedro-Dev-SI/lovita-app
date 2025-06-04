"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoModeBanner() {
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isDemo) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Modo Demo:</strong> Configure as variáveis de ambiente do Supabase para ativar todas as funcionalidades.
        Veja o arquivo .env.example para mais detalhes.
      </AlertDescription>
    </Alert>
  )
}
