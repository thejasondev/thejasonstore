"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/types";

export function InfoBanner({ banner }: { banner: Banner }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-muted/50 border border-border/50 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-6 p-6">
        {/* Image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={banner.image_url}
            alt={banner.image_alt || banner.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-lg">{banner.title}</h3>
          {banner.description && (
            <p className="text-muted-foreground text-sm">
              {banner.description}
            </p>
          )}
        </div>

        {/* Action */}
        {banner.cta_link && (
          <div className="shrink-0">
            <Link
              href={banner.cta_link}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:translate-x-1"
            >
              <ArrowRight className="h-5 w-5 text-accent" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
