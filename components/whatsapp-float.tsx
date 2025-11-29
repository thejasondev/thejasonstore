"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PHONE } from "@/lib/constants";

export function WhatsAppFloat() {
  const handleClick = () => {
    const message = encodeURIComponent(
      "Hola, me gustaría obtener más información sobre sus productos The Jason Store."
    );
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground z-[100] transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
