"use client";

import type { Banner } from "@/lib/types";
import { HeroBanner } from "./hero-banner";
import { BannerSlider } from "./banner-slider";
import { InfoBanner } from "./info-banner";

interface BannerRendererProps {
  banners: Banner[];
  position: "hero" | "slider" | "info";
  className?: string;
}

export function BannerRenderer({
  banners,
  position,
  className,
}: BannerRendererProps) {
  const filteredBanners = banners.filter((b) => b.position === position);

  if (filteredBanners.length === 0) return null;

  if (position === "slider") {
    return <BannerSlider banners={filteredBanners} />;
  }

  if (position === "hero") {
    // If multiple hero banners, show as slider, otherwise show first
    if (filteredBanners.length > 1) {
      return <BannerSlider banners={filteredBanners} />;
    }
    return <HeroBanner banner={filteredBanners[0]} />;
  }

  if (position === "info") {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredBanners.map((banner) => (
          <InfoBanner key={banner.id} banner={banner} />
        ))}
      </div>
    );
  }

  return null;
}
