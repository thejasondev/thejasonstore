import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // SOLO ejecutar lógica de sesión en rutas de administración
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return await updateSession(request);
  }

  // Para todo lo demás (público), dejar pasar sin tocar nada
  return NextResponse.next();
}

export const config = {
  // Matcher optimizado para ignorar estáticos y solo enfocar rutas clave si es necesario
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
