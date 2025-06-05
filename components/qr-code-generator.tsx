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
    if (!qrCodeUrl) return;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Desenha o QR Code
    const qrImg = new window.Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrCodeUrl;
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, size, size);

      // Desenha o quadrado branco centralizado com borda arredondada
      const squareSize = size * 0.21;
      const squareX = size / 2 - squareSize / 2;
      const squareY = size / 2 - squareSize / 2;
      const borderRadius = squareSize * 0.18;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(squareX + borderRadius, squareY);
      ctx.lineTo(squareX + squareSize - borderRadius, squareY);
      ctx.quadraticCurveTo(squareX + squareSize, squareY, squareX + squareSize, squareY + borderRadius);
      ctx.lineTo(squareX + squareSize, squareY + squareSize - borderRadius);
      ctx.quadraticCurveTo(squareX + squareSize, squareY + squareSize, squareX + squareSize - borderRadius, squareY + squareSize);
      ctx.lineTo(squareX + borderRadius, squareY + squareSize);
      ctx.quadraticCurveTo(squareX, squareY + squareSize, squareX, squareY + squareSize - borderRadius);
      ctx.lineTo(squareX, squareY + borderRadius);
      ctx.quadraticCurveTo(squareX, squareY, squareX + borderRadius, squareY);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.restore();

      // Desenha o coração centralizado menor dentro do quadrado
      const heartImg = new window.Image();
      heartImg.crossOrigin = "anonymous";
      heartImg.src = "/heart-svgrepo-com.svg";
      heartImg.onload = () => {
        const heartSize = squareSize * 0.55;
        ctx.drawImage(
          heartImg,
          size / 2 - heartSize / 2,
          size / 2 - heartSize / 2,
          heartSize,
          heartSize
        );

        // Baixa a imagem final
        const link = document.createElement("a");
        link.download = "couple-page-qr.png";
        link.href = canvas.toDataURL();
        link.click();
      };
    };
  };

  if (!qrCodeUrl) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ position: "relative", width: size, height: size }}>
        <img
          src={qrCodeUrl || "/placeholder.svg"}
          alt="QR Code"
          className="rounded-lg shadow-lg"
          style={{ width: size, height: size }}
        />
        {/* Coração preto centralizado usando SVG do public */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 0.20,
            height: size * 0.20,
            transform: "translate(-50%, -50%)",
            background: "white",
            display: "flex",
            borderRadius: "20%",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="/heart-svgrepo-com.svg"
            alt="Coração"
            style={{ width: "70%", height: "70%", objectFit: "contain" }}
          />
        </div>
      </div>
      <Button onClick={downloadQR} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Baixar QR Code
      </Button>
    </div>
  )
}
