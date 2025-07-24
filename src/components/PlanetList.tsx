import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 行星信息接口
 */
interface PlanetInfo {
  name: string
  nameEn: string
  color: string
  type: 'terrestrial' | 'gas' | 'ice' | 'star'
  distance?: string
  size?: string
}

/**
 * 行星列表数据
 */
const planetsList: PlanetInfo[] = [
  { name: '太阳', nameEn: 'Sun', color: '#FDB813', type: 'star' },
  { name: '水星', nameEn: 'Mercury', color: '#8C7853', type: 'terrestrial', distance: '0.39 AU', size: '0.38 地球' },
  { name: '金星', nameEn: 'Venus', color: '#FFC649', type: 'terrestrial', distance: '0.72 AU', size: '0.95 地球' },
  { name: '地球', nameEn: 'Earth', color: '#6B93D6', type: 'terrestrial', distance: '1.00 AU', size: '1.00 地球' },
  { name: '火星', nameEn: 'Mars', color: '#C1440E', type: 'terrestrial', distance: '1.52 AU', size: '0.53 地球' },
  { name: '木星', nameEn: 'Jupiter', color: '#D8CA9D', type: 'gas', distance: '5.20 AU', size: '11.2 地球' },
  { name: '土星', nameEn: 'Saturn', color: '#FAD5A5', type: 'gas', distance: '9.58 AU', size: '9.45 地球' },
  { name: '天王星', nameEn: 'Uranus', color: '#4FD0E3', type: 'ice', distance: '19.2 AU', size: '4.01 地球' },
  { name: '海王星', nameEn: 'Neptune', color: '#4B70DD', type: 'ice', distance: '30.1 AU', size: '3.88 地球' }
]

/**
 * 获取行星类型标签
 */
function getPlanetTypeLabel(type: string): string {
  const typeMap = {
    'terrestrial': '类地',
    'gas': '气态',
    'ice': '冰态',
    'star': '恒星'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

/**
 * 行星项组件
 */
function PlanetItem({ planet }: { planet: PlanetInfo }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
      <div 
        className="w-3 h-3 rounded-full border border-white/20"
        style={{ backgroundColor: planet.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{planet.name}</span>
          <span className="text-xs text-gray-400">{planet.nameEn}</span>
        </div>
        {planet.distance && (
          <div className="text-xs text-gray-300 mt-0.5">
            距离: {planet.distance} • 大小: {planet.size}
          </div>
        )}
      </div>
      <div className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded">
        {getPlanetTypeLabel(planet.type)}
      </div>
    </div>
  )
}

/**
 * 行星列表组件
 */
export default function PlanetList() {
  return (
    <Card className="w-72 bg-slate-900/95 border-slate-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-blue-300">
          天体列表
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-1 max-h-96 overflow-y-auto">
        {planetsList.map((planet) => (
          <PlanetItem key={planet.nameEn} planet={planet} />
        ))}
      </CardContent>
    </Card>
  )
}