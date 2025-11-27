"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroBanner({ banner }: { banner: Banner }) {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-xl sm:rounded-2xl group">
      {/* Background Image */}
      <Image
        src={banner.image_url}
        alt={banner.image_alt || banner.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50"
        style={{
          backgroundColor: banner.overlay_opacity
            ? `rgba(0,0,0,${banner.overlay_opacity})`
            : undefined,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
            style={{ color: banner.text_color }}
          >
            {banner.title}
          </h2>

          {banner.description && (
            <p
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl leading-relaxed"
              style={{
                color: banner.text_color ? `${banner.text_color}E6` : undefined,
              }}
            >
              {banner.description}
            </p>
          )}

          {banner.cta_text && banner.cta_link && (
            <Button
              asChild
              size="lg"
              className={cn(
                "rounded-full text-sm sm:text-base font-semibold px-6 sm:px-8 h-11 sm:h-12 transition-all hover:scale-105 shadow-lg",
                banner.cta_style === "outline"
                  ? "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                  : banner.cta_style === "secondary"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
            >
              <Link href={banner.cta_link}>
                {banner.cta_text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
