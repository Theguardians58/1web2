'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeScript />
      {children}
    </NextThemesProvider>
  )
}

// Prevents flash of unstyled content
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const media = window.matchMedia('(prefers-color-scheme: dark)')
            const systemTheme = media.matches ? 'dark' : 'light'
            const storedTheme = localStorage.getItem('theme')
            const theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : systemTheme
            
            document.documentElement.classList.toggle('dark', theme === 'dark')
          } catch (e) {}
        `,
      }}
    />
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
      }
