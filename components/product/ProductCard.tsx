'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import { useMagnetic } from '@/hooks/useMagnetic'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  description?: string
  inStock: boolean
  variants?: Array<{
    id: string
    name: string
    color: string
  }>
}

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const magneticProps = useMagnetic()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-card border border-border">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </Link>
          
          {/* Overlay Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            className="absolute top-4 right-4 flex flex-col gap-2"
          >
            <motion.button
              {...magneticProps}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full backdrop-blur-sm border transition-colors ${
                isWishlisted 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                  : 'bg-background/80 border-border/50 text-foreground/60 hover:text-foreground'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              {...magneticProps}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-foreground/5 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0
              }}
            >
              <Link href={`/product/${product.id}`}>
                <motion.button
                  {...magneticProps}
                  className="px-6 py-3 bg-background text-foreground rounded-full border border-border backdrop-blur-sm font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Quick View
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-foreground/90 group-hover:text-foreground transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-light">
              ${product.price.toFixed(2)}
            </span>
            
            {!product.inStock && (
              <span className="text-xs text-muted-foreground/70 uppercase tracking-wide">
                Out of Stock
              </span>
            )}
          </div>

          {/* Color Variants */}
          {product.variants && product.variants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                height: isHovered ? 'auto' : 0
              }}
              className="flex gap-1 pt-2 overflow-hidden"
            >
              {product.variants.slice(0, 4).map((variant) => (
                <div
                  key={variant.id}
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: variant.color }}
                  title={variant.name}
                />
              ))}
              {product.variants.length > 4 && (
                <div className="w-3 h-3 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-[8px] text-muted-foreground">
                    +{product.variants.length - 4}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
  }
