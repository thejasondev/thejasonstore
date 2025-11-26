import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { STORE_NAME } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from "lucide-react";

export const metadata = {
  title: `Política de Privacidad | ${STORE_NAME}`,
  description: "Política de privacidad y protección de datos",
};

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Política de Privacidad
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
              En {STORE_NAME}, valoramos y respetamos tu privacidad. Esta
              política describe cómo manejamos tu información personal.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Eye className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    1. Información que Recopilamos
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Al utilizar nuestros servicios y realizar compras a través
                      de WhatsApp, podemos recopilar:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Nombre y datos de contacto (número de teléfono)</li>
                      <li>Dirección de entrega</li>
                      <li>Detalles de productos solicitados</li>
                      <li>Información de la transacción</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <Lock className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    2. Uso de la Información
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Utilizamos tu información personal únicamente para:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Procesar y entregar tus pedidos</li>
                      <li>Comunicarnos contigo sobre tu compra</li>
                      <li>Mejorar nuestros productos y servicios</li>
                      <li>
                        Enviar actualizaciones sobre productos (con tu
                        consentimiento)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="glass-card p-6 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <UserCheck className="h-5 w-5 text-accent mt-1 shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    3. Protección de Datos
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Nos comprometemos a proteger tu información personal:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        No compartimos tu información con terceros sin tu
                        consentimiento
                      </li>
                      <li>Mantenemos tus datos seguros y confidenciales</li>
                      <li>
                        Solo el personal autorizado tiene acceso a tu
                        información
                      </li>
                      <li>Eliminamos datos innecesarios de forma periódica</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">
                4. Comunicación por WhatsApp
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Al contactarnos por WhatsApp:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    La conversación está protegida por el cifrado de extremo a
                    extremo de WhatsApp
                  </li>
                  <li>
                    Guardamos los mensajes necesarios para completar tu pedido
                  </li>
                  <li>
                    Puedes solicitar la eliminación de tu conversación en
                    cualquier momento
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">5. Tus Derechos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Tienes derecho a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acceder a tu información personal</li>
                  <li>Solicitar correcciones de datos incorrectos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>
                    Retirar tu consentimiento para comunicaciones de marketing
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">
                6. Cookies y Tecnologías
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Nuestro sitio web puede utilizar cookies para mejorar tu
                  experiencia de navegación. Puedes configurar tu navegador para
                  rechazar cookies, aunque esto puede afectar algunas
                  funcionalidades del sitio.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="glass-card p-6 rounded-xl bg-accent/5 border-accent/20">
              <h2 className="text-xl font-semibold mb-3">
                Contacto sobre Privacidad
              </h2>
              <p className="text-muted-foreground mb-4">
                Si tienes preguntas sobre nuestra política de privacidad o
                deseas ejercer tus derechos, contáctanos:
              </p>
              <a
                href="https://wa.me/5353118193?text=Hola%2C%20tengo%20una%20consulta%20sobre%20la%20pol%C3%ADtica%20de%20privacidad."
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
