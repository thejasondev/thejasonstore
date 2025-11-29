"use client";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Home,
  Package,
  Mail,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { STORE_NAME } from "@/lib/constants";
import { CartButton } from "@/components/cart-button";
import { SearchModal } from "@/components/search-modal";
import { useCart } from "@/lib/context/cart-context";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

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
      <header className="sticky top-0 z-50 w-full glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
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

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative w-full group flex items-center gap-3 px-4 py-2 rounded-lg glass-card border border-border/50 hover:border-accent transition-all"
            >
              <Search className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              <span className="text-sm text-muted-foreground">
                Buscar productos...
              </span>
            </button>
          </div>

          {/* Cart Button - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <CartButton />
          </div>

          {/* Mobile Search Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="relative"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
