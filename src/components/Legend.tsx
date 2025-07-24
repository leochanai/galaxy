/**
 * 太阳系图例组件
 * 显示行星类型分类和选中行星的详细信息
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { combinedCelestialDatabase, PlanetData } from '@/data/planetData'
import { satelliteDatabase } from '@/data/satelliteData'

/**
 * 图例组件属性接口
 */
interface LegendProps {
  selectedPlanet?: string | null
  onPlanetDeselect?: () => void
}

/**
 * 数据项组件
 */
function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="text-xs text-blue-300 mb-1">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  )
}

/**
 * 太阳系图例组件
 */
export default function Legend({ selectedPlanet, onPlanetDeselect }: LegendProps) {
  // 如果选中了天体，显示详细信息
  if (selectedPlanet && combinedCelestialDatabase[selectedPlanet]) {
    const celestialBody = combinedCelestialDatabase[selectedPlanet]
    
    // 判断是行星还是卫星
    const isSatellite = satelliteDatabase[selectedPlanet] !== undefined
    const planet = celestialBody as PlanetData
    
    return (
      <Card className="w-96 max-h-[80vh] overflow-y-auto bg-slate-900/95 border-slate-700 text-white shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-blue-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/30"
                style={{ backgroundColor: planet.color }}
              ></div>
              {planet.name}
              {isSatellite && (
                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                  卫星
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlanetDeselect}
              className="text-gray-400 hover:text-white hover:bg-slate-800 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 基本信息 */}
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-2 border-b border-slate-700 pb-1">基本信息</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{planet.description}</p>
          </div>

          {/* 数据网格 */}
          <div className="grid grid-cols-2 gap-3">
            <DataItem label={isSatellite ? "直径" : "质量"} value={isSatellite ? (planet as any).diameter || planet.mass : planet.mass} />
            <DataItem label="重力" value={planet.gravity || (planet as any).mass || "未知"} />
            <DataItem label={isSatellite ? "母行星" : "大气成分"} value={isSatellite ? `${(planet as any).parentPlanet || "未知"}的卫星` : planet.atmosphere} />
            <DataItem label={isSatellite ? "发现年份" : "卫星数量"} value={isSatellite ? (planet as any).discoveryYear || "未知" : planet.satellites} />
            <DataItem label="公转周期" value={planet.orbitalPeriod} />
            <DataItem label="轨道半径" value={planet.orbitalRadius} />
          </div>

          {/* 有趣事实 */}
          <div>
            <h4 className="text-sm font-medium text-blue-300 mb-2 border-b border-slate-700 pb-1">有趣事实</h4>
            <div className="space-y-2">
              {planet.interestingFacts.map((fact, index) => (
                <div key={index} className="text-sm text-gray-300 leading-relaxed">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 默认图例显示
  return (
    <Card className="w-64 bg-slate-900/95 border-slate-700 text-white shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-300">图例说明</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-gray-300">类地行星</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-xs text-gray-300">气态巨行星</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span className="text-xs text-gray-300">冰巨星</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-gray-300">恒星(太阳)</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            点击行星查看详细信息
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
