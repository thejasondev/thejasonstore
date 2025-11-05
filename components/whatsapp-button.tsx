"use client"

import { useState } from "react"
import { MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Product } from "@/lib/types"
import { generateWhatsAppUrl, generateWhatsAppMessage } from "@/lib/utils/whatsapp"

interface WhatsAppButtonProps {
  product: Product
}

export function WhatsAppButton({ product }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false)
  const productUrl = typeof window !== "undefined" ? window.location.href : ""
  const message = generateWhatsAppMessage(product, productUrl)
  const whatsappUrl = generateWhatsAppUrl(product, productUrl)

  const handleConfirm = () => {
    window.open(whatsappUrl, "_blank")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 relative overflow-hidden group animate-glow"
          disabled={product.stock === 0}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <MessageCircle className="mr-2 h-5 w-5 relative z-10" />
          <span className="relative z-10">Comprar por WhatsApp</span>
          <Sparkles className="ml-2 h-4 w-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            Comprar por WhatsApp
          </DialogTitle>
          <DialogDescription>
            Se abrirá WhatsApp con un mensaje pre-llenado con los datos del producto
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg glass-card p-4">
            <p className="text-sm font-medium mb-2">Vista previa del mensaje:</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleConfirm} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <MessageCircle className="mr-2 h-4 w-4" />
              Abrir WhatsApp
            </Button>
            <Button onClick={() => setOpen(false)} variant="outline" className="w-full glass-card">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
