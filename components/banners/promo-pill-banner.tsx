"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PromoPillBannerProps {
  banner: Banner;
  className?: string;
}

/**
 * PromoPillBanner - Mobile-first promotional banner with organic pill shape
 * Inspired by modern e-commerce app designs
 */
export function PromoPillBanner({ banner, className }: PromoPillBannerProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl md:rounded-3xl",
        "promo-gradient-soft",
        "p-4 sm:p-6 md:p-8",
        "min-h-[180px] sm:min-h-[200px] md:min-h-[240px]",
        className
      )}
    >
      {/* Tag Label */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold shadow-md">
          {banner.description || "Oferta Especial"}
        </span>
      </div>

      {/* Content Grid */}
      <div className="flex items-center justify-between h-full pt-8 sm:pt-6">
        {/* Text Content */}
        <div className="flex-1 max-w-[60%] space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
            {banner.title}
          </h3>

          {banner.cta_text && banner.cta_link && (
            <Button
              asChild
              size="sm"
              className={cn(
                "pill-shape h-9 sm:h-10 px-4 sm:px-6 text-sm font-semibold",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-lg hover:shadow-xl transition-all hover:scale-105"
              )}
            >
              <Link href={banner.cta_link}>
                {banner.cta_text}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Image */}
        {banner.image_url && (
          <div className="relative w-[35%] sm:w-[40%] aspect-square -mr-2 sm:-mr-4">
            <Image
              src={banner.image_url}
              alt={banner.image_alt || banner.title}
              fill
              className="object-contain object-bottom-right drop-shadow-xl"
              sizes="(max-width: 640px) 35vw, 40vw"
            />
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-accent/20 blur-2xl" />
      <div className="absolute -top-4 right-1/4 w-20 h-20 rounded-full bg-accent/10 blur-xl" />
    </div>
  );
}
