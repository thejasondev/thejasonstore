import { render, screen } from "@testing-library/react"
import { ProductCard } from "@/components/product-card"
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

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("This is a test product")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()
    expect(screen.getByText("En stock")).toBeInTheDocument()
  })

  it('shows "Agotado" badge when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)

    expect(screen.getByText("Agotado")).toBeInTheDocument()
  })
})
