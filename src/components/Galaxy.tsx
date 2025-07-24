/**
 * 星系组件
 * 渲染不同类型的星系3D模型
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { GalaxyData } from '@/data/galaxyData'

interface GalaxyProps {
  galaxy: GalaxyData
  position: [number, number, number]
  rotation?: number
  onSelect: (galaxyId: string) => void
  showLabels: boolean
  scale?: number
}

/**
 * 创建螺旋星系粒子系统
 */
function createSpiralGalaxy(size: number, color: string, armCount: number = 4) {
  const particleCount = Math.floor(size * 100)
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  
  const baseColor = new THREE.Color(color)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 螺旋臂参数
    const armIndex = i % armCount
    const armAngle = (armIndex / armCount) * Math.PI * 2
    const spiralAngle = armAngle + (Math.random() * 0.3 - 0.15) // 添加随机性
    
    // 距离中心的距离
    const radius = Math.pow(Math.random(), 0.7) * size
    const spiralOffset = radius * 0.05 // 螺旋紧密度
    
    // 螺旋臂位置
    const angle = spiralAngle + spiralOffset
    const x = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4)
    const z = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4)
    const y = (Math.random() - 0.5) * size * 0.1 // 厚度
    
    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z
    
    // 颜色渐变：中心偏黄，外围偏蓝
    const distanceRatio = radius / size
    const centerColor = new THREE.Color('#FFEB3B')
    const edgeColor = baseColor.clone()
    const finalColor = centerColor.lerp(edgeColor, distanceRatio)
    
    colors[i3] = finalColor.r
    colors[i3 + 1] = finalColor.g
    colors[i3 + 2] = finalColor.b
    
    // 大小：中心大，边缘小
    scales[i] = Math.random() * (2 - distanceRatio) + 0.5
  }
  
  return { positions, colors, scales, count: particleCount }
}

/**
 * 创建椭圆星系粒子系统
 */
function createEllipticalGalaxy(size: number, color: string) {
  const particleCount = Math.floor(size * 80)
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  
  const baseColor = new THREE.Color(color)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 椭球分布
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = Math.pow(Math.random(), 0.5) * size
    
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta) * 0.6 // 椭圆形状
    const z = radius * Math.cos(phi)
    
    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z
    
    // 颜色：中心亮，边缘暗
    const distanceRatio = radius / size
    const centerColor = new THREE.Color('#FFF8DC')
    const edgeColor = baseColor.clone()
    const finalColor = centerColor.lerp(edgeColor, distanceRatio)
    
    colors[i3] = finalColor.r
    colors[i3 + 1] = finalColor.g
    colors[i3 + 2] = finalColor.b
    
    scales[i] = Math.random() * (1.5 - distanceRatio * 0.5) + 0.3
  }
  
  return { positions, colors, scales, count: particleCount }
}

/**
 * 创建不规则星系粒子系统
 */
function createIrregularGalaxy(size: number, color: string) {
  const particleCount = Math.floor(size * 60)
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  
  const baseColor = new THREE.Color(color)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // 不规则分布，使用多个随机中心
    const centerCount = 3 + Math.floor(Math.random() * 3)
    const centerIndex = Math.floor(Math.random() * centerCount)
    const centerAngle = (centerIndex / centerCount) * Math.PI * 2
    const centerOffset = size * 0.3
    
    const centerX = Math.cos(centerAngle) * centerOffset * Math.random()
    const centerZ = Math.sin(centerAngle) * centerOffset * Math.random()
    
    const localRadius = Math.pow(Math.random(), 0.3) * size * 0.8
    const angle = Math.random() * Math.PI * 2
    
    const x = centerX + Math.cos(angle) * localRadius
    const y = (Math.random() - 0.5) * size * 0.3
    const z = centerZ + Math.sin(angle) * localRadius
    
    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z
    
    // 颜色：混合蓝色和红色区域
    const regionColor = Math.random() > 0.6 ? 
      new THREE.Color('#FF6B6B') : // 红色恒星形成区
      baseColor.clone()
    
    colors[i3] = regionColor.r
    colors[i3 + 1] = regionColor.g
    colors[i3 + 2] = regionColor.b
    
    scales[i] = Math.random() * 1.5 + 0.5
  }
  
  return { positions, colors, scales, count: particleCount }
}

/**
 * 星系组件
 */
export default function Galaxy({ 
  galaxy, 
  position, 
  rotation = 0, 
  onSelect, 
  showLabels,
  scale = 1 
}: GalaxyProps) {
  const meshRef = useRef<THREE.Points>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  
  // 根据星系类型生成粒子数据
  const particleData = useMemo(() => {
    const size = galaxy.displaySize * scale
    
    switch (galaxy.type) {
      case 'spiral':
        return createSpiralGalaxy(size, galaxy.color, galaxy.id === 'whirlpool' ? 2 : 4)
      case 'elliptical':
        return createEllipticalGalaxy(size, galaxy.color)
      case 'irregular':
        return createIrregularGalaxy(size, galaxy.color)
      case 'dwarf':
        return createIrregularGalaxy(size * 0.5, galaxy.color)
      default:
        return createSpiralGalaxy(size, galaxy.color)
    }
  }, [galaxy, scale])
  
  // 星系旋转动画
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 不同类型星系的旋转速度不同
      const rotationSpeed = {
        'spiral': 0.1,
        'elliptical': 0.02,
        'irregular': 0.05,
        'dwarf': 0.08
      }[galaxy.type] || 0.1
      
      groupRef.current.rotation.y += delta * rotationSpeed * 0.1
      
      // 银河系特殊效果：脉动
      if (galaxy.id === 'milkyWay') {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
        groupRef.current.scale.setScalar(pulse)
      }
    }
  })
  
  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* 星系主体 */}
      <points 
        ref={meshRef}
        onClick={() => onSelect(galaxy.id)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleData.count}
            array={particleData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scale"
            count={particleData.count}
            array={particleData.scales}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* 星系光环效果 */}
      {galaxy.type === 'spiral' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[galaxy.displaySize * scale * 0.8, galaxy.displaySize * scale * 1.2, 32]} />
          <meshBasicMaterial 
            color={galaxy.color}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* 中心黑洞效果（大型星系） */}
      {(galaxy.type === 'spiral' || galaxy.type === 'elliptical') && galaxy.displaySize > 35 && (
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* 星系标签 */}
      {showLabels && (
        <Html
          position={[0, galaxy.displaySize * scale + 8, 0]}
          center
          distanceFactor={15}
          occlude={false}
        >
          <div className="bg-black/80 text-cyan-200 px-3 py-2 rounded-lg font-semibold border border-cyan-400/40 pointer-events-none whitespace-nowrap shadow-lg">
            <div className="text-base">{galaxy.name}</div>
            <div className="text-xs text-cyan-300 mt-1">
              {galaxy.distance} • {galaxy.type === 'spiral' ? '螺旋星系' : 
               galaxy.type === 'elliptical' ? '椭圆星系' : 
               galaxy.type === 'irregular' ? '不规则星系' : '矮星系'}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
