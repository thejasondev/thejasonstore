import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /Productos Premium con Diseño Minimalista/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /Ver Productos/i })).toBeVisible()
  })

  test("should display categories", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("Categorías")).toBeVisible()
    await expect(page.getByText("Electrónica")).toBeVisible()
  })

  test("should navigate to products page", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: /Ver Productos/i }).click()
    await expect(page).toHaveURL("/productos")
  })

  test("should display WhatsApp float button", async ({ page }) => {
    await page.goto("/")

    const whatsappButton = page.getByRole("button", { name: /Contactar por WhatsApp/i })
    await expect(whatsappButton).toBeVisible()
  })
})
