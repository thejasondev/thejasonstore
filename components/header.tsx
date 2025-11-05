"use client"

import Link from "next/link"
import { Search, ShoppingBag, Menu, X, Home, Package, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { STORE_NAME } from "@/lib/constants"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 w-full glass-card border-border/50 focus:border-accent transition-all"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu
              className={`h-6 w-6 transition-all ${mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
            />
            <X
              className={`h-6 w-6 absolute transition-all ${mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
            />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </header>

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

            {/* Search Bar */}
            <div className="pt-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pl-10 w-full glass-card border-border/50 focus:border-accent"
                />
              </div>
            </div>

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
