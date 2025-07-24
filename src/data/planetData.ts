/**
 * 行星科普数据库
 * 包含太阳系各天体的详细科学信息
 */

import { satelliteDatabase } from './satelliteData'
import { galaxyDatabase } from './galaxyData'

export interface PlanetData {
  id: string
  name: string
  description: string
  mass: string
  gravity: string
  atmosphere: string
  satellites: string
  orbitalPeriod: string
  orbitalRadius: string
  interestingFacts: string[]
  color: string
  type: 'terrestrial' | 'gas-giant' | 'ice-giant' | 'star'
}

// 合并行星、卫星和星系数据库
export const combinedCelestialDatabase = {
  ...{
  sun: {
    id: 'sun',
    name: '太阳',
    description: '太阳是太阳系的中心恒星，为地球提供光和热，是生命存在的基础。',
    mass: '1.989 × 10³⁰ kg',
    gravity: '274 m/s²',
    atmosphere: '73% H, 25% He',
    satellites: '8颗行星',
    orbitalPeriod: '-',
    orbitalRadius: '-',
    interestingFacts: [
      '太阳每秒钟将400万吨质量转化为能量！',
      '太阳表面温度约5500°C，核心温度高达1500万°C。',
      '太阳的光线需要8分钟才能到达地球。'
    ],
    color: '#FDB813',
    type: 'star'
  },
  mercury: {
    id: 'mercury',
    name: '水星',
    description: '水星是距离太阳最近的行星，表面温差极大，没有大气层保护。',
    mass: '3.301 × 10²³ kg',
    gravity: '3.7 m/s²',
    atmosphere: '几乎没有大气',
    satellites: '0颗卫星',
    orbitalPeriod: '88天',
    orbitalRadius: '58百万公里',
    interestingFacts: [
      '水星一天比一年还长！一个水星日等于176个地球日。',
      '表面温度变化从-173°C到427°C。',
      '水星是太阳系中最小的行星。'
    ],
    color: '#8C7853',
    type: 'terrestrial'
  },
  venus: {
    id: 'venus',
    name: '金星',
    description: '金星被称为地球的姊妹星，但其表面环境极其恶劣，温室效应严重。',
    mass: '4.867 × 10²⁴ kg',
    gravity: '8.87 m/s²',
    atmosphere: '96% CO₂, 3.5% N₂',
    satellites: '0颗卫星',
    orbitalPeriod: '225天',
    orbitalRadius: '108百万公里',
    interestingFacts: [
      '金星是太阳系中最热的行星，表面温度高达462°C！',
      '金星的大气压力是地球的90倍。',
      '金星自转方向与其他行星相反。'
    ],
    color: '#FFC649',
    type: 'terrestrial'
  },
  earth: {
    id: 'earth',
    name: '地球',
    description: '地球是目前已知唯一存在生命的行星，拥有液态水和适宜的大气环境。',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.8 m/s²',
    atmosphere: '78% N₂, 21% O₂',
    satellites: '1颗卫星(月球)',
    orbitalPeriod: '365天',
    orbitalRadius: '150百万公里',
    interestingFacts: [
      '地球是太阳系中唯一已知存在生命的行星！',
      '地球表面71%被海洋覆盖。',
      '地球的磁场保护我们免受太阳风的伤害。'
    ],
    color: '#6B93D6',
    type: 'terrestrial'
  },
  mars: {
    id: 'mars',
    name: '火星',
    description: '火星被称为红色星球，是人类未来殖民的主要候选目标。',
    mass: '6.39 × 10²³ kg',
    gravity: '3.71 m/s²',
    atmosphere: '95% CO₂, 3% N₂',
    satellites: '2颗卫星',
    orbitalPeriod: '687天',
    orbitalRadius: '228百万公里',
    interestingFacts: [
      '火星拥有太阳系最大的火山——奥林帕斯山！',
      '火星上的一天与地球相似，约24小时37分钟。',
      '火星曾经有液态水，现在仍有水冰存在。'
    ],
    color: '#C1440E',
    type: 'terrestrial'
  },
  jupiter: {
    id: 'jupiter',
    name: '木星',
    description: '木星是太阳系最大的行星，被称为气态巨行星，拥有大红斑风暴。',
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.79 m/s²',
    atmosphere: '89% H₂, 10% He',
    satellites: '95颗已知卫星',
    orbitalPeriod: '4333天',
    orbitalRadius: '778百万公里',
    interestingFacts: [
      '木星的质量比其他所有行星加起来还要大！',
      '木星的大红斑是一个持续了数百年的巨型风暴。',
      '木星起到"太阳系清道夫"的作用，吸引小行星和彗星。'
    ],
    color: '#D8CA9D',
    type: 'gas-giant'
  },
  saturn: {
    id: 'saturn',
    name: '土星',
    description: '土星以其壮观的光环系统而闻名，是太阳系中密度最小的行星，甚至比水还轻。',
    mass: '5.683 × 10²⁶ kg',
    gravity: '10.44 m/s²',
    atmosphere: '96% H₂, 3% He',
    satellites: '82颗已知卫星',
    orbitalPeriod: '10759天',
    orbitalRadius: '1432百万公里',
    interestingFacts: [
      '土星的密度比水小，理论上可以浮在水面上！',
      '土星的光环主要由冰块和岩石碎片组成，厚度只有约10米。',
      '土星有82颗已知卫星，其中泰坦是太阳系第二大卫星。'
    ],
    color: '#FAD5A5',
    type: 'gas-giant'
  },
  uranus: {
    id: 'uranus',
    name: '天王星',
    description: '天王星是一颗冰巨星，以其独特的侧躺自转方式而著称。',
    mass: '8.681 × 10²⁵ kg',
    gravity: '8.69 m/s²',
    atmosphere: '83% H₂, 15% He, 2% CH₄',
    satellites: '27颗已知卫星',
    orbitalPeriod: '30687天',
    orbitalRadius: '2867百万公里',
    interestingFacts: [
      '天王星几乎是"侧躺"着绕太阳公转的！',
      '天王星的甲烷大气使其呈现美丽的蓝绿色。',
      '天王星也有光环系统，但比土星的要暗淡得多。'
    ],
    color: '#4FD0E3',
    type: 'ice-giant'
  },
  neptune: {
    id: 'neptune',
    name: '海王星',
    description: '海王星是太阳系最外层的行星，拥有极强的风暴和美丽的深蓝色外观。',
    mass: '1.024 × 10²⁶ kg',
    gravity: '11.15 m/s²',
    atmosphere: '80% H₂, 19% He, 1% CH₄',
    satellites: '14颗已知卫星',
    orbitalPeriod: '60190天',
    orbitalRadius: '4515百万公里',
    interestingFacts: [
      '海王星拥有太阳系中最强的风，风速可达2100公里/小时！',
      '海王星是通过数学计算发现的第一颗行星。',
      '海王星绕太阳一圈需要165个地球年。'
    ],
    color: '#4B70DD',
    type: 'ice-giant'
  }
  },
  ...satelliteDatabase,
  ...galaxyDatabase
}

export const planetDatabase: Record<string, PlanetData> = {
  sun: combinedCelestialDatabase.sun,
  mercury: combinedCelestialDatabase.mercury,
  venus: combinedCelestialDatabase.venus,
  earth: combinedCelestialDatabase.earth,
  mars: combinedCelestialDatabase.mars,
  jupiter: combinedCelestialDatabase.jupiter,
  saturn: combinedCelestialDatabase.saturn,
  uranus: combinedCelestialDatabase.uranus,
  neptune: combinedCelestialDatabase.neptune
}
