"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Tag,
  ShoppingBag,
  Menu,
  Settings,
  Mail,
  Shield,
  FileText,
  LogOut,
} from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { STORE_NAME } from "@/lib/constants";

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/productos",
      label: "Productos",
      icon: Package,
    },
    {
      href: "/ofertas",
      label: "Ofertas",
      icon: Tag,
      highlight: true,
    },
    {
      href: "/carrito",
      label: "Carrito",
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : null,
    },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <nav className="bg-background/95 backdrop-blur-2xl border-t border-border pb-safe shadow-2xl">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isActive && "scale-110",
                        item.highlight && !isActive && "text-accent"
                      )}
                    />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground animate-in zoom-in">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-b-full" />
                  )}
                </Link>
              );
            })}

            {/* More Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Menu className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Menú</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <SheetHeader className="p-6 border-b border-border/50">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Menu className="h-5 w-5 text-accent" />
                    Menú Principal
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full overflow-y-auto bg-background/50 backdrop-blur-xl">
                  <div className="p-4 grid gap-2">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                      General
                    </p>

                    <Link
                      href="/contacto"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Contacto</span>
                        <span className="text-xs text-muted-foreground">
                          Soporte y ayuda
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 grid gap-2 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                      Legal
                    </p>
                    <Link
                      href="/privacidad"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Privacidad</span>
                    </Link>
                    <Link
                      href="/terminos"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Términos</span>
                    </Link>
                  </div>

                  <div className="mt-auto p-6 border-t border-border/50">
                    <div className="glass-card p-4 rounded-xl bg-accent/5 border-accent/20">
                      <p className="font-bold text-lg mb-1">{STORE_NAME}</p>
                      <p className="text-xs text-muted-foreground">
                        © 2025 Todos los derechos reservados
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-16 md:hidden" />
    </>
  );
}
