"use client"

import Link from "next/link"
import { Search, ShoppingBag, Menu, X, Home, Package, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { STORE_NAME } from "@/lib/constants"
import { CartButton } from "@/components/cart-button"
import { SearchModal } from "@/components/search-modal"
import { useCart } from "@/lib/context/cart-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">{STORE_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/productos" className="text-sm font-medium transition-all hover:text-accent relative group">
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link href="/contacto" className="text-sm font-medium transition-all hover:text-accent relative group">
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
              <span className="text-sm text-muted-foreground">Buscar productos...</span>
              <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Cart Button - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <CartButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="relative">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
            <CartButton />
            <Button variant="ghost" size="icon" className="relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu
                className={`h-6 w-6 transition-all ${mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
              />
              <X
                className={`h-6 w-6 absolute transition-all ${mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
              />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-16 bottom-0 w-80 max-w-[85vw] glass p-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="flex flex-col space-y-2">
            {/* Menu Items */}
            {[
              { href: "/", label: "Inicio", icon: Home },
              { href: "/productos", label: "Productos", icon: Package },
              { href: "/contacto", label: "Contacto", icon: Mail },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-4 rounded-lg glass-card glass-hover group"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileMenuOpen ? "slideIn 0.3s ease-out forwards" : "none",
                }}
              >
                <item.icon className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Decorative Element */}
            <div className="pt-8 mt-auto">
              <div className="glass-card p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">¿Necesitas ayuda?</p>
                <Button asChild variant="link" className="text-accent hover:text-accent/80 p-0 h-auto">
                  <Link href="/contacto">Contáctanos</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
