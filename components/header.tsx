"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Menu,
  SlidersHorizontal,
  Package,
  Tag,
  Mail,
  Shield,
  FileText,
  Home,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { STORE_NAME } from "@/lib/constants";
import { CartButton } from "@/components/cart-button";
import { SearchModal } from "@/components/search-modal";
import { useCart } from "@/lib/context/cart-context";
import { useFavorites } from "@/lib/context/favorites-context";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border/50">
        {/* Main Header Row */}
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Mobile: Menu Icon | Desktop: Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10"
                  aria-label="Abrir menú"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-5 border-b border-border/50">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-accent" />
                    {STORE_NAME}
                  </SheetTitle>
                </SheetHeader>

                {/* Main Navigation */}
                <nav className="p-4">
                  <p className="text-xs font-medium text-muted-foreground px-3 mb-3 uppercase tracking-wider">
                    Navegación
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                        <Home className="h-4 w-4 text-accent" />
                      </div>
                      <span className="font-medium">Inicio</span>
                    </Link>
                    <Link
                      href="/productos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-medium">Productos</span>
                    </Link>
                    <Link
                      href="/ofertas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">Ofertas</span>
                    </Link>
                    <Link
                      href="/contacto"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-purple-500" />
                      </div>
                      <span className="font-medium">Contacto</span>
                    </Link>
                  </div>
                </nav>

                {/* Legal Section */}
                <div className="p-4 border-t border-border/50">
                  <p className="text-xs font-medium text-muted-foreground px-3 mb-3 uppercase tracking-wider">
                    Legal
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/privacidad"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Privacidad</span>
                    </Link>
                    <Link
                      href="/terminos"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Términos</span>
                    </Link>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-muted/30">
                  <p className="font-semibold text-sm">{STORE_NAME}</p>
                  <p className="text-xs text-muted-foreground">
                    © 2025 Todos los derechos reservados
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - Hidden on Mobile */}
            <Link
              href="/"
              className="hidden md:flex items-center space-x-2 group"
            >
              <div className="relative">
                <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                {STORE_NAME}
              </span>
            </Link>
          </div>

          {/* Mobile: Center Logo */}
          <Link
            href="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2"
          >
            <span className="text-lg font-bold tracking-tight">
              {STORE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/productos"
              className="text-sm font-medium transition-all hover:text-accent relative group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/ofertas"
              className="text-sm font-medium transition-all hover:text-accent relative group flex items-center gap-1.5"
            >
              Ofertas
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium transition-all hover:text-accent relative group"
            >
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative w-full group flex items-center gap-3 px-4 py-2 rounded-xl glass-card border border-border/50 hover:border-accent transition-all"
            >
              <Search className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              <span className="text-sm text-muted-foreground">
                Buscar productos...
              </span>
            </button>
          </div>

          {/* Right Side - Favorites & Cart */}
          <div className="flex items-center gap-2">
            {/* Mobile Cart Icon */}
            <Link
              href="/carrito"
              className="md:hidden relative flex items-center justify-center h-10 w-10"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Desktop Favorites Button */}
            <Link
              href="/favoritos"
              className="hidden md:flex relative items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {favoritesCount > 9 ? "9+" : favoritesCount}
                </span>
              )}
            </Link>

            {/* Desktop Cart */}
            <div className="hidden md:flex">
              <CartButton />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Below Header */}
        <div className="md:hidden px-4 pb-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 hover:border-accent/50 transition-all"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-muted-foreground">
              ¿Qué estás buscando?
            </span>
            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center border border-border/50">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
