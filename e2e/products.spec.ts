import { test, expect } from "@playwright/test"

test.describe("Products Page", () => {
  test("should display products list", async ({ page }) => {
    await page.goto("/productos")

    await expect(page.getByRole("heading", { name: "Productos" })).toBeVisible()
  })

  test("should filter by category", async ({ page }) => {
    await page.goto("/productos")

    await page.getByRole("link", { name: "Electrónica" }).click()
    await expect(page).toHaveURL("/productos?categoria=electronica")
  })

  test("should navigate to product detail", async ({ page }) => {
    await page.goto("/productos")

    // Wait for products to load
    await page.waitForSelector('a[href^="/producto/"]', { timeout: 5000 })

    const firstProduct = page.locator('a[href^="/producto/"]').first()
    await firstProduct.click()

    await expect(page).toHaveURL(/\/producto\/.+/)
  })
})
