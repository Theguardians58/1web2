'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

interface CometCursorProps {
  enabled?: boolean
}

export function CometCursor({ enabled = true }: CometCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  
  const particleConfig = { damping: 30, stiffness: 500 }
  const particleX = useSpring(mouseX, particleConfig)
  const particleY = useSpring(mouseY, particleConfig)

  const createParticles = useCallback(() => {
    if (!cursorRef.current) return
    
    const particles = Array.from({ length: 12 }, (_, i) => {
      const particle = document.createElement('div')
      particle.className = `absolute w-1 h-1 rounded-full bg-foreground/20 pointer-events-none transition-opacity duration-300 ${
        i % 3 === 0 ? 'blur-sm' : ''
      }`
      cursorRef.current?.appendChild(particle)
      return particle
    })
    
    particlesRef.current = particles
  }, [])

  const updateCursor = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    
    // Update particle trail with staggered delay
    particlesRef.current.forEach((particle, index) => {
      const delay = index * 30
      setTimeout(() => {
        const x = e.clientX - 2
        const y = e.clientY - 2
        particle.style.transform = `translate(${x}px, ${y}px)`
        particle.style.opacity = '1'
        
        // Fade out
        setTimeout(() => {
          particle.style.opacity = '0'
        }, 200)
      }, delay)
    })
  }, [mouseX, mouseY])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return
    updateCursor(e)
  }, [enabled, updateCursor])

  const handleMouseLeave = useCallback(() => {
    cursorRef.current?.style.setProperty('opacity', '0')
  }, [])

  const handleMouseEnter = useCallback(() => {
    cursorRef.current?.style.setProperty('opacity', '1')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !enabled) return

    createParticles()
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    // Hide cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      cursorRef.current?.style.setProperty('display', 'none')
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      
      particlesRef.current.forEach(particle => particle.remove())
    }
  }, [enabled, createParticles, handleMouseMove, handleMouseLeave, handleMouseEnter])

  if (typeof window === 'undefined') return null

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !enabled) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[9999] mix-blend-difference opacity-0 transition-opacity duration-300"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      <div className="w-4 h-4 rounded-full bg-foreground/80 backdrop-blur-sm transform scale-100 transition-transform duration-150" />
    </div>
  )
    }
