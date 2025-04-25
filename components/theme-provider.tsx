"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { brandColors, brandGradients } from "@/lib/brand-theme"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: typeof brandColors
  gradients: typeof brandGradients
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  colors: brandColors,
  gradients: brandGradients,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
    colors: brandColors,
    gradients: brandGradients,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
