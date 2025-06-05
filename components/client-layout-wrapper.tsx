"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import type { ReactNode } from "react"

export function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isCouplePage = pathname?.startsWith("/couple/")

  return (
    <>
      {!isCouplePage && <Navbar />}
      <main className={!isCouplePage ? "pt-16" : ""}>{children}</main>
    </>
  )
}
