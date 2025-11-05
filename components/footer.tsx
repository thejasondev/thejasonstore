import Link from "next/link"
import { MessageCircle, Mail, MapPin } from "lucide-react"
import { STORE_NAME, STORE_DESCRIPTION } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{STORE_NAME}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {STORE_DESCRIPTION}. Contacta por WhatsApp para realizar tu compra.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
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
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: +52 133 1XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@thejasonstore.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>México</span>
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
