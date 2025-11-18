import { Laptop, Shirt, Home, Dumbbell, BookOpen, Gamepad2, type LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  electronica: Laptop,
  electronics: Laptop,
  shirt: Shirt,
  moda: Shirt,
  fashion: Shirt,
  home: Home,
  hogar: Home,
  house: Home,
  dumbbell: Dumbbell,
  deportes: Dumbbell,
  sports: Dumbbell,
  bookopen: BookOpen,
  libros: BookOpen,
  books: BookOpen,
  gamepad2: Gamepad2,
  juguetes: Gamepad2,
  toys: Gamepad2,
}

interface CategoryIconProps {
  iconName?: string | null
  className?: string
}

export function CategoryIcon({ iconName, className = "h-6 w-6" }: CategoryIconProps) {
  const key = iconName?.toLowerCase() ?? ""
  const Icon = iconMap[key] || Laptop
  return <Icon className={className} />
}
