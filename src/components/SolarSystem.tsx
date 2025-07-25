/**
 * 3D太阳系组件
 * 使用Three.js渲染太阳系场景，支持行星交互
 */

import { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { satelliteDatabase, planetSatellites, SatelliteData } from '@/data/satelliteData'
import { galaxyDatabase, galaxyPositions } from '@/data/galaxyData'
import Galaxy from './Galaxy'
import RealisticPlanet from './RealisticPlanet'

/**
 * 太阳系组件属性接口
 */
interface SolarSystemProps {
  timeSpeed: number
  showOrbits: boolean
  showLabels: boolean
  realScale: boolean
  starBackground: boolean
  trailType: string
  trailLength: number
  trailIntensity: number
  isPlaying: boolean
  onPlanetSelect?: (planetId: string) => void
  viewMode: 'solar-system' | 'galaxy-cluster'
  realisticRendering?: boolean  // 新增：逼真渲染开关
  setIsPlaying?: (playing: boolean) => void  // 新增：控制播放状态
  resetViewTrigger?: number  // 新增：重置视图触发器
}

/**
 * 相机缩放状态接口
 */
interface CameraState {
  target: string | null
  targetPosition: THREE.Vector3
  targetLookAt: THREE.Vector3
  isZooming: boolean
}

/**
 * 行星数据接口
 */
interface PlanetInfo {
  id: string
  name: string
  color: string
  size: number
  distance: number
  speed: number
  realDistance: number
}

/**
 * 行星纹理映射
 */
const planetTextures: Record<string, string> = {
  mercury: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/e230a949-80f7-4b5f-8873-07d4435fdc63.jpg',
  venus: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/35df7be2-2bd0-488a-b707-c9c8d53ee94e.jpg',
  earth: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/ba723abf-0b0b-4422-b5eb-c7c9bff7e4d3.jpg',
  earthClouds: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/80729344-8104-4eb4-8763-bd5563870df6.jpg',
  mars: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/2bd1fe45-e77d-4223-8a6d-7e2282a2987d.jpg',
  jupiter: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/d4fb7a80-6671-4e98-827c-c4ae034cfc81.jpg',
  saturn: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/b15767d9-7bdc-45d1-aca9-7d3b1cc4e80f.jpg',
  saturnRings: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/482e7e72-d395-4391-80e4-2d3fa0df7cdd.jpg',
  uranus: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/dec98ad3-a8bd-4021-b594-1e6bf0cf8777.jpg',
  neptune: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/52072f6e-b04e-460b-9e01-a7d4924590c8.jpg',
  sun: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/7022a00e-a187-4438-8fe1-7ac91afe8fb8.jpg',
  moon: 'https://pub-cdn.sider.ai/u/U07GHKK2X0/web-coder/6880a562a51c7347d089421d/resource/88224ba1-b70b-47a6-9497-142e94385836.jpg'
}

/**
 * 纹理加载器 - 全局单例，避免重复创建
 */
const textureLoader = new THREE.TextureLoader()

/**
 * 预加载所有纹理到缓存
 */
const loadedTextures: Record<string, THREE.Texture> = {}

/**
 * 预加载所有纹理到缓存
 */
const preloadTextures = () => {
  Object.entries(planetTextures).forEach(([key, url]) => {
    if (!loadedTextures[key]) {
      try {
        loadedTextures[key] = textureLoader.load(url, 
          // onLoad
          (texture) => {
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.flipY = false
          },
          // onProgress
          undefined,
          // onError
          (error) => {
            console.warn(`Failed to load texture ${key}:`, error)
            delete loadedTextures[key]
          }
        )
      } catch (error) {
        console.warn(`Error creating texture ${key}:`, error)
      }
    }
  })
}

/**
 * 宇宙尘埃效果组件
 */
function CosmicDust() {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 5000
  
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 随机分布在大空间中
      positions[i3] = (Math.random() - 0.5) * 500
      positions[i3 + 1] = (Math.random() - 0.5) * 200
      positions[i3 + 2] = (Math.random() - 0.5) * 500
      
      // 缓慢漂移
      velocities[i3] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001
      
      // 尘埃颜色（灰白到淡蓝）
      const dustType = Math.random()
      colors[i3] = 0.8 + dustType * 0.2     // R
      colors[i3 + 1] = 0.8 + dustType * 0.2 // G
      colors[i3 + 2] = 0.9 + dustType * 0.1 // B
      
      // 尺寸变化
      sizes[i] = 0.02 + Math.random() * 0.08
    }
    
    return { positions, velocities, colors, sizes }
  }, [particleCount])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // 缓慢漂移运动
        positions[i3] += velocities[i3] + Math.sin(time * 0.1 + i * 0.01) * 0.0005
        positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.08 + i * 0.01) * 0.0005
        positions[i3 + 2] += velocities[i3 + 2] + Math.sin(time * 0.12 + i * 0.01) * 0.0005
        
        // 循环边界
        if (positions[i3] > 250) positions[i3] = -250
        if (positions[i3] < -250) positions[i3] = 250
        if (positions[i3 + 1] > 100) positions[i3 + 1] = -100
        if (positions[i3 + 1] < -100) positions[i3 + 1] = 100
        if (positions[i3 + 2] > 250) positions[i3 + 2] = -250
        if (positions[i3 + 2] < -250) positions[i3 + 2] = 250
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * 星云背景效果组件
 */
function Nebula() {
  const cloudRef = useRef<THREE.Mesh>(null!)
  const cloud2Ref = useRef<THREE.Mesh>(null!)
  const cloud3Ref = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // 星云缓慢旋转和脉动
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0005
      cloudRef.current.rotation.z += 0.0003
    }
    
    if (cloud2Ref.current) {
      cloud2Ref.current.rotation.y -= 0.0003
      cloud2Ref.current.rotation.x += 0.0002
    }
    
    if (cloud3Ref.current) {
      cloud3Ref.current.rotation.z += 0.0008
      cloud3Ref.current.rotation.x -= 0.0004
    }
  })
  
  return (
    <group>
      {/* 紫色星云 */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[400, 16, 16]} />
        <primitive object={createSafeBasicMaterial({
          color: '#6A5ACD',
          transparent: true,
          opacity: 0.015,
          side: THREE.BackSide
        })} />
      </mesh>
      
      {/* 粉色星云 */}
      <mesh ref={cloud2Ref} position={[200, -100, -150]}>
        <sphereGeometry args={[300, 16, 16]} />
        <primitive object={createSafeBasicMaterial({
          color: '#FF69B4',
          transparent: true,
          opacity: 0.01,
          side: THREE.BackSide
        })} />
      </mesh>
      
      {/* 蓝色星云 */}
      <mesh ref={cloud3Ref} position={[-150, 80, 200]}>
        <sphereGeometry args={[250, 16, 16]} />
        <primitive object={createSafeBasicMaterial({
          color: '#00BFFF',
          transparent: true,
          opacity: 0.012,
          side: THREE.BackSide
        })} />
      </mesh>
      
      {/* 远景星云带 */}
      <group>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, i * Math.PI / 6]}>
            <torusGeometry args={[350 + i * 50, 20, 8, 32]} />
            <primitive object={createSafeBasicMaterial({
              color: `hsl(${240 + i * 15}, 70%, 60%)`,
              transparent: true,
              opacity: 0.008
            })} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/**
 * LOD几何体管理器
 */
class GeometryManager {
  private static sphereGeometries: Record<string, THREE.SphereGeometry> = {}
  private static ringGeometries: Record<string, THREE.RingGeometry> = {}

  static getSphereGeometry(radius: number, distance: number): THREE.SphereGeometry {
    // 根据距离确定LOD级别
    const lodLevel = distance > 200 ? 'low' : distance > 100 ? 'medium' : 'high'
    const segments = lodLevel === 'low' ? 16 : lodLevel === 'medium' ? 32 : 64
    
    const key = `sphere_${radius.toFixed(2)}_${segments}`
    if (!this.sphereGeometries[key]) {
      this.sphereGeometries[key] = new THREE.SphereGeometry(radius, segments, segments)
    }
    return this.sphereGeometries[key]
  }

  static getRingGeometry(innerRadius: number, outerRadius: number, distance: number): THREE.RingGeometry {
    const lodLevel = distance > 200 ? 'low' : distance > 100 ? 'medium' : 'high'
    const segments = lodLevel === 'low' ? 16 : lodLevel === 'medium' ? 32 : 64
    
    const key = `ring_${innerRadius.toFixed(2)}_${outerRadius.toFixed(2)}_${segments}`
    if (!this.ringGeometries[key]) {
      this.ringGeometries[key] = new THREE.RingGeometry(innerRadius, outerRadius, segments)
    }
    return this.ringGeometries[key]
  }

  static cleanup() {
    // 清理几何体缓存
    Object.values(this.sphereGeometries).forEach(geo => geo.dispose())
    Object.values(this.ringGeometries).forEach(geo => geo.dispose())
    this.sphereGeometries = {}
    this.ringGeometries = {}
  }
}

/**
 * 行星数据配置
 */
const planetData: PlanetInfo[] = [
  { id: 'mercury', name: '水星', color: '#8C7853', size: 0.4, distance: 8, speed: 4.15, realDistance: 12 },
  { id: 'venus', name: '金星', color: '#FFC649', size: 0.9, distance: 12, speed: 1.62, realDistance: 18 },
  { id: 'earth', name: '地球', color: '#6B93D6', size: 1, distance: 16, speed: 1, realDistance: 25 },
  { id: 'mars', name: '火星', color: '#C1440E', size: 0.5, distance: 22, speed: 0.53, realDistance: 32 },
  { id: 'jupiter', name: '木星', color: '#D8CA9D', size: 2.5, distance: 35, speed: 0.084, realDistance: 60 },
  { id: 'saturn', name: '土星', color: '#FAD5A5', size: 2.1, distance: 45, speed: 0.034, realDistance: 80 },
  { id: 'uranus', name: '天王星', color: '#4FD0E3', size: 1.6, distance: 55, speed: 0.012, realDistance: 100 },
  { id: 'neptune', name: '海王星', color: '#4B70DD', size: 1.5, distance: 65, speed: 0.006, realDistance: 120 }
]

/**
 * 获取纹理的函数，确保纹理只加载一次
 */
function getTexture(key: string): THREE.Texture | null {
  // 如果纹理已存在，直接返回
  if (loadedTextures[key]) {
    return loadedTextures[key]
  }
  
  // 如果纹理URL不存在，返回null
  if (!planetTextures[key]) {
    return null
  }
  
  // 创建新纹理
  try {
    const texture = textureLoader.load(
      planetTextures[key],
      // onLoad
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.RepeatWrapping
        loadedTexture.flipY = false
      },
      // onProgress
      undefined,
      // onError
      (error) => {
        console.warn(`Failed to load texture for ${key}:`, error)
        delete loadedTextures[key]
      }
    )
    
    loadedTextures[key] = texture
    return texture
  } catch (error) {
    console.warn(`Error creating texture for ${key}:`, error)
    return null
  }
}

/**
 * 创建安全的标准材质
 */
function createSafeMaterial(options: {
  textureKey?: string
  color?: string
  roughness?: number
  metalness?: number
  emissive?: string
  emissiveIntensity?: number
  transparent?: boolean
  opacity?: number
} = {}) {
  const material = new THREE.MeshStandardMaterial({
    color: options.color || '#ffffff',
    roughness: options.roughness ?? 0.7,
    metalness: options.metalness ?? 0.1,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
  })
  
  // 设置发光属性
  if (options.emissive) {
    material.emissive = new THREE.Color(options.emissive)
    material.emissiveIntensity = options.emissiveIntensity ?? 0.1
  }
  
  // 设置纹理
  if (options.textureKey) {
    const texture = getTexture(options.textureKey)
    if (texture) {
      material.map = texture
      material.needsUpdate = true
    }
  }
  
  return material
}

/**
 * 创建安全的基础材质
 */
function createSafeBasicMaterial(options: {
  color?: string
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
  blending?: THREE.Blending
  textureKey?: string
} = {}) {
  const material = new THREE.MeshBasicMaterial({
    color: options.color || '#ffffff',
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    side: options.side ?? THREE.FrontSide,
    blending: options.blending ?? THREE.NormalBlending,
  })
  
  // 设置纹理
  if (options.textureKey) {
    const texture = getTexture(options.textureKey)
    if (texture) {
      material.map = texture
      material.needsUpdate = true
    }
  }
  
  return material
}

/**
 * 太阳风粒子系统组件
 */
function SolarWind({ sunSize }: { sunSize: number }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 8000
  
  // 创建太阳风粒子系统
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 从太阳表面开始
      const radius = sunSize * (1.1 + Math.random() * 0.2)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) 
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // 径向速度（向外扩散）
      const speed = 0.02 + Math.random() * 0.03
      const direction = new THREE.Vector3(
        positions[i3], positions[i3 + 1], positions[i3 + 2]
      ).normalize()
      
      velocities[i3] = direction.x * speed
      velocities[i3 + 1] = direction.y * speed
      velocities[i3 + 2] = direction.z * speed
      
      // 太阳风色彩（蓝白色高能粒子）
      const energy = Math.random()
      colors[i3] = 0.3 + energy * 0.7        // R
      colors[i3 + 1] = 0.5 + energy * 0.5    // G  
      colors[i3 + 2] = 0.8 + energy * 0.2    // B
      
      // 粒子大小
      sizes[i] = 0.05 + Math.random() * 0.1
    }
    
    return { positions, velocities, colors, sizes }
  }, [particleCount, sunSize])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // 粒子向外运动
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]
        
        // 计算距离太阳中心的距离
        const distance = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        )
        
        // 根据距离调整透明度和颜色
        const fadeRatio = Math.max(0, 1 - (distance - sunSize) / (sunSize * 20))
        colors[i3] = (0.3 + Math.random() * 0.7) * fadeRatio
        colors[i3 + 1] = (0.5 + Math.random() * 0.5) * fadeRatio
        colors[i3 + 2] = (0.8 + Math.random() * 0.2) * fadeRatio
        
        // 重置超出范围的粒子
        if (distance > sunSize * 25) {
          const radius = sunSize * (1.1 + Math.random() * 0.2)
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[i3 + 2] = radius * Math.cos(phi)
          
          // 重新计算速度
          const speed = 0.02 + Math.random() * 0.03
          const direction = new THREE.Vector3(
            positions[i3], positions[i3 + 1], positions[i3 + 2]
          ).normalize()
          
          velocities[i3] = direction.x * speed
          velocities[i3 + 1] = direction.y * speed
          velocities[i3 + 2] = direction.z * speed
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * 太阳表面等离子体效果
 */
function SunPlasma({ sunSize }: { sunSize: number }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 3000
  
  // 创建等离子体粒子系统
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 太阳表面附近
      const radius = sunSize * (0.95 + Math.random() * 0.15)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) 
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // 等离子体对流运动
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01
      
      // 等离子体颜色（橙红到白热）
      const heat = Math.random()
      colors[i3] = 1.0                    // R
      colors[i3 + 1] = 0.2 + heat * 0.8   // G
      colors[i3 + 2] = heat * 0.3          // B
    }
    
    return { positions, velocities, colors }
  }, [particleCount, sunSize])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        
        // 等离子体对流运动
        const turbulence = Math.sin(time * 2 + i * 0.1) * 0.002
        positions[i3] += velocities[i3] + turbulence
        positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 1.5 + i * 0.1) * 0.002
        positions[i3 + 2] += velocities[i3 + 2] + turbulence
        
        // 动态颜色变化（模拟温度变化）
        const flicker = 0.8 + Math.sin(time * 3 + i * 0.2) * 0.2
        colors[i3] = flicker                         // R
        colors[i3 + 1] = (0.2 + Math.random() * 0.8) * flicker  // G
        colors[i3 + 2] = Math.random() * 0.3 * flicker          // B
        
        // 保持粒子在太阳表面附近
        const distance = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        )
        
        if (distance > sunSize * 1.2 || distance < sunSize * 0.9) {
          const radius = sunSize * (0.95 + Math.random() * 0.15)
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[i3 + 2] = radius * Math.cos(phi)
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * 卫星组件
 */
function Satellite({
  satellite,
  planetPosition,
  timeSpeed,
  showOrbits,
  showLabels,
  isPlaying,
  onSelect,
  realScale
}: {
  satellite: SatelliteData
  planetPosition: THREE.Vector3
  timeSpeed: number
  showOrbits: boolean
  showLabels: boolean
  isPlaying: boolean
  onSelect: (id: string) => void
  realScale: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const orbitRef = useRef<THREE.Group>(null!)
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2)

  // 真实比例下调整卫星参数
  const satelliteDistance = realScale ? satellite.distance * 0.3 : satellite.distance
  const satelliteSize = realScale ? satellite.size * 0.5 : satellite.size

  useFrame((state, delta) => {
    if (!isPlaying) return
    
    const newAngle = angle + delta * satellite.speed * timeSpeed * 0.1
    setAngle(newAngle)
    
    const newX = planetPosition.x + Math.cos(newAngle) * satelliteDistance
    const newZ = planetPosition.z + Math.sin(newAngle) * satelliteDistance
    
    if (orbitRef.current) {
      orbitRef.current.position.x = newX
      orbitRef.current.position.z = newZ
    }
  })

  return (
    <group>
      {/* 卫星轨道 */}
      {showOrbits && (
        <line position={[planetPosition.x, 0, planetPosition.z]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={32}
              array={new Float32Array(
                Array.from({ length: 32 }, (_, i) => {
                  const angle = (i / 32) * Math.PI * 2
                  return [
                    Math.cos(angle) * satelliteDistance,
                    0,
                    Math.sin(angle) * satelliteDistance
                  ]
                }).flat()
              )}
              itemSize={3}
              needsUpdate={true}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={satellite.color} 
            opacity={satellite.id === 'callisto' ? 0.6 : 0.4} 
            transparent 
          />
        </line>
      )}
      
      {/* 卫星主体 */}
      <group ref={orbitRef}>
        <mesh 
          ref={meshRef}
          onClick={() => onSelect(satellite.id)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <sphereGeometry args={[satelliteSize, 32, 32]} />
          <primitive object={createSafeMaterial({
            textureKey: 'moon',
            roughness: 0.8,
            metalness: 0.1
          })} />
        </mesh>
        
        {/* 卫星标签 */}
        {showLabels && (
          <Html
            position={[0, satelliteSize + 0.8, 0]}
            center
            distanceFactor={8}
            occlude={false}
          >
            <div className="bg-black/80 text-cyan-200 px-2 py-1 rounded text-sm font-semibold border border-cyan-400/40 pointer-events-none whitespace-nowrap shadow-lg">
              {satellite.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

/**
 * 行星组件
 */
function Planet({ 
  planet, 
  timeSpeed, 
  showOrbits, 
  showLabels, 
  realScale, 
  isPlaying, 
  onSelect,
  trailType,
  trailLength,
  trailIntensity,
  cameraDistance,
  realisticRendering,
  onPositionUpdate
}: {
  planet: PlanetInfo
  timeSpeed: number
  showOrbits: boolean
  showLabels: boolean
  realScale: boolean
  isPlaying: boolean
  onSelect: (id: string) => void
  trailType: string
  trailLength: number
  trailIntensity: number
  cameraDistance: number
  realisticRendering?: boolean
  onPositionUpdate?: (planetId: string, position: THREE.Vector3) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const orbitRef = useRef<THREE.Group>(null!)
  const orbitGeometryRef = useRef<THREE.BufferGeometry>(null!)
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2)
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([])
  
  const distance = realScale ? planet.realDistance : planet.distance
  const size = realScale ? planet.size * 0.5 : planet.size

  // 当距离变化时更新轨道几何体
  useEffect(() => {
    if (orbitGeometryRef.current) {
      const positions = new Float32Array(
        Array.from({ length: 64 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2
          return [
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
          ]
        }).flat()
      )
      orbitGeometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      orbitGeometryRef.current.attributes.position.needsUpdate = true
    }
  }, [distance])

  useFrame((state, delta) => {
    if (!isPlaying) return
    
    const newAngle = angle + delta * planet.speed * timeSpeed * 0.1
    setAngle(newAngle)
    
    const newX = Math.cos(newAngle) * distance
    const newZ = Math.sin(newAngle) * distance
    
    if (orbitRef.current) {
      orbitRef.current.position.x = newX
      orbitRef.current.position.z = newZ
      
      // 回调位置更新给父组件
      if (onPositionUpdate) {
        onPositionUpdate(planet.id, new THREE.Vector3(newX, 0, newZ))
      }
      
      // 更新拖尾位置
      if (trailType !== 'none') {
        setTrailPositions(prev => {
          const newPos = new THREE.Vector3(newX, 0, newZ)
          const newTrail = [newPos, ...prev].slice(0, Math.floor(trailLength))
          return newTrail
        })
      }
    }
    
    // 行星自转动画
    if (meshRef.current) {
      // 根据行星类型设置不同的自转速度
      const rotationSpeed = {
        'mercury': 0.1,
        'venus': -0.05, // 金星逆向自转
        'earth': 0.2,
        'mars': 0.18,
        'jupiter': 0.4, // 木星自转很快
        'saturn': 0.35,
        'uranus': 0.15,
        'neptune': 0.16
      }[planet.id] || 0.1
      
      meshRef.current.rotation.y += delta * rotationSpeed * timeSpeed
      
      // 天王星特殊倾斜
      if (planet.id === 'uranus') {
        meshRef.current.rotation.z = Math.PI / 2
      }
    }
  })

  // 渲染不同类型的拖尾
  const renderTrail = () => {
    if (trailType === 'none' || trailPositions.length < 2) return null

    const positions = new Float32Array(trailPositions.length * 3)
    trailPositions.forEach((pos, i) => {
      positions[i * 3] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z
    })

    const opacity = trailIntensity / 100

    switch (trailType) {
      case 'classic':
        // 虚线效果 - 使用点来模拟虚线
        return (
          <group>
            {trailPositions.filter((_, i) => i % 3 === 0).map((pos, i) => (
              <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.08, 6, 6]} />
                <meshBasicMaterial 
                  color={planet.color} 
                  opacity={opacity * (1 - i * 3 / trailPositions.length)} 
                  transparent 
                />
              </mesh>
            ))}
          </group>
        )
      
      case 'glow':
        // 发光流 - 使用多层小球模拟发光线条
        return (
          <group>
            {/* 外层发光 */}
            {trailPositions.map((pos, i) => (
              <mesh key={`outer-${i}`} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial 
                  color={planet.color} 
                  opacity={opacity * 0.3 * (1 - i / trailPositions.length)} 
                  transparent 
                />
              </mesh>
            ))}
            {/* 内层核心 */}
            {trailPositions.map((pos, i) => (
              <mesh key={`inner-${i}`} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial 
                  color={planet.color} 
                  opacity={opacity * 0.8 * (1 - i / trailPositions.length)} 
                  transparent 
                />
              </mesh>
            ))}
          </group>
        )
      
      case 'particle':
        // 粒子效果
        return (
          <group>
            {trailPositions.slice(0, -1).map((pos, i) => (
              <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial 
                  color={planet.color} 
                  opacity={opacity * (1 - i / trailPositions.length)} 
                  transparent 
                />
              </mesh>
            ))}
          </group>
        )
      
      case 'meteor':
        // 流星尾 - 椭圆形拖尾效果
        return (
          <group>
            {trailPositions.map((pos, i) => {
              const fadeRatio = 1 - i / trailPositions.length
              const size = 0.1 * fadeRatio // 从大到小
              return (
                <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                  <sphereGeometry args={[size, 8, 8]} />
                  <meshBasicMaterial 
                    color={planet.color} 
                    opacity={opacity * 0.9 * fadeRatio} 
                    transparent 
                  />
                </mesh>
              )
            })}
          </group>
        )
      
      case 'rainbow':
        // 彩虹光 - 使用渐变颜色的小球
        return (
          <group>
            {trailPositions.slice(0, -1).map((pos, i) => {
              const hue = (i / trailPositions.length) * 360
              const color = `hsl(${hue}, 100%, 50%)`
              return (
                <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                  <meshBasicMaterial 
                    color={color} 
                    opacity={opacity * (1 - i / trailPositions.length)} 
                    transparent 
                  />
                </mesh>
              )
            })}
          </group>
        )
      
      case 'solid':
        // 实线 - 密集小球形成连续实线
        return (
          <group>
            {trailPositions.map((pos, i) => (
              <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial 
                  color={planet.color} 
                  opacity={opacity * (1 - i / trailPositions.length)} 
                  transparent 
                />
              </mesh>
            ))}
          </group>
        )
      
      default:
        return null
    }
  }

  // 渲染特定星球的组件
  const renderPlanet = () => {
    const planetProps = {
      onClick: () => onSelect(planet.id),
      onPointerOver: () => document.body.style.cursor = 'pointer',
      onPointerOut: () => document.body.style.cursor = 'auto'
    }
    
    // 如果开启逼真渲染，使用新的RealisticPlanet组件
    if (realisticRendering) {
      return (
        <RealisticPlanet
          planetId={planet.id}
          size={size}
          position={[0, 0, 0]}
          timeSpeed={timeSpeed}
          onSelect={() => onSelect(planet.id)}
        />
      )
    }
    
    switch (planet.id) {
      case 'mercury':
        return (
          <mesh ref={meshRef} {...planetProps}>
            <sphereGeometry args={[size, 64, 64]} />
            <primitive object={createSafeMaterial({
              textureKey: 'mercury',
              roughness: 0.8,
              metalness: 0.1
            })} />
          </mesh>
        )
        
      case 'venus':
        return (
          <group>
            {/* 金星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'venus',
                emissive: '#FFB000',
                emissiveIntensity: 0.1,
                roughness: 0.8,
                metalness: 0.1
              })} />
            </mesh>
            {/* 大气层 */}
            <mesh>
              <sphereGeometry args={[size * 1.05, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#FFDC80',
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
              })} />
            </mesh>
          </group>
        )
        
      case 'earth':
        return (
          <group>
            {/* 地球主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'earth',
                roughness: 0.7,
                metalness: 0.1
              })} />
            </mesh>
            {/* 动态云层 */}
            <mesh>
              <sphereGeometry args={[size * 1.02, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                textureKey: 'earthClouds',
                transparent: true,
                opacity: 0.5
              })} />
            </mesh>
            {/* 大气散射层1 - 蓝色 */}
            <mesh>
              <sphereGeometry args={[size * 1.05, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#4169E1',
                transparent: true,
                opacity: 0.25,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 大气散射层2 - 天蓝色 */}
            <mesh>
              <sphereGeometry args={[size * 1.08, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#87CEEB',
                transparent: true,
                opacity: 0.15,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 外层大气 - 淡蓝色 */}
            <mesh>
              <sphereGeometry args={[size * 1.12, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#B0E0E6',
                transparent: true,
                opacity: 0.08,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 极光效果 */}
            <group>
              {Array.from({ length: 4 }, (_, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 2]} position={[0, 0, 0]}>
                  <ringGeometry args={[size * 1.15, size * 1.25, 16]} />
                  <primitive object={createSafeBasicMaterial({
                    color: i % 2 === 0 ? '#00FF7F' : '#FF1493',
                    transparent: true,
                    opacity: 0.1,
                    blending: THREE.AdditiveBlending
                  })} />
                </mesh>
              ))}
            </group>
          </group>
        )
        
      case 'mars':
        return (
          <group>
            {/* 火星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'mars',
                roughness: 0.9,
                metalness: 0.05
              })} />
            </mesh>
            {/* 稀薄大气 */}
            <mesh>
              <sphereGeometry args={[size * 1.03, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#FFB347',
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 火星沙尘暴效果 */}
            <mesh>
              <sphereGeometry args={[size * 1.06, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#CD853F',
                transparent: true,
                opacity: 0.06,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 极地冰帽发光 */}
            <group>
              <mesh position={[0, size * 0.9, 0]}>
                <sphereGeometry args={[size * 0.2, 16, 16]} />
                <primitive object={createSafeBasicMaterial({
                  color: '#F0F8FF',
                  transparent: true,
                  opacity: 0.8
                })} />
              </mesh>
              <mesh position={[0, -size * 0.9, 0]}>
                <sphereGeometry args={[size * 0.15, 16, 16]} />
                <primitive object={createSafeBasicMaterial({
                  color: '#F0F8FF',
                  transparent: true,
                  opacity: 0.7
                })} />
              </mesh>
            </group>
          </group>
        )
        
      case 'jupiter':
        return (
          <group>
            {/* 木星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'jupiter',
                roughness: 0.6,
                metalness: 0.1
              })} />
            </mesh>
            {/* 木星大气层 */}
            <mesh>
              <sphereGeometry args={[size * 1.03, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#D2B48C',
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
              })} />
            </mesh>
            {/* 木星磁场效果 */}
            <group>
              {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} rotation={[0, i * Math.PI / 3, 0]}>
                  <torusGeometry args={[size * 2, size * 0.05, 8, 32]} />
                  <primitive object={createSafeBasicMaterial({
                    color: '#FFD700',
                    transparent: true,
                    opacity: 0.08,
                    blending: THREE.AdditiveBlending
                  })} />
                </mesh>
              ))}
            </group>
            {/* 木星辐射带 */}
            <mesh>
              <sphereGeometry args={[size * 1.8, 16, 16]} />
              <primitive object={(() => {
                const material = createSafeBasicMaterial({
                  color: '#FF6347',
                  transparent: true,
                  opacity: 0.03
                })
                material.wireframe = true
                return material
              })()} />
            </mesh>
          </group>
        )
        
      case 'saturn':
        return (
          <group>
            {/* 土星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'saturn',
                roughness: 0.6,
                metalness: 0.1
              })} />
            </mesh>
            
            {/* 多层光环系统 */}
            {/* A环 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.5, size * 2.2, 64]} />
              <primitive object={createSafeBasicMaterial({
                textureKey: 'saturnRings',
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
              })} />
            </mesh>
            
            {/* B环 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 2.3, size * 2.8, 64]} />
              <primitive object={createSafeBasicMaterial({
                color: '#D2B48C',
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
              })} />
            </mesh>
            
            {/* C环（薄环） */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.2, size * 1.45, 64]} />
              <primitive object={createSafeBasicMaterial({
                color: '#F5DEB3',
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
              })} />
            </mesh>
            
            {/* 环的粒子效果 */}
            <group rotation={[Math.PI / 2, 0, 0]}>
              {Array.from({ length: 200 }, (_, i) => {
                const angle = (i / 200) * Math.PI * 2
                const radius = size * (1.5 + Math.random() * 1.3)
                return (
                  <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <primitive object={createSafeBasicMaterial({
                      color: '#DEB887',
                      transparent: true,
                      opacity: 0.6
                    })} />
                  </mesh>
                )
              })}
            </group>
            
            {/* 光环辐射光效 */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.4, size * 3.0, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#FFD700',
                transparent: true,
                opacity: 0.05,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
              })} />
            </mesh>
          </group>
        )
        
      case 'uranus':
        return (
          <group>
            {/* 天王星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'uranus',
                roughness: 0.3,
                metalness: 0.2
              })} />
            </mesh>
            {/* 天王星光环 (垂直) */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[size * 1.8, size * 2.1, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#87CEEB',
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
              })} />
            </mesh>
            {/* 甲烷大气 */}
            <mesh>
              <sphereGeometry args={[size * 1.02, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#00CED1',
                transparent: true,
                opacity: 0.3,
                side: THREE.BackSide
              })} />
            </mesh>
          </group>
        )
        
      case 'neptune':
        return (
          <group>
            {/* 海王星主体 */}
            <mesh ref={meshRef} {...planetProps}>
              <sphereGeometry args={[size, 64, 64]} />
              <primitive object={createSafeMaterial({
                textureKey: 'neptune',
                roughness: 0.3,
                metalness: 0.1
              })} />
            </mesh>
            {/* 甲烷大气 */}
            <mesh>
              <sphereGeometry args={[size * 1.03, 32, 32]} />
              <primitive object={createSafeBasicMaterial({
                color: '#6495ED',
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
              })} />
            </mesh>
          </group>
        )
        
      default:
        return (
          <mesh ref={meshRef} {...planetProps}>
            <sphereGeometry args={[size, 32, 32]} />
            <primitive object={createSafeMaterial({
              color: planet.color,
              emissive: planet.color,
              emissiveIntensity: 0.1,
              roughness: 0.8,
              metalness: 0.1
            })} />
          </mesh>
        )
    }
  }

  // 获取当前行星位置
  const currentPosition = new THREE.Vector3()
  if (orbitRef.current) {
    currentPosition.copy(orbitRef.current.position)
  }

  return (
    <group>
      {/* 轨道线 */}
      {showOrbits && (
        <line>
          <bufferGeometry ref={orbitGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={64}
              array={new Float32Array(
                Array.from({ length: 64 }, (_, i) => {
                  const angle = (i / 64) * Math.PI * 2
                  return [
                    Math.cos(angle) * distance,
                    0,
                    Math.sin(angle) * distance
                  ]
                }).flat()
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={planet.color} opacity={0.3} transparent />
        </line>
      )}
      
      {/* 拖尾效果 */}
      {renderTrail()}
      
      {/* 行星 */}
      <group ref={orbitRef}>
        {renderPlanet()}
        
        {/* 标签 */}
        {showLabels && (
          <Html
            position={[0, size + (realScale ? 2.5 : 1.5), 0]}
            center
            distanceFactor={realScale ? 8 : 12}
            occlude={false}
          >
            <div className={`bg-black/80 text-white px-3 py-1.5 rounded font-semibold border border-white/30 pointer-events-none whitespace-nowrap shadow-lg ${
              realScale ? 'text-lg' : 'text-base'
            }`}>
              {planet.name}
            </div>
          </Html>
        )}
      </group>

      {/* 卫星系统 */}
      {planetSatellites[planet.id]?.map(satelliteId => {
        const satelliteData = satelliteDatabase[satelliteId]
        if (!satelliteData) return null
        
        return (
          <Satellite
            key={satelliteId}
            satellite={satelliteData}
            planetPosition={currentPosition}
            timeSpeed={timeSpeed}
            showOrbits={showOrbits}
            showLabels={showLabels}
            isPlaying={isPlaying}
            onSelect={onSelect}
            realScale={realScale}
          />
        )
      })}
    </group>
  )
}

/**
 * 太阳组件 - 增强特效版本
 */
function Sun({ onSelect, showLabels, realScale, cameraDistance }: { 
  onSelect: (id: string) => void; 
  showLabels: boolean; 
  realScale: boolean;
  cameraDistance: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Mesh>(null!)
  
  // 真实比例下太阳大小调整
  const sunSize = realScale ? 1.5 : 3
  const glowSize = realScale ? 2.2 : 4
  const coronaSize = realScale ? 3 : 5.5
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // 多层光晕脉动效果
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 1.2) * 0.08 + Math.sin(time * 2.3) * 0.04
      glowRef.current.scale.setScalar(pulse)
    }
    
    // 日冕动态效果
    if (coronaRef.current) {
      const coronaPulse = 1 + Math.sin(time * 0.8) * 0.1 + Math.cos(time * 1.8) * 0.05
      coronaRef.current.scale.setScalar(coronaPulse)
      coronaRef.current.rotation.z += 0.002
    }
    
    // 太阳自转
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group>
      {/* 太阳风特效 */}
      <SolarWind sunSize={sunSize} />
      
      {/* 太阳等离子体特效 */}
      <SunPlasma sunSize={sunSize} />
      
      {/* 外层日冕 */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[coronaSize, 32, 32]} />
        <primitive object={createSafeBasicMaterial({
          color: '#FFE55C',
          transparent: true,
          opacity: 0.08,
          side: THREE.BackSide
        })} />
      </mesh>
      
      {/* 中层光晕 */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowSize, 32, 32]} />
        <primitive object={createSafeBasicMaterial({
          color: '#FFD700',
          transparent: true,
          opacity: 0.25
        })} />
      </mesh>
      
      {/* 内层光晕 */}
      <mesh>
        <sphereGeometry args={[sunSize * 1.15, 32, 32]} />
        <primitive object={createSafeBasicMaterial({
          color: '#FF8C00',
          transparent: true,
          opacity: 0.4
        })} />
      </mesh>
      
      {/* 太阳主体 */}
      <mesh 
        ref={meshRef} 
        onClick={() => onSelect('sun')}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[sunSize, 64, 64]} />
        <primitive object={createSafeMaterial({
          textureKey: 'sun',
          emissive: '#FF6B00',
          emissiveIntensity: 0.8,
          roughness: 1,
          metalness: 0
        })} />
      </mesh>
      
      {/* 太阳耀斑效果 */}
      <group>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, i * Math.PI / 4]}>
            <planeGeometry args={[sunSize * 0.3, sunSize * 2]} />
            <primitive object={createSafeBasicMaterial({
              color: '#FF4500',
              transparent: true,
              opacity: 0.15,
              blending: THREE.AdditiveBlending
            })} />
          </mesh>
        ))}
      </group>
      
      {/* 太阳标签 */}
      {showLabels && (
        <Html
          position={[0, coronaSize + 1, 0]}
          center
          distanceFactor={realScale ? 8 : 12}
          occlude={false}
        >
          <div className={`bg-black/80 text-yellow-200 px-3 py-1.5 rounded font-bold border border-yellow-400/40 pointer-events-none whitespace-nowrap shadow-xl ${
            realScale ? 'text-xl' : 'text-lg'
          }`}>
            太阳 ☀️
          </div>
        </Html>
      )}
    </group>
  )
}

/**
 * 相机缩放控制器组件
 */
function CameraZoomController({ targetPlanet, planetData, realScale, orbitControlsRef, planetPositions }: {
  targetPlanet: string | null;
  planetData: PlanetInfo[];
  realScale: boolean;
  orbitControlsRef: React.MutableRefObject<any>;
  planetPositions: Map<string, THREE.Vector3>;
}) {
  const { camera } = useThree()
  const [isZooming, setIsZooming] = useState(false)

  useEffect(() => {
    if (targetPlanet && orbitControlsRef.current) {
      setIsZooming(true)
      
      // 找到目标行星
      const planet = planetData.find(p => p.id === targetPlanet)
      if (planet) {
        // 使用实际的行星位置
        const planetPosition = planetPositions.get(targetPlanet)
        if (!planetPosition) {
          console.warn(`Planet position not found for: ${targetPlanet}`)
          return
        }
        
        const planetX = planetPosition.x
        const planetZ = planetPosition.z
        
        // 根据行星大小计算合适的观察距离
        const planetSize = realScale ? planet.size * 0.5 : planet.size
        const zoomParams = {
          mercury: { distance: 2.5, height: 0.5 },     // 水星观察距离
          venus: { distance: 3.5, height: 0.8 },       // 金星观察距离  
          earth: { distance: 4.5, height: 1.2 },       // 地球观察距离，方便观察大气层
          mars: { distance: 3.5, height: 0.8 },        // 火星观察距离
          jupiter: { distance: 10, height: 2 },        // 木星观察距离
          saturn: { distance: 12, height: 2.5 },       // 土星观察距离，便于观察光环
          uranus: { distance: 7, height: 1.5 },        // 天王星观察距离
          neptune: { distance: 7, height: 1.5 },       // 海王星观察距离
          sun: { distance: 18, height: 3 }             // 太阳观察距离
        }
        
        const params = zoomParams[planet.id as keyof typeof zoomParams] || 
                      { distance: Math.max(planetSize * 4, 3), height: Math.max(planetSize * 2, 1.5) }
        
        // 计算目标相机位置（确保行星居中显示）
        // 为不同行星选择最佳观察角度
        let direction: THREE.Vector3
        
        switch (planet.id) {
          case 'saturn':
            // 土星从稍微斜上方观察，便于看到光环
            direction = new THREE.Vector3(0.8, 0.6, 0.8).normalize()
            break
          case 'earth':
            // 地球从前方稍高处观察，展示大气层
            direction = new THREE.Vector3(1, 0.4, 0.8).normalize()
            break
          case 'jupiter':
            // 木星从前方观察，展示大红斑
            direction = new THREE.Vector3(1, 0.2, 0.6).normalize()
            break
          default:
            // 其他行星使用标准观察角度
            direction = new THREE.Vector3(1, 0.3, 0.8).normalize()
        }
        
        const targetCameraPosition = new THREE.Vector3(
          planetX + direction.x * params.distance,
          direction.y * params.distance + params.height,
          planetZ + direction.z * params.distance
        )
        
        // 平滑移动相机到目标位置
        const startPosition = camera.position.clone()
        const startTarget = orbitControlsRef.current.target.clone()
        const duration = 2000 // 2秒动画
        const startTime = Date.now()
        
        const animateZoom = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // 使用缓动函数
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          
          // 插值相机位置
          camera.position.lerpVectors(startPosition, targetCameraPosition, easeProgress)
          
          // 插值OrbitControls目标，确保始终指向行星中心
          orbitControlsRef.current.target.lerpVectors(startTarget, planetPosition, easeProgress)
          
          // 更新控制器
          orbitControlsRef.current.update()
          
          if (progress < 1) {
            requestAnimationFrame(animateZoom)
          } else {
            setIsZooming(false)
            // 确保最终状态正确
            orbitControlsRef.current.target.copy(planetPosition)
            orbitControlsRef.current.update()
          }
        }
        
        animateZoom()
      }
    }
  }, [targetPlanet, planetData, realScale, camera, orbitControlsRef, planetPositions])

  return null
}

/**
 * 场景组件
 */
function Scene(props: SolarSystemProps & { zoomTargetPlanet: string | null }) {
  const { camera } = useThree()
  const [cameraDistance, setCameraDistance] = useState(100)
  const orbitControlsRef = useRef<any>(null)
  const [planetPositions, setPlanetPositions] = useState<Map<string, THREE.Vector3>>(new Map())
  
  // 处理行星位置更新
  const handlePlanetPositionUpdate = (planetId: string, position: THREE.Vector3) => {
    setPlanetPositions(prev => new Map(prev.set(planetId, position.clone())))
  }
  
  useEffect(() => {
    // 根据视图模式和真实比例调整相机位置
    if (props.viewMode === 'galaxy-cluster') {
      camera.position.set(0, 150, 300)  // 星系群视图
    } else if (props.realScale) {
      camera.position.set(0, 80, 80)   // 太阳系真实比例模式
    } else {
      camera.position.set(0, 50, 50)   // 太阳系普通模式
    }
  }, [camera, props.realScale, props.viewMode])

  // 监听相机距离变化，用于LOD
  useFrame(() => {
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
    setCameraDistance(distance)
  })

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={props.viewMode === 'galaxy-cluster' ? 0.6 : 0.3} />
      {props.viewMode === 'solar-system' && <pointLight position={[0, 0, 0]} intensity={1} />}
      
      {/* 增强星空背景 */}
      {props.starBackground && (
        <>
          <Stars 
            radius={props.viewMode === 'galaxy-cluster' ? 800 : 300} 
            depth={props.viewMode === 'galaxy-cluster' ? 200 : 60} 
            count={props.viewMode === 'galaxy-cluster' ? 3000 : 1000} 
            factor={props.viewMode === 'galaxy-cluster' ? 6 : 4} 
          />
          {/* 宇宙尘埃 */}
          <CosmicDust />
          {/* 星云背景 */}
          <Nebula />
        </>
      )}
      
      {/* 太阳系视图 */}
      {props.viewMode === 'solar-system' && (
        <>
          {/* 相机缩放控制器 */}
          <CameraZoomController 
            targetPlanet={props.zoomTargetPlanet} 
            planetData={planetData} 
            realScale={props.realScale}
            orbitControlsRef={orbitControlsRef}
            planetPositions={planetPositions}
          />
          
          {/* 太阳 */}
          <Sun 
            onSelect={props.onPlanetSelect || (() => {})} 
            showLabels={props.showLabels} 
            realScale={props.realScale}
            cameraDistance={cameraDistance}
          />
          
          {/* 行星 */}
          {planetData.map((planet) => (
            <Planet
              key={planet.id}
              planet={planet}
              timeSpeed={props.timeSpeed}
              showOrbits={props.showOrbits}
              showLabels={props.showLabels}
              realScale={props.realScale}
              isPlaying={props.isPlaying}
              onSelect={props.onPlanetSelect || (() => {})}
              trailType={props.trailType}
              trailLength={props.trailLength}
              trailIntensity={props.trailIntensity}
              cameraDistance={cameraDistance}
              realisticRendering={props.realisticRendering}
              onPositionUpdate={handlePlanetPositionUpdate}
            />
          ))}
        </>
      )}
      
      {/* 星系群视图 */}
      {props.viewMode === 'galaxy-cluster' && (
        <>
          {galaxyPositions.map((pos) => {
            const galaxy = galaxyDatabase[pos.id]
            if (!galaxy) return null
            
            return (
              <Galaxy
                key={pos.id}
                galaxy={galaxy}
                position={[pos.x, pos.y, pos.z]}
                rotation={pos.angle}
                onSelect={props.onPlanetSelect || (() => {})}
                showLabels={props.showLabels}
                scale={1}
              />
            )
          })}
          
          {/* 本星系群边界 */}
          <mesh>
            <sphereGeometry args={[400, 32, 32]} />
            <meshBasicMaterial 
              color="#444444"
              transparent
              opacity={0.03}
              wireframe
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}
      
      {/* 相机控制 */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}         // 始终允许平移
        enableZoom={true}        // 始终允许缩放
        enableRotate={true}      // 始终允许旋转
        minDistance={0.1}        // 允许非常近的观察
        maxDistance={props.viewMode === 'galaxy-cluster' ? 1500 : 2000}
        target={[0, 0, 0]}       // 默认目标为中心
        zoomSpeed={1.0}
        enableDamping={true}     // 启用阻尼，让移动更平滑
        dampingFactor={0.05}
      />
    </>
  )
}

/**
 * 错误边界组件
 */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Three.js Error:', error)
      setHasError(true)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
  
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-xl mb-2">渲染出现问题</h2>
          <p className="text-gray-400 mb-4">正在重新加载...</p>
          <button 
            onClick={() => {
              setHasError(false)
              window.location.reload()
            }}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

/**
 * 3D太阳系主组件
 */
export default function SolarSystem(props: SolarSystemProps) {
  const [zoomTargetPlanet, setZoomTargetPlanet] = useState<string | null>(null)
  
  // 重置视图函数
  const resetView = () => {
    setZoomTargetPlanet(null)
  }
  
  // 初始化时预加载纹理
  useEffect(() => {
    preloadTextures()
  }, [])
  
  // 视图模式切换时重置缩放状态
  useEffect(() => {
    setZoomTargetPlanet(null)
  }, [props.viewMode])
  
  // 重置视图触发器
  useEffect(() => {
    if (props.resetViewTrigger !== undefined) {
      resetView()
    }
  }, [props.resetViewTrigger])
  
  // 清理资源
  useEffect(() => {
    return () => {
      GeometryManager.cleanup()
      // 清理纹理缓存
      Object.values(loadedTextures).forEach(texture => {
        texture.dispose()
      })
    }
  }, [])
  
  // 处理天体选择
  const handleCelestialSelect = (celestialId: string) => {
    // 点击行星/卫星时自动停止播放
    if (props.setIsPlaying) {
      props.setIsPlaying(false)
    }
    
    // 星系群视图下不支持缩放
    if (props.viewMode === 'galaxy-cluster') {
      if (props.onPlanetSelect) {
        props.onPlanetSelect(celestialId)
      }
      return
    }
    
    // 太阳系视图下的缩放逻辑
    setZoomTargetPlanet(celestialId)
    
    if (props.onPlanetSelect) {
      props.onPlanetSelect(celestialId)
    }
  }
  
  const getCameraConfig = () => {
    if (props.viewMode === 'galaxy-cluster') {
      return { position: [0, 150, 300], fov: 90 }
    }
    return { 
      position: props.realScale ? [0, 80, 80] : [0, 50, 50], 
      fov: props.realScale ? 75 : 60 
    }
  }
  
  return (
    <ErrorBoundary>
      <div className="w-full h-full">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>加载中...</p>
            </div>
          </div>
        }>
          <Canvas 
            camera={getCameraConfig()}
            onCreated={({ gl }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            }}
          >
            <Scene 
              {...props} 
              zoomTargetPlanet={zoomTargetPlanet}
              onPlanetSelect={handleCelestialSelect}
            />
          </Canvas>
        </Suspense>
      </div>
      
      {/* 视图模式指示器 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg transition-all duration-300 ${
          props.viewMode === 'galaxy-cluster' 
            ? 'bg-purple-900/90 border border-purple-400 text-purple-100' 
            : 'bg-blue-900/90 border border-blue-400 text-blue-100'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            props.viewMode === 'galaxy-cluster' ? 'bg-purple-400' : 'bg-blue-400'
          }`}></div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {props.viewMode === 'galaxy-cluster' ? '星系群视图' : '太阳系视图'}
            </span>
            <span className={`text-xs ${
              props.viewMode === 'galaxy-cluster' ? 'text-purple-300' : 'text-blue-300'
            }`}>
              {props.viewMode === 'galaxy-cluster' 
                ? '点击星系查看详情 • 滚轮缩放观察' 
                : '点击行星放大观察 • 鼠标拖拽旋转 • 滚轮缩放'
              }
            </span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
