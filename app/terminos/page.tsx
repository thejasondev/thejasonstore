import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { STORE_NAME } from "@/lib/constants";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShoppingCart,
  Package,
  RefreshCw,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: `Términos y Condiciones | ${STORE_NAME}`,
  description: "Términos y condiciones de uso del servicio",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mt-2 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Términos y Condiciones
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Última actualización:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Al utilizar los servicios de {STORE_NAME}, aceptas los siguientes
              términos y condiciones.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    1. Aceptación de Términos
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Al acceder y utilizar este sitio web y nuestros servicios
                      de venta a través de WhatsApp, aceptas estar sujeto a
                      estos términos y condiciones, todas las leyes y
                      regulaciones aplicables.
                    </p>
                    <p>
                      Si no estás de acuerdo con alguno de estos términos, no
                      deberías utilizar nuestros servicios.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <ShoppingCart className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    2. Proceso de Compra
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Las compras se realizan mediante WhatsApp:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Contacta al número indicado para consultar
                        disponibilidad
                      </li>
                      <li>Confirma tu pedido con los detalles del producto</li>
                      <li>Proporciona tu dirección de entrega</li>
                      <li>Acuerda el método y momento de pago</li>
                      <li>Espera la confirmación de tu pedido</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <DollarSign className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    3. Precios y Pagos
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Información sobre precios y pagos:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Los precios mostrados son en la moneda indicada
                        (USD/CUP)
                      </li>
                      <li>Los precios pueden cambiar sin previo aviso</li>
                      <li>
                        El precio final se confirma al momento de realizar el
                        pedido
                      </li>
                      <li>
                        Los métodos de pago aceptados se informan al confirmar
                        el pedido
                      </li>
                      <li>
                        El pago puede realizarse al momento de la entrega o
                        mediante transferencia
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Package className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    4. Envíos y Entregas
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Políticas de envío y entrega:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Los tiempos de entrega se informan al confirmar el
                        pedido
                      </li>
                      <li>
                        Los gastos de envío se calculan según la ubicación
                      </li>
                      <li>
                        Es responsabilidad del comprador verificar el producto
                        al recibirlo
                      </li>
                      <li>
                        Debes reportar cualquier daño o defecto al momento de la
                        entrega
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <RefreshCw className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    5. Devoluciones y Cambios
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Política de devoluciones:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Aceptamos cambios dentro de las primeras 24 horas de la
                        entrega
                      </li>
                      <li>
                        El producto debe estar sin usar y en su empaque original
                      </li>
                      <li>
                        Los productos defectuosos pueden ser cambiados o
                        reembolsados
                      </li>
                      <li>
                        Contacta vía WhatsApp para iniciar el proceso de
                        devolución
                      </li>
                      <li>
                        Los costos de envío de devolución corren por cuenta del
                        cliente, salvo en casos de productos defectuosos
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Package className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    6. Disponibilidad de Productos
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Los productos están sujetos a disponibilidad:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        El inventario se actualiza regularmente pero puede
                        variar
                      </li>
                      <li>Confirmamos disponibilidad al procesar tu pedido</li>
                      <li>Nos reservamos el derecho de limitar cantidades</li>
                      <li>
                        Si un producto no está disponible, ofrecemos
                        alternativas o reembolso
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    7. Limitación de Responsabilidad
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>{STORE_NAME} no se hace responsable por:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Retrasos en la entrega causados por circunstancias fuera
                        de nuestro control
                      </li>
                      <li>
                        Información de producto proporcionada por fabricantes
                      </li>
                      <li>Daños causados por mal uso del producto</li>
                      <li>Cambios en la disponibilidad o precios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">8. Modificaciones</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Nos reservamos el derecho de modificar estos términos en
                  cualquier momento. Los cambios entrarán en vigor
                  inmediatamente después de su publicación en el sitio web. Es
                  tu responsabilidad revisar periódicamente estos términos.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">9. Ley Aplicable</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Estos términos se rigen por las leyes de Cuba. Cualquier
                  disputa relacionada con estos términos se resolverá mediante
                  comunicación directa entre las partes.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="glass-card p-6 rounded-xl bg-accent/5 border-accent/20">
              <h2 className="text-xl font-semibold mb-3">
                Preguntas sobre los Términos
              </h2>
              <p className="text-muted-foreground mb-4">
                Si tienes preguntas sobre nuestros términos y condiciones, no
                dudes en contactarnos:
              </p>
              <a
                href="https://wa.me/5353118193?text=Hola%2C%20tengo%20una%20consulta%20sobre%20los%20t%C3%A9rminos%20y%20condiciones."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:underline"
              >
                WhatsApp: +53 53118193
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
