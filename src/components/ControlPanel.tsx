import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause } from 'lucide-react'

/**
 * 控制面板属性接口
 */
interface ControlPanelProps {
  timeSpeed: number
  setTimeSpeed: (value: number) => void
  showOrbits: boolean
  setShowOrbits: (value: boolean) => void
  showLabels: boolean
  setShowLabels: (value: boolean) => void
  realScale: boolean
  setRealScale: (value: boolean) => void
  starBackground: boolean
  setStarBackground: (value: boolean) => void
  trailType: string
  setTrailType: (value: string) => void
  trailLength: number
  setTrailLength: (value: number) => void
  trailIntensity: number
  setTrailIntensity: (value: number) => void
  isPlaying: boolean
  setIsPlaying: (value: boolean) => void
  currentDate: string
  viewMode: 'solar-system' | 'galaxy-cluster'
  setViewMode: (mode: 'solar-system' | 'galaxy-cluster') => void
  realisticRendering: boolean
  setRealisticRendering: (value: boolean) => void
}

/**
 * 控制项组件
 */
function ControlItem({ 
  label, 
  children, 
  className = "" 
}: { 
  label: string
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${className}`}>
      <span className="text-sm font-medium text-blue-200 min-w-[80px]">{label}:</span>
      <div className="flex-1 ml-3">{children}</div>
    </div>
  )
}

/**
 * 太阳系控制面板组件
 */
export default function ControlPanel(props: ControlPanelProps) {
  const {
    timeSpeed,
    setTimeSpeed,
    showOrbits,
    setShowOrbits,
    showLabels,
    setShowLabels,
    realScale,
    setRealScale,
    starBackground,
    setStarBackground,
    trailType,
    setTrailType,
    trailLength,
    setTrailLength,
    trailIntensity,
    setTrailIntensity,
    isPlaying,
    setIsPlaying,
    currentDate,
    viewMode,
    setViewMode,
    realisticRendering,
    setRealisticRendering
  } = props

  return (
    <Card className="w-80 h-full bg-slate-900 border-slate-700 text-white shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg font-medium flex items-center gap-2 ${
          viewMode === 'galaxy-cluster' ? 'text-purple-300' : 'text-blue-300'
        }`}>
          <div className={`w-3 h-3 rounded-sm ${
            viewMode === 'galaxy-cluster' ? 'bg-purple-400' : 'bg-blue-400'
          }`}></div>
          {viewMode === 'galaxy-cluster' ? '星系观测中心' : '太阳系控制中心'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {/* 视图模式切换 */}
        <div className="pb-2 border-b border-slate-700 mb-2">
          <h4 className="text-sm font-medium text-blue-300 mb-2">视图模式</h4>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => setViewMode('solar-system')}
              className={`px-3 py-2.5 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'solar-system' 
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-lg shadow-blue-500/20' 
                  : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-base">🌍</span>
              <span>太阳系</span>
            </button>
            <button
              onClick={() => setViewMode('galaxy-cluster')}
              className={`px-3 py-2.5 rounded text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'galaxy-cluster' 
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-lg shadow-purple-500/20' 
                  : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-base">🌌</span>
              <span>星系群</span>
            </button>
          </div>
        </div>

        {/* 时间控制 */}
        <ControlItem label="时间速度">
          <div className="flex items-center gap-2 flex-1">
            <Slider
              value={[timeSpeed]}
              onValueChange={(value) => setTimeSpeed(value[0])}
              max={10}
              min={0.1}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-blue-300 min-w-[30px] text-right">
              {timeSpeed.toFixed(1)}x
            </span>
          </div>
        </ControlItem>

        {/* 显示选项 */}
        {viewMode === 'solar-system' && (
          <ControlItem label="显示轨道">
            <Switch
              checked={showOrbits}
              onCheckedChange={setShowOrbits}
            />
          </ControlItem>
        )}

        <ControlItem label="显示标签">
          <Switch
            checked={showLabels}
            onCheckedChange={setShowLabels}
          />
        </ControlItem>

        {viewMode === 'solar-system' && (
          <ControlItem label="逼真纹理">
            <Switch
              checked={realisticRendering}
              onCheckedChange={setRealisticRendering}
            />
          </ControlItem>
        )}

        {viewMode === 'solar-system' && (
          <ControlItem label="真实比例">
            <Switch
              checked={realScale}
              onCheckedChange={setRealScale}
            />
          </ControlItem>
        )}

        <ControlItem label="星空背景">
          <Switch
            checked={starBackground}
            onCheckedChange={setStarBackground}
          />
        </ControlItem>

        {/* 运动轨迹设置 - 只在太阳系视图显示 */}
        {viewMode === 'solar-system' && (
          <div className="pt-1 border-t border-slate-700">
            <h4 className="text-sm font-medium text-blue-300 mb-2">运动轨迹</h4>
          
            <ControlItem label="拖尾类型">
              <Select value={trailType} onValueChange={setTrailType}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="bg-slate-800 border border-slate-600 shadow-xl"
                  style={{ zIndex: 9999 }}
                  sideOffset={4}
                >
                  <SelectItem 
                    value="classic" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    经典虚线
                  </SelectItem>
                  <SelectItem 
                    value="glow" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    发光流
                  </SelectItem>
                  <SelectItem 
                    value="particle" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    粒子效果
                  </SelectItem>
                  <SelectItem 
                    value="meteor" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    流星尾
                  </SelectItem>
                  <SelectItem 
                    value="rainbow" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    彩虹光
                  </SelectItem>
                  <SelectItem 
                    value="solid" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    实线
                  </SelectItem>
                  <SelectItem 
                    value="none" 
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    无拖尾
                  </SelectItem>
                </SelectContent>
              </Select>
            </ControlItem>

            <ControlItem label="拖尾长度">
              <div className="flex items-center gap-2 flex-1">
                <Slider
                  value={[trailLength]}
                  onValueChange={(value) => setTrailLength(value[0])}
                  max={100}
                  min={10}
                  step={10}
                  className="flex-1"
                />
                <span className="text-xs text-blue-300 min-w-[30px] text-right">
                  {trailLength}
                </span>
              </div>
            </ControlItem>

            <ControlItem label="拖尾强度">
              <div className="flex items-center gap-2 flex-1">
                <Slider
                  value={[trailIntensity]}
                  onValueChange={(value) => setTrailIntensity(value[0])}
                  max={100}
                  min={10}
                  step={10}
                  className="flex-1"
                />
                <span className="text-xs text-blue-300 min-w-[30px] text-right">
                  {trailIntensity}%
                </span>
              </div>
            </ControlItem>
          </div>
        )}

        {/* 播放控制 - 只在太阳系视图显示 */}
        {viewMode === 'solar-system' && (
          <div className="pt-1 border-t border-slate-700">
            <ControlItem label="暂停/播放">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 transition-colors bg-transparent"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isPlaying ? '暂停' : '播放'}
              </Button>
            </ControlItem>
          </div>
        )}

        {/* 时间显示 - 只在太阳系视图显示 */}
        {viewMode === 'solar-system' && (
          <div className="pt-1 border-t border-slate-700">
            <div className="text-center">
              <div className="text-xs text-blue-300 mb-1">模拟时间</div>
              <div className="text-sm font-mono text-white">{currentDate}</div>
            </div>
          </div>
        )}

        {/* 星系群视图信息 */}
        {viewMode === 'galaxy-cluster' && (
          <div className="pt-1 border-t border-slate-700">
            <div className="text-center">
              <div className="text-xs text-purple-300 mb-1">观察范围</div>
              <div className="text-sm font-mono text-white">本星系群</div>
              <div className="text-xs text-purple-300 mt-1">约1000万光年</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
