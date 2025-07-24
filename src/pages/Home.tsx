/**
 * 太阳系3D模拟器主页面
 * 提供完整的太阳系可视化体验，包含控制面板、3D场景和信息面板
 */

import { useState, useEffect } from 'react'
import SolarSystem from '@/components/SolarSystem'
import ControlPanel from '@/components/ControlPanel'
import Legend from '@/components/Legend'
import PlanetList from '@/components/PlanetList'

/**
 * 格式化当前日期为中文格式
 */
function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 太阳系模拟器主页面组件
 */
export default function Home() {
  // 时间控制状态
  const [timeSpeed, setTimeSpeed] = useState(5)
  const [isPlaying, setIsPlaying] = useState(true)  // 默认播放
  const [simulationDate, setSimulationDate] = useState(new Date())

  // 视图控制状态
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [realScale, setRealScale] = useState(false)
  const [starBackground, setStarBackground] = useState(true)
  const [realisticRendering, setRealisticRendering] = useState(false) // 逼真渲染开关

  // 轨迹控制状态
  const [trailType, setTrailType] = useState('classic')
  const [trailLength, setTrailLength] = useState(50)
  const [trailIntensity, setTrailIntensity] = useState(70)

  // 侧边栏显示状态
  const [showPlanetList, setShowPlanetList] = useState(false)
  
  // 控制面板和图例显示状态
  const [showControlPanel, setShowControlPanel] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  
  // 选中的行星状态
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  
  // 视图模式状态
  const [viewMode, setViewMode] = useState<'solar-system' | 'galaxy-cluster'>('solar-system')
  


  // 更新模拟时间
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setSimulationDate(prevDate => {
        const newDate = new Date(prevDate)
        newDate.setDate(newDate.getDate() + timeSpeed)
        return newDate
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, timeSpeed])



  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative">
      {/* 左侧控制面板 */}
      {showControlPanel && (
        <div className="absolute top-0 left-0 z-10 h-full animate-in slide-in-from-left-4 duration-300">
          <ControlPanel
            timeSpeed={timeSpeed}
            setTimeSpeed={setTimeSpeed}
            showOrbits={showOrbits}
            setShowOrbits={setShowOrbits}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            realScale={realScale}
            setRealScale={setRealScale}
            starBackground={starBackground}
            setStarBackground={setStarBackground}
            trailType={trailType}
            setTrailType={setTrailType}
            trailLength={trailLength}
            setTrailLength={setTrailLength}
            trailIntensity={trailIntensity}
            setTrailIntensity={setTrailIntensity}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentDate={formatDate(simulationDate)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            realisticRendering={realisticRendering}
            setRealisticRendering={setRealisticRendering}
          />
        </div>
      )}





      {/* 3D太阳系主场景 */}
      <div className="w-full h-full">
        <SolarSystem
          timeSpeed={timeSpeed}
          showOrbits={showOrbits}
          showLabels={showLabels}
          realScale={realScale}
          starBackground={starBackground}
          trailType={trailType}
          trailLength={trailLength}
          trailIntensity={trailIntensity}
          isPlaying={isPlaying}
          onPlanetSelect={setSelectedPlanet}
          viewMode={viewMode}
          realisticRendering={realisticRendering}
        />
      </div>

      {/* 右下角图例 - 仅在选中行星时显示 */}
      {showLegend && selectedPlanet && (
        <div className="absolute bottom-4 right-4 z-10 animate-in slide-in-from-right-4 duration-300">
          <Legend 
            selectedPlanet={selectedPlanet}
            onPlanetDeselect={() => setSelectedPlanet(null)}
          />
        </div>
      )}

      {/* 可选的行星列表面板 */}
      {showPlanetList && (
        <div className="absolute top-4 right-4 z-10">
          <PlanetList />
        </div>
      )}

      {/* 简化浮动控制栏 - 当控制面板隐藏时显示 */}
      {!showControlPanel && (
        <div className="absolute top-16 left-4 z-20 animate-in slide-in-from-left-4 duration-300">
          <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 space-y-3 shadow-lg">
            {/* 标题栏 */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-600">
              <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
              <span className="text-sm font-medium text-blue-300">快速控制</span>
            </div>
            
            {/* 播放暂停按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-800 border border-slate-600 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                {isPlaying ? (
                  <>
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </>
                ) : (
                  <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent"></div>
                )}
                {isPlaying ? '暂停' : '播放'}
              </button>
            </div>
            
            {/* 快速时间控制 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-300">速度:</span>
              <div className="flex gap-1">
                {[0.5, 1, 2, 5].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setTimeSpeed(speed)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      timeSpeed === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
            
            {/* 时间显示 */}
            <div className="text-xs text-center">
              <div className="text-blue-300 mb-1">模拟时间</div>
              <div className="text-white font-mono">{formatDate(simulationDate)}</div>
            </div>
          </div>
        </div>
      )}

      {/* 右上角显示控制按钮 */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setShowControlPanel(!showControlPanel)}
          className="bg-slate-900/95 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
          {showControlPanel ? '隐藏' : '显示'}控制中心
        </button>
      </div>
    </div>
  )
}