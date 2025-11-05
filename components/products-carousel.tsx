"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

interface ProductsCarouselProps {
  products: Product[]
  autoPlayInterval?: number
}

export function ProductsCarousel({ products, autoPlayInterval = 5000 }: ProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Calculate how many products to show based on screen size
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerView)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || products.length <= itemsPerView) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext, autoPlayInterval, products.length, itemsPerView])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  if (products.length === 0) {
    return (
      <div className="text-center py-12 glass-card rounded-lg">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Only show if there are more products than visible */}
      {products.length > itemsPerView && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 glass-card glass-hover opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
            aria-label="Producto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 glass-card glass-hover opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
            aria-label="Producto siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-accent animate-glow" : "w-2 glass-card hover:bg-accent/50"
              }`}
              aria-label={`Ir a grupo de productos ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && products.length > itemsPerView && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20 overflow-hidden rounded-b-lg">
          <div
            className="h-full bg-accent animate-progress"
            style={{
              animationDuration: `${autoPlayInterval}ms`,
            }}
          />
        </div>
      )}
    </div>
  )
}
