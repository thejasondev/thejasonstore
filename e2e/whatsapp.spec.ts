import { test, expect } from "@playwright/test"

test.describe("WhatsApp Integration", () => {
  test("should open WhatsApp dialog on product page", async ({ page }) => {
    // Navigate to a product page (assuming products exist)
    await page.goto("/productos")

    // Wait for products to load and click first one
    await page.waitForSelector('a[href^="/producto/"]', { timeout: 5000 })
    await page.locator('a[href^="/producto/"]').first().click()

    // Click WhatsApp button
    const whatsappButton = page.getByRole("button", { name: /Comprar por WhatsApp/i })
    await whatsappButton.click()

    // Check dialog appears
    await expect(page.getByText("Vista previa del mensaje:")).toBeVisible()
  })
})
