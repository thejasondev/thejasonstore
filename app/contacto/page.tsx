import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { MessageCircle, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WHATSAPP_PHONE } from "@/lib/constants"

export const metadata = {
  title: "Contacto | TIENDA",
  description: "Contáctanos para más información sobre nuestros productos",
}

export default function ContactPage() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.")
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contacto</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Estamos aquí para ayudarte. Contáctanos por WhatsApp para cualquier consulta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 mb-2 text-accent" />
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>Respuesta inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">+52 133 1XXX XXXX</p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Abrir WhatsApp</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 mb-2 text-accent" />
                <CardTitle>Email</CardTitle>
                <CardDescription>Te respondemos en 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">info@tienda.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 mb-2 text-accent" />
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Envíos a todo México</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">México</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="text-2xl">¿Tienes alguna pregunta?</CardTitle>
              <CardDescription>Contáctanos por WhatsApp y te ayudaremos con lo que necesites</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Información sobre productos</li>
                <li>• Disponibilidad y stock</li>
                <li>• Métodos de pago</li>
                <li>• Envíos y entregas</li>
                <li>• Devoluciones y garantías</li>
              </ul>
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contactar por WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
