import { generateWhatsAppMessage, generateWhatsAppUrl } from "@/lib/utils/whatsapp"
import type { Product } from "@/lib/types"

const mockProduct: Product = {
  id: "1",
  sku: "TEST-001",
  slug: "test-product",
  title: "Test Product",
  description: "This is a test product",
  price: 99.99,
  currency: "MXN",
  stock: 10,
  images: ["/test-image.jpg"],
  category: "test",
  created_at: new Date().toISOString(),
}

describe("WhatsApp Utils", () => {
  describe("generateWhatsAppMessage", () => {
    it("generates correct message format", () => {
      const productUrl = "https://example.com/producto/test-product"
      const message = generateWhatsAppMessage(mockProduct, productUrl)

      expect(message).toContain("Test Product")
      expect(message).toContain("TEST-001")
      expect(message).toContain("$99.99")
      expect(message).toContain("MXN")
      expect(message).toContain(productUrl)
    })
  })

  describe("generateWhatsAppUrl", () => {
    it("generates valid WhatsApp URL", () => {
      const productUrl = "https://example.com/producto/test-product"
      const url = generateWhatsAppUrl(mockProduct, productUrl)

      expect(url).toContain("https://wa.me/")
      expect(url).toContain("text=")
    })
  })
})
