/**
 * 卫星数据库
 * 包含太阳系主要卫星的详细信息
 */

export interface SatelliteData {
  id: string
  name: string
  parentPlanet: string
  description: string
  diameter: string
  mass: string
  orbitalRadius: string
  orbitalPeriod: string
  discoveryYear: string
  interestingFacts: string[]
  color: string
  size: number
  distance: number
  speed: number
}

export const satelliteDatabase: Record<string, SatelliteData> = {
  // 地球卫星
  moon: {
    id: 'moon',
    name: '月球',
    parentPlanet: 'earth',
    description: '月球是地球唯一的天然卫星，对地球的潮汐和气候有重要影响。',
    diameter: '3,474 km',
    mass: '7.35 × 10²² kg',
    orbitalRadius: '384,400 km',
    orbitalPeriod: '27.3天',
    discoveryYear: '史前时代',
    interestingFacts: [
      '月球正以每年3.8厘米的速度远离地球！',
      '月球的重力只有地球的1/6。',
      '月球总是以同一面朝向地球（潮汐锁定）。'
    ],
    color: '#C0C0C0',
    size: 0.3,
    distance: 2,
    speed: 2
  },

  // 火星卫星
  phobos: {
    id: 'phobos',
    name: '火卫一（福波斯）',
    parentPlanet: 'mars',
    description: '火卫一是火星最大的卫星，形状不规则，可能是被捕获的小行星。',
    diameter: '22.5 km',
    mass: '1.07 × 10¹⁶ kg',
    orbitalRadius: '9,376 km',
    orbitalPeriod: '7.6小时',
    discoveryYear: '1877年',
    interestingFacts: [
      '火卫一的公转周期比火星自转周期还短！',
      '由于轨道衰减，火卫一将在约5000万年后撞击火星。',
      '表面布满陨石坑和神秘的沟槽。'
    ],
    color: '#8B4513',
    size: 0.08,
    distance: 0.8,
    speed: 8
  },

  deimos: {
    id: 'deimos',
    name: '火卫二（得摩斯）',
    parentPlanet: 'mars',
    description: '火卫二是火星较小的外层卫星，表面相对平滑。',
    diameter: '12.4 km',
    mass: '1.48 × 10¹⁵ kg',
    orbitalRadius: '23,463 km',
    orbitalPeriod: '30.3小时',
    discoveryYear: '1877年',
    interestingFacts: [
      '火卫二的轨道正在缓慢扩大。',
      '从火星表面看，火卫二只是一个明亮的星点。',
      '表面覆盖着厚厚的尘埃层。'
    ],
    color: '#A0522D',
    size: 0.05,
    distance: 1.2,
    speed: 4
  },

  // 木星主要卫星（伽利略卫星）
  io: {
    id: 'io',
    name: '木卫一（伊奥）',
    parentPlanet: 'jupiter',
    description: '伊奥是太阳系中火山活动最活跃的天体，表面布满硫磺火山。',
    diameter: '3,643 km',
    mass: '8.93 × 10²² kg',
    orbitalRadius: '421,700 km',
    orbitalPeriod: '1.8天',
    discoveryYear: '1610年',
    interestingFacts: [
      '伊奥拥有太阳系中最活跃的火山！',
      '硫磺火山喷发高度可达500公里。',
      '表面颜色鲜艳，有黄色、橙色和红色。'
    ],
    color: '#FFFF00',
    size: 0.25,
    distance: 3.5,
    speed: 3
  },

  europa: {
    id: 'europa',
    name: '木卫二（欧罗巴）',
    parentPlanet: 'jupiter',
    description: '欧罗巴拥有地下海洋，是寻找地外生命的重点目标。',
    diameter: '3,122 km',
    mass: '4.80 × 10²² kg',
    orbitalRadius: '671,034 km',
    orbitalPeriod: '3.5天',
    discoveryYear: '1610年',
    interestingFacts: [
      '欧罗巴的地下海洋比地球所有海洋的水还要多！',
      '冰层表面有复杂的裂缝网络。',
      '可能存在生命的最佳候选地之一。'
    ],
    color: '#B0E0E6',
    size: 0.22,
    distance: 4.2,
    speed: 2.5
  },

  ganymede: {
    id: 'ganymede',
    name: '木卫三（盖尼米德）',
    parentPlanet: 'jupiter',
    description: '盖尼米德是太阳系最大的卫星，甚至比水星还大。',
    diameter: '5,268 km',
    mass: '1.48 × 10²³ kg',
    orbitalRadius: '1,070,412 km',
    orbitalPeriod: '7.2天',
    discoveryYear: '1610年',
    interestingFacts: [
      '盖尼米德是太阳系中最大的卫星！',
      '拥有自己的磁场，是唯一有磁场的卫星。',
      '表面有古老的暗色区域和年轻的亮色沟槽。'
    ],
    color: '#696969',
    size: 0.3,
    distance: 5,
    speed: 2
  },

  callisto: {
    id: 'callisto',
    name: '木卫四（卡利斯托）',
    parentPlanet: 'jupiter',
    description: '卡利斯托是木星最外层的大卫星，表面布满陨石坑。',
    diameter: '4,821 km',
    mass: '1.08 × 10²³ kg',
    orbitalRadius: '1,882,709 km',
    orbitalPeriod: '16.7天',
    discoveryYear: '1610年',
    interestingFacts: [
      '卡利斯托的陨石坑密度是太阳系最高的！',
      '可能拥有地下海洋。',
      '表面最古老，约45亿年历史。'
    ],
    color: '#A0A0A0',
    size: 0.28,
    distance: 6.5,
    speed: 1.5
  },

  // 土星主要卫星
  titan: {
    id: 'titan',
    name: '土卫六（泰坦）',
    parentPlanet: 'saturn',
    description: '泰坦是太阳系第二大卫星，拥有浓厚大气层和液态甲烷湖泊。',
    diameter: '5,149 km',
    mass: '1.35 × 10²³ kg',
    orbitalRadius: '1,221,830 km',
    orbitalPeriod: '15.9天',
    discoveryYear: '1655年',
    interestingFacts: [
      '泰坦拥有比火星更浓厚的大气层！',
      '表面有液态甲烷和乙烷的湖泊。',
      '是除地球外唯一有稳定液体的天体。'
    ],
    color: '#DAA520',
    size: 0.32,
    distance: 4.5,
    speed: 1.8
  },

  enceladus: {
    id: 'enceladus',
    name: '土卫二（恩克拉多斯）',
    parentPlanet: 'saturn',
    description: '恩克拉多斯从南极裂缝喷射水蒸气柱，被认为有地下海洋。',
    diameter: '504 km',
    mass: '1.08 × 10²⁰ kg',
    orbitalRadius: '238,020 km',
    orbitalPeriod: '1.4天',
    discoveryYear: '1789年',
    interestingFacts: [
      '恩克拉多斯从南极喷射高达数百公里的水柱！',
      '地下海洋可能含有生命所需的化学元素。',
      '表面是太阳系中最亮的之一。'
    ],
    color: '#F8F8FF',
    size: 0.12,
    distance: 3,
    speed: 3.5
  },

  // 天王星主要卫星
  miranda: {
    id: 'miranda',
    name: '天卫五（米兰达）',
    parentPlanet: 'uranus',
    description: '米兰达拥有太阳系中最奇特和最复杂的地形。',
    diameter: '471 km',
    mass: '6.59 × 10¹⁹ kg',
    orbitalRadius: '129,390 km',
    orbitalPeriod: '1.4天',
    discoveryYear: '1948年',
    interestingFacts: [
      '米兰达可能曾经被撞碎后重新聚合！',
      '拥有太阳系中最高的悬崖，高达20公里。',
      '表面地形极其复杂多样。'
    ],
    color: '#C0C0C0',
    size: 0.08,
    distance: 2.5,
    speed: 4
  },

  // 海王星主要卫星
  triton: {
    id: 'triton',
    name: '海卫一（特里同）',
    parentPlanet: 'neptune',
    description: '特里同是海王星最大的卫星，拥有逆行轨道和活跃地质。',
    diameter: '2,707 km',
    mass: '2.14 × 10²² kg',
    orbitalRadius: '354,759 km',
    orbitalPeriod: '5.9天',
    discoveryYear: '1846年',
    interestingFacts: [
      '特里同是太阳系中唯一大型逆行卫星！',
      '可能是被捕获的柯伊伯带天体。',
      '表面有活跃的氮气间歇泉。'
    ],
    color: '#FFB6C1',
    size: 0.18,
    distance: 3.5,
    speed: -2 // 负值表示逆行
  }
}

// 按行星分组的卫星列表
export const planetSatellites: Record<string, string[]> = {
  mercury: [],
  venus: [],
  earth: ['moon'],
  mars: ['phobos', 'deimos'],
  jupiter: ['io', 'europa', 'ganymede', 'callisto'],
  saturn: ['titan', 'enceladus'],
  uranus: ['miranda'],
  neptune: ['triton']
}
