export function normalizeSlug(input: string, fallback: string = "producto"): string {
  const base = input?.trim() || fallback

  const normalized = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return normalized || fallback
}
