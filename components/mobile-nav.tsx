"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, LayoutGrid } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { favoritesCount } = useFavorites();

  // Navigation items matching reference image - 4 items only
  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/carrito",
      label: "Carrito",
      icon: ShoppingBag,
      badge: itemCount > 0 ? itemCount : null,
    },
    {
      href: "/favoritos",
      label: "Favoritos",
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      href: "/productos",
      label: "Tienda",
      icon: LayoutGrid,
    },
  ];

  return (
    <>
      {/* Floating Bottom Navigation - Pill Style */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <nav className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl shadow-black/10">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={item.label}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-all",
                        isActive && "scale-105"
                      )}
                    />
                    {/* Badge for inactive items */}
                    {item.badge && !isActive && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label only shows when active */}
                  {isActive && (
                    <span className="text-sm font-semibold animate-in fade-in slide-in-from-left-2 duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Badge inside pill when active */}
                  {item.badge && isActive && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-foreground/20 text-[10px] font-bold">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-24 md:hidden" />
    </>
  );
}
