import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "default" | "icon" | "stacked"
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ variant = "default", className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: variant === "icon" ? 32 : 120, height: variant === "icon" ? 32 : 40 },
    md: { width: variant === "icon" ? 48 : 180, height: variant === "icon" ? 48 : 60 },
    lg: { width: variant === "icon" ? 64 : 240, height: variant === "icon" ? 64 : 80 },
  }

  const src =
    variant === "icon"
      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aegisum%20Icon%20PNG-uds1NMjDw0SJEmOyHGyBsib78BiLg7.png"
      : variant === "stacked"
        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Variation%20Astronaut%20PNG-hNoqkPEBPRWSyqbVcVGWPbUdwWQBMX.png"
        : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aegisum%20Logo%20Astronaut%20PNG-u8nqs3CNfjoZid4jXVi94XEdKRtzF9.png"

  return (
    <div className={cn("relative", className)}>
      <Image
        src={src || "/placeholder.svg"}
        alt="Aegisum Logo"
        width={sizes[size].width}
        height={sizes[size].height}
        className="object-contain"
      />
    </div>
  )
}
