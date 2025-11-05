import { Laptop, Shirt, Home, Dumbbell, BookOpen, Gamepad2, type LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
}

interface CategoryIconProps {
  iconName: string
  className?: string
}

export function CategoryIcon({ iconName, className = "h-6 w-6" }: CategoryIconProps) {
  const Icon = iconMap[iconName] || Laptop
  return <Icon className={className} />
}
