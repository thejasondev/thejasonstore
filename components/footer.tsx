import Link from "next/link";
import {
  ShoppingBag,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { STORE_NAME, STORE_DESCRIPTION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                {STORE_NAME}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              {STORE_DESCRIPTION}
            </p>

            {/* Quick Contact CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="w-full sm:w-auto">
                <a
                  href="https://wa.me/5353118193?text=Hola%2C%20estoy%20interesado%20en%20sus%20productos.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n.%20Gracias."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Inicio
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Productos
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Ofertas
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Contacto
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5353118193?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20sus%20productos%20y%20servicios.%20Gracias."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-accent transition-colors group"
                >
                  <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+53 53118193</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Cuba</span>
              </li>
            </ul>

            {/* Social Media (Opcional - descomenta si tienes redes sociales) */}
            {/* <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3">Síguenos</h5>
              <div className="flex gap-3">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {STORE_NAME}. Todos los derechos reservados.
            </p>

            {/* Legal Links (Opcional) */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              <Link
                href="/privacidad"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href="/terminos"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
