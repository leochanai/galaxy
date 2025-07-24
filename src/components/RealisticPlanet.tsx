/**
 * 逼真行星组件
 * 支持多层纹理、大气层、云层等高级视觉效果
 */

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PlanetMaterialFactory, PLANET_CONFIGS } from '@/lib/PlanetMaterials'

interface RealisticPlanetProps {
  planetId: string
  size: number
  position: [number, number, number]
  rotation?: [number, number, number]
  timeSpeed?: number
  onSelect?: () => void
}

export default function RealisticPlanet({ 
  planetId, 
  size, 
  position, 
  rotation = [0, 0, 0],
  timeSpeed = 1,
  onSelect 
}: RealisticPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null!)
  const atmosphereRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  
  const [materials, setMaterials] = useState<{
    planet?: THREE.MeshStandardMaterial
    atmosphere?: THREE.ShaderMaterial
    clouds?: THREE.MeshLambertMaterial
  }>({})
  
  const materialFactory = new PlanetMaterialFactory()
  const config = PLANET_CONFIGS[planetId]

  // 加载材质
  useEffect(() => {
    if (!config) return

    const loadMaterials = async () => {
      try {
        // 创建主要材质
        const planetMaterial = await materialFactory.createPlanetMaterial(config)
        const newMaterials: any = { planet: planetMaterial }

        // 创建大气层材质
        if (config.atmosphere) {
          const atmosphereMaterial = materialFactory.createAtmosphereMaterial(config)
          newMaterials.atmosphere = atmosphereMaterial
        }

        // 创建云层材质
        if (config.clouds && config.textures.clouds) {
          const cloudsMaterial = await materialFactory.createCloudMaterial(config)
          newMaterials.clouds = cloudsMaterial
        }

        setMaterials(newMaterials)
      } catch (error) {
        console.warn(`Failed to load materials for ${planetId}:`, error)
      }
    }

    loadMaterials()
  }, [planetId, config])

  // 动画更新
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime
    
    // 行星自转
    if (planetRef.current) {
      const rotationSpeed = getRotationSpeed(planetId)
      planetRef.current.rotation.y += delta * rotationSpeed * timeSpeed
      
      // 特殊倾斜角度
      if (planetId === 'uranus') {
        planetRef.current.rotation.z = Math.PI / 2
      }
    }

    // 云层动画
    if (cloudsRef.current && config.clouds) {
      cloudsRef.current.rotation.y += delta * config.clouds.speed * timeSpeed
    }

    // 大气层微妙动画
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.0005 * timeSpeed
    }

    // 地球昼夜循环效果
    if (planetId === 'earth' && materials.planet) {
      const dayNightCycle = Math.sin(time * 0.1) * 0.5 + 0.5
      if (materials.planet.emissiveIntensity !== undefined) {
        materials.planet.emissiveIntensity = 0.1 + dayNightCycle * 0.3
      }
    }
  })

  if (!config || !materials.planet) {
    // 降级渲染：使用简单材质
    return (
      <group ref={groupRef} position={position}>
        <mesh 
          ref={planetRef}
          onClick={onSelect}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
          rotation={rotation}
        >
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial 
            color={getPlanetColor(planetId)}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={position}>
      {/* 主行星 */}
      <mesh 
        ref={planetRef}
        material={materials.planet}
        onClick={onSelect}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
        rotation={rotation}
      >
        <sphereGeometry args={[size, 128, 128]} />
      </mesh>

      {/* 云层 */}
      {materials.clouds && config.clouds && (
        <mesh 
          ref={cloudsRef}
          material={materials.clouds}
          rotation={rotation}
        >
          <sphereGeometry args={[size * config.clouds.height, 64, 64]} />
        </mesh>
      )}

      {/* 大气层 */}
      {materials.atmosphere && config.atmosphere && (
        <mesh 
          ref={atmosphereRef}
          material={materials.atmosphere}
          rotation={rotation}
        >
          <sphereGeometry args={[size * config.atmosphere.height, 32, 32]} />
        </mesh>
      )}

      {/* 土星环系统 */}
      {planetId === 'saturn' && (
        <SaturnRings size={size} />
      )}
    </group>
  )
}

// 土星环组件
function SaturnRings({ size }: { size: number }) {
  const ringsRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.001
    }
  })

  const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 2.2, 64)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: '#FAD5A5',
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })

  return (
    <mesh ref={ringsRef} material={ringMaterial} rotation={[Math.PI / 2, 0, 0]}>
      <primitive object={ringGeometry} />
    </mesh>
  )
}

// 辅助函数
function getRotationSpeed(planetId: string): number {
  const speeds: Record<string, number> = {
    mercury: 0.1,
    venus: -0.05,    // 逆向自转
    earth: 0.2,
    mars: 0.18,
    jupiter: 0.4,    // 快速自转
    saturn: 0.35,
    uranus: 0.15,
    neptune: 0.16
  }
  return speeds[planetId] || 0.1
}

function getPlanetColor(planetId: string): string {
  const colors: Record<string, string> = {
    mercury: '#8C7853',
    venus: '#FFC649',
    earth: '#6B93D6',
    mars: '#CD5C5C',
    jupiter: '#D8CA9D',
    saturn: '#FAD5A5',
    uranus: '#4FD0E7',
    neptune: '#4B70DD'
  }
  return colors[planetId] || '#888888'
}