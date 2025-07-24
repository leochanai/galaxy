/**
 * 星系数据库
 * 包含银河系及其周边星系的科学信息
 */

export interface GalaxyData {
  id: string
  name: string
  description: string
  type: 'spiral' | 'elliptical' | 'irregular' | 'dwarf'
  distance: string // 真实距离
  displayDistance: number // 显示距离（缩放后）
  diameter: string // 真实直径
  displaySize: number // 显示大小
  stars: string // 恒星数量
  mass: string
  color: string
  interestingFacts: string[]
  discoverer?: string
  discoveryYear?: number
}

export const galaxyDatabase: Record<string, GalaxyData> = {
  milkyWay: {
    id: 'milkyWay',
    name: '银河系',
    description: '我们的家园星系，一个棒旋星系，包含太阳系和数千亿颗恒星。',
    type: 'spiral',
    distance: '0光年 (我们就在其中)',
    displayDistance: 0,
    diameter: '约10万光年',
    displaySize: 50,
    stars: '1000-4000亿颗',
    mass: '8.5 × 10¹¹ 太阳质量',
    color: '#E6E6FA',
    interestingFacts: [
      '银河系中心有一个超大质量黑洞！',
      '太阳系位于银河系的猎户座旋臂上。',
      '银河系每2.3亿年自转一圈，太阳系已经转了约20圈。',
      '银河系正在以每秒630公里的速度朝仙女座星系移动。'
    ]
  },
  
  andromeda: {
    id: 'andromeda',
    name: '仙女座星系 (M31)',
    description: '距离我们最近的大型螺旋星系，是银河系的姊妹星系，也是肉眼可见的最远天体。',
    type: 'spiral',
    distance: '254万光年',
    displayDistance: 120,
    diameter: '约22万光年',
    displaySize: 80,
    stars: '约1万亿颗',
    mass: '1.5 × 10¹² 太阳质量',
    color: '#B0C4DE',
    interestingFacts: [
      '仙女座星系正以每秒110公里的速度向银河系靠近！',
      '约45亿年后将与银河系相撞合并。',
      '它是肉眼可见的最远天体，视星等3.4等。',
      '拥有至少450个球状星团。'
    ],
    discoverer: '阿卜杜勒-拉赫曼·苏菲',
    discoveryYear: 964
  },
  
  triangulum: {
    id: 'triangulum',
    name: '三角座星系 (M33)',
    description: '本星系群中第三大的星系，是一个美丽的正向螺旋星系。',
    type: 'spiral',
    distance: '300万光年',
    displayDistance: 140,
    diameter: '约6万光年',
    displaySize: 35,
    stars: '约400亿颗',
    mass: '5 × 10¹⁰ 太阳质量',
    color: '#98FB98',
    interestingFacts: [
      '三角座星系是本星系群中第三大星系。',
      '拥有活跃的恒星形成区域。',
      '在良好的观测条件下肉眼可见。',
      '与仙女座星系有引力相互作用。'
    ],
    discoverer: '查尔斯·梅西耶',
    discoveryYear: 1764
  },
  
  largeMagellanic: {
    id: 'largeMagellanic',
    name: '大麦哲伦云',
    description: '银河系的卫星星系，是南半球天空中最亮的星系，肉眼清晰可见。',
    type: 'irregular',
    distance: '16万光年',
    displayDistance: 80,
    diameter: '约1.4万光年',
    displaySize: 25,
    stars: '约300亿颗',
    mass: '1.4 × 10¹⁰ 太阳质量',
    color: '#FFB6C1',
    interestingFacts: [
      '大麦哲伦云是银河系的卫星星系！',
      '拥有活跃的恒星形成区，包括著名的蜘蛛星云。',
      '1987年这里发生了著名的超新星SN 1987A。',
      '与小麦哲伦云通过气体桥梁相连。'
    ],
    discoverer: '南半球原住民',
    discoveryYear: -1000
  },
  
  smallMagellanic: {
    id: 'smallMagellanic',
    name: '小麦哲伦云',
    description: '银河系的另一个卫星星系，与大麦哲伦云形成一对相互作用的星系。',
    type: 'irregular',
    distance: '20万光年',
    displayDistance: 90,
    diameter: '约7000光年',
    displaySize: 18,
    stars: '约30亿颗',
    mass: '7 × 10⁹ 太阳质量',
    color: '#DDA0DD',
    interestingFacts: [
      '小麦哲伦云是不规则矮星系。',
      '与大麦哲伦云一起绕银河系公转。',
      '拥有年轻的恒星和活跃的恒星形成区。',
      '是研究星系演化的重要实验室。'
    ],
    discoverer: '南半球原住民',
    discoveryYear: -1000
  },
  
  centaurusA: {
    id: 'centaurusA',
    name: '半人马座A (NGC 5128)',
    description: '最近的活跃星系之一，拥有超大质量黑洞和强射电源。',
    type: 'elliptical',
    distance: '1200万光年',
    displayDistance: 200,
    diameter: '约6万光年',
    displaySize: 40,
    stars: '约1000亿颗',
    mass: '1 × 10¹² 太阳质量',
    color: '#F0E68C',
    interestingFacts: [
      '半人马座A是最近的射电星系！',
      '中心有一个质量为太阳5500万倍的超大质量黑洞。',
      '正在吞噬一个较小的螺旋星系。',
      '从黑洞射出的等离子体喷流长达100万光年。'
    ],
    discoverer: '詹姆斯·邓洛普',
    discoveryYear: 1826
  },
  
  whirlpool: {
    id: 'whirlpool',
    name: '漩涡星系 (M51)',
    description: '一个美丽的旋涡星系，拥有清晰的旋臂结构，是天体摄影的热门目标。',
    type: 'spiral',
    distance: '2300万光年',
    displayDistance: 250,
    diameter: '约6万光年',
    displaySize: 45,
    stars: '约1600亿颗',
    mass: '1.6 × 10¹¹ 太阳质量',
    color: '#87CEEB',
    interestingFacts: [
      '漩涡星系拥有完美的螺旋结构！',
      '正与伴星系NGC 5194相互作用。',
      '是第一个被发现旋臂结构的星系。',
      '拥有众多恒星形成区和超新星遗迹。'
    ],
    discoverer: '查尔斯·梅西耶',
    discoveryYear: 1773
  }
}

// 星系在3D场景中的排列数据
export const galaxyPositions = [
  { id: 'milkyWay', x: 0, y: 0, z: 0, angle: 0 },
  { id: 'andromeda', x: 120, y: 20, z: 80, angle: Math.PI / 4 },
  { id: 'triangulum', x: -100, y: -15, z: 120, angle: -Math.PI / 6 },
  { id: 'largeMagellanic', x: 60, y: -10, z: -40, angle: Math.PI / 3 },
  { id: 'smallMagellanic', x: 75, y: -8, z: -55, angle: Math.PI / 2 },
  { id: 'centaurusA', x: -150, y: 25, z: -100, angle: -Math.PI / 3 },
  { id: 'whirlpool', x: 180, y: 30, z: 200, angle: Math.PI / 8 }
]

// 本星系群信息
export const localGroup = {
  name: '本星系群',
  description: '包含银河系、仙女座星系等约80个星系的星系群',
  diameter: '约1000万光年',
  totalMass: '约5 × 10¹² 太阳质量',
  members: ['milkyWay', 'andromeda', 'triangulum', 'largeMagellanic', 'smallMagellanic']
}
