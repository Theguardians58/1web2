'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MegaMenu } from './MegaMenu'
import { useCart } from '@/store/cart-store'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-light tracking-tight">
                Éclat
              </span>
              <span className="text-xs font-light tracking-widest text-muted-foreground">
                LINGERIE FINE
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onMouseEnter={() => setIsMenuOpen(true)}
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Collections
              </button>
              <a href="/shop" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                Shop
              </a>
              <a href="/about" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                About
              </a>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-colors hover:text-foreground/80 text-foreground/60"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <a href="/account" className="p-2 transition-colors hover:text-foreground/80 text-foreground/60" aria-label="Account">
              <User className="h-4 w-4" />
            </a>
            <button className="relative p-2 transition-colors hover:text-foreground/80 text-foreground/60" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mega Menu */}
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search collections, products..."
              className="w-full bg-transparent pl-10 pr-4 py-3 text-lg placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            >
              ESC
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
    }
