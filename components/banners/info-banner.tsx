"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/types";

export function InfoBanner({ banner }: { banner: Banner }) {
  return (
    <div className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-muted/50 border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Image */}
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={banner.image_url}
            alt={banner.image_alt || banner.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 640px) 96px, 112px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
            {banner.title}
          </h3>
          {banner.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {banner.description}
            </p>
          )}
        </div>

        {/* Action */}
        {banner.cta_link && (
          <div className="shrink-0 self-end sm:self-center">
            <Link
              href={banner.cta_link}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:translate-x-1 hover:bg-accent hover:text-accent-foreground"
              aria-label={`Ver ${banner.title}`}
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
