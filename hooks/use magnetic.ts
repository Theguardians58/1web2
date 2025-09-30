'use client'

import { useRef, useCallback } from 'react'
import { useMotionValue, useSpring, animate } from 'framer-motion'

interface MagneticConfig {
  distance?: number
  intensity?: number
}

export function useMagnetic({ distance = 80, intensity = 0.5 }: MagneticConfig = {}) {
  const ref = useRef<HTMLElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 300 }
  const translateX = useSpring(x, springConfig)
  const translateY = useSpring(y, springConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    const absDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
    
    if (absDistance < distance) {
      const force = (1 - absDistance / distance) * intensity
      x.set(distanceX * force)
      y.set(distanceY * force)
    } else {
      x.set(0)
      y.set(0)
    }
  }, [distance, intensity, x, y])

  const handleMouseLeave = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 15 })
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 15 })
  }, [x, y])

  return {
    ref,
    style: {
      x: translateX,
      y: translateY,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }
}
