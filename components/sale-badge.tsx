import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { calculateDiscountPercentage } from "@/lib/utils/discount-utils";

interface SaleBadgeProps {
  originalPrice: number;
  salePrice: number;
  variant?: "corner" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SaleBadge({
  originalPrice,
  salePrice,
  variant = "corner",
  size = "md",
  className,
}: SaleBadgeProps) {
  const discountPercentage = calculateDiscountPercentage(
    originalPrice,
    salePrice
  );

  if (discountPercentage <= 0) return null;

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const variantClasses = {
    corner: "absolute top-2 right-2 z-20",
    inline: "relative",
  };

  return (
    <Badge
      className={cn(
        "bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold border-none shadow-lg",
        "animate-pulse hover:animate-none transition-all",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      -{discountPercentage}%
    </Badge>
  );
}
