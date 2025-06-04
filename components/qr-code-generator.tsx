"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface QRCodeGeneratorProps {
  url: string
  size?: number
}

export function QRCodeGenerator({ url, size = 200 }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: "#20231F",
            light: "#FFFFFF",
          },
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    if (url) {
      generateQR()
    }
  }, [url, size])

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.download = "couple-page-qr.png"
      link.href = qrCodeUrl
      link.click()
    }
  }

  if (!qrCodeUrl) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="rounded-lg shadow-lg" />
      <Button onClick={downloadQR} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Baixar QR Code
      </Button>
    </div>
  )
}
