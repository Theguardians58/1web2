'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

interface ProductViewer3DProps {
  modelUrl: string
  fallbackImage: string
  className?: string
}

function Model({ url, isHovered }: { url: string; isHovered: boolean }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    // Subtle floating animation
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    
    // Enhanced effects on hover
    if (isHovered) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        Math.sin(state.clock.elapsedTime) * 0.05,
        0.1
      )
    }
  })

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
    </group>
  )
}

function Scene({ modelUrl, isHovered }: { modelUrl: string; isHovered: boolean }) {
  const { gl } = useThree()
  
  useEffect(() => {
    // Enhanced rendering for premium look
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 0.8
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#d6c27a"
      />
      
      <Suspense fallback={null}>
        <Model url={modelUrl} isHovered={isHovered} />
        <Environment preset="studio" />
      </Suspense>
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        minDistance={1.5}
        maxDistance={4}
      />
    </>
  )
}

export function ProductViewer3D({ modelUrl, fallbackImage, className = '' }: ProductViewer3DProps) {
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true)

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setIsWebGLAvailable(!!gl)
    } catch (e) {
      setIsWebGLAvailable(false)
    }
  }, [])

  if (!isWebGLAvailable) {
    return (
      <div className={`relative aspect-square ${className}`}>
        <img
          src={fallbackImage}
          alt="Product"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`relative aspect-square rounded-lg overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        shadows
        camera={{ position: [2, 2, 2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setIs3DLoaded(true)}
      >
        <Scene modelUrl={modelUrl} isHovered={isHovered} />
      </Canvas>
      
      {/* Loading overlay */}
      {!is3DLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  )
    }
