"use client";

import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { HeroBanner } from "./hero-banner";
import type { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Autoplay effect
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  if (banners.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-xl sm:rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={banner.id}>
              <HeroBanner banner={banner} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={scrollPrev}
            aria-label="Banner anterior"
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={scrollNext}
            aria-label="Siguiente banner"
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </>
      )}
    </div>
  );
}
