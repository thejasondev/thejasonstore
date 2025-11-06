import Link from "next/link"
import { MessageCircle, Mail, MapPin } from "lucide-react"
import { STORE_NAME, STORE_DESCRIPTION } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Descripción arriba en móvil, parte del grid en desktop */}
        <div className="mb-6 md:mb-0 md:hidden">
          <h3 className="text-lg font-bold mb-3">{STORE_NAME}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {STORE_DESCRIPTION}. Contacta por WhatsApp para realizar tu compra.
          </p>
        </div>

        {/* Grid: 2 columnas en móvil (Enlaces y Contacto), 3 en desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Descripción en desktop (primera columna) */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold mb-4">{STORE_NAME}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {STORE_DESCRIPTION}. Contacta por WhatsApp para realizar tu compra.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mr-2 mb-3 sm:mb-4">Contacto</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="wrap-break-word">WhatsApp: +53 53118193</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Cuba</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {STORE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
