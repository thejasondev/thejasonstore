"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WHATSAPP_PHONE } from "@/lib/constants"

export function WhatsAppFloat() {
  const handleClick = () => {
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.")
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground z-50 transition-transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
