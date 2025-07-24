/**
 * 高级行星材质系统
 * 支持多层纹理和逼真视觉效果
 */

import * as THREE from 'three'

// 纹理类型定义
export interface PlanetTextures {
  diffuse?: string      // 漫反射贴图（基础颜色）
  normal?: string       // 法线贴图（表面细节）
  specular?: string     // 镜面反射贴图
  emissive?: string     // 发光贴图（城市灯光等）
  clouds?: string       // 云层贴图
  bump?: string         // 凹凸贴图
  roughness?: string    // 粗糙度贴图
}

// 行星材质配置
export interface PlanetMaterialConfig {
  textures: PlanetTextures
  materialProps: {
    roughness?: number
    metalness?: number
    emissiveIntensity?: number
    transparent?: boolean
    opacity?: number
  }
  atmosphere?: {
    color: string
    density: number
    height: number
  }
  clouds?: {
    speed: number
    opacity: number
    height: number
  }
}

// 纹理加载器单例
class TextureManager {
  private static instance: TextureManager
  private loader: THREE.TextureLoader
  private loadedTextures: Map<string, THREE.Texture>

  private constructor() {
    this.loader = new THREE.TextureLoader()
    this.loadedTextures = new Map()
  }

  static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager()
    }
    return TextureManager.instance
  }

  async loadTexture(path: string): Promise<THREE.Texture> {
    if (this.loadedTextures.has(path)) {
      return this.loadedTextures.get(path)!
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (texture) => {
          // 优化纹理设置
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.generateMipmaps = true
          
          this.loadedTextures.set(path, texture)
          resolve(texture)
        },
        undefined,
        (error) => {
          console.warn(`Failed to load texture: ${path}`, error)
          reject(error)
        }
      )
    })
  }

  async loadMultipleTextures(textures: PlanetTextures): Promise<Map<string, THREE.Texture>> {
    const textureMap = new Map<string, THREE.Texture>()
    
    const loadPromises = Object.entries(textures).map(async ([key, path]) => {
      if (path) {
        try {
          const texture = await this.loadTexture(path)
          textureMap.set(key, texture)
        } catch (error) {
          console.warn(`Failed to load ${key} texture:`, error)
        }
      }
    })

    await Promise.allSettled(loadPromises)
    return textureMap
  }
}

// 高级行星材质创建器
export class PlanetMaterialFactory {
  private textureManager: TextureManager

  constructor() {
    this.textureManager = TextureManager.getInstance()
  }

  async createPlanetMaterial(config: PlanetMaterialConfig): Promise<THREE.MeshStandardMaterial> {
    const textureMap = await this.textureManager.loadMultipleTextures(config.textures)
    
    const material = new THREE.MeshStandardMaterial({
      roughness: config.materialProps.roughness ?? 0.8,
      metalness: config.materialProps.metalness ?? 0.1,
      transparent: config.materialProps.transparent ?? false,
      opacity: config.materialProps.opacity ?? 1.0,
    })

    // 应用各种贴图
    if (textureMap.has('diffuse')) {
      material.map = textureMap.get('diffuse')!
    }

    if (textureMap.has('normal')) {
      material.normalMap = textureMap.get('normal')!
      material.normalScale = new THREE.Vector2(1, 1)
    }

    if (textureMap.has('specular')) {
      material.metalnessMap = textureMap.get('specular')!
    }

    if (textureMap.has('emissive')) {
      material.emissiveMap = textureMap.get('emissive')!
      material.emissiveIntensity = config.materialProps.emissiveIntensity ?? 0.5
    }

    if (textureMap.has('bump')) {
      material.bumpMap = textureMap.get('bump')!
      material.bumpScale = 0.02
    }

    if (textureMap.has('roughness')) {
      material.roughnessMap = textureMap.get('roughness')!
    }

    material.needsUpdate = true
    return material
  }

  createAtmosphereMaterial(config: PlanetMaterialConfig): THREE.ShaderMaterial {
    if (!config.atmosphere) {
      throw new Error('Atmosphere configuration required')
    }

    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float density;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float rimPower = 1.0 - abs(dot(viewDir, vNormal));
          float rimIntensity = pow(rimPower, density);
          
          gl_FragColor = vec4(atmosphereColor, rimIntensity * 0.8);
        }
      `,
      uniforms: {
        atmosphereColor: { value: new THREE.Color(config.atmosphere.color) },
        density: { value: config.atmosphere.density }
      },
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
  }

  async createCloudMaterial(config: PlanetMaterialConfig): Promise<THREE.MeshLambertMaterial> {
    if (!config.textures.clouds) {
      throw new Error('Cloud texture required')
    }

    const cloudTexture = await this.textureManager.loadTexture(config.textures.clouds)
    
    return new THREE.MeshLambertMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: config.clouds?.opacity ?? 0.6,
      side: THREE.DoubleSide
    })
  }
}

// 预定义的行星材质配置
export const PLANET_CONFIGS: Record<string, PlanetMaterialConfig> = {
  earth: {
    textures: {
      diffuse: '/src/assets/textures/planets/earth_diffuse.jpg',
      normal: '/src/assets/textures/planets/earth_normal.jpg',
      specular: '/src/assets/textures/planets/earth_specular.jpg',
      emissive: '/src/assets/textures/planets/earth_night.jpg',
      clouds: '/src/assets/textures/planets/earth_clouds.jpg'
    },
    materialProps: {
      roughness: 0.7,
      metalness: 0.1,
      emissiveIntensity: 0.3
    },
    atmosphere: {
      color: '#87CEEB',
      density: 2.0,
      height: 1.05
    },
    clouds: {
      speed: 0.001,
      opacity: 0.6,
      height: 1.02
    }
  },
  mars: {
    textures: {
      diffuse: '/src/assets/textures/planets/mars_diffuse.jpg',
      normal: '/src/assets/textures/planets/mars_normal.jpg',
      bump: '/src/assets/textures/planets/mars_height.jpg'
    },
    materialProps: {
      roughness: 0.9,
      metalness: 0.05
    },
    atmosphere: {
      color: '#CD853F',
      density: 1.2,
      height: 1.02
    }
  },
  jupiter: {
    textures: {
      diffuse: '/src/assets/textures/planets/jupiter_diffuse.jpg'
    },
    materialProps: {
      roughness: 0.8,
      metalness: 0.0
    },
    atmosphere: {
      color: '#D2691E',
      density: 1.5,
      height: 1.1
    }
  },
  saturn: {
    textures: {
      diffuse: '/src/assets/textures/planets/saturn_diffuse.jpg'
    },
    materialProps: {
      roughness: 0.8,
      metalness: 0.0
    }
  },
  venus: {
    textures: {
      diffuse: '/src/assets/textures/planets/venus_diffuse.jpg',
      clouds: '/src/assets/textures/planets/venus_clouds.jpg'
    },
    materialProps: {
      roughness: 0.9,
      metalness: 0.0
    },
    atmosphere: {
      color: '#FFA500',
      density: 3.0,
      height: 1.08
    },
    clouds: {
      speed: 0.005,
      opacity: 0.8,
      height: 1.05
    }
  },
  mercury: {
    textures: {
      diffuse: '/src/assets/textures/planets/mercury_diffuse.jpg',
      normal: '/src/assets/textures/planets/mercury_normal.jpg'
    },
    materialProps: {
      roughness: 0.9,
      metalness: 0.1
    }
  },
  uranus: {
    textures: {
      diffuse: '/src/assets/textures/planets/uranus_diffuse.jpg'
    },
    materialProps: {
      roughness: 0.6,
      metalness: 0.2
    },
    atmosphere: {
      color: '#4FD0E7',
      density: 1.8,
      height: 1.06
    }
  },
  neptune: {
    textures: {
      diffuse: '/src/assets/textures/planets/neptune_diffuse.jpg'
    },
    materialProps: {
      roughness: 0.6,
      metalness: 0.1
    },
    atmosphere: {
      color: '#4169E1',
      density: 2.2,
      height: 1.07
    }
  }
}