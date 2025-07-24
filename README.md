# 3D太阳系模拟器

一个基于React、Three.js和Tailwind CSS构建的交互式3D太阳系模拟器，提供真实的行星运动模拟和丰富的科普信息。

## 🌟 功能特性

### 🎮 交互控制
- **时间控制**: 调节时间流速，支持暂停/播放
- **视角控制**: 自由旋转、缩放、平移3D场景
- **轨道显示**: 切换行星轨道的显示/隐藏
- **标签显示**: 切换行星名称标签的显示/隐藏
- **焦点切换**: 快速聚焦到特定行星

### 🪐 天体系统
- **太阳系九大天体**: 太阳 + 八大行星完整模拟
- **真实轨道**: 基于真实天文数据的轨道运动
- **类型分类**: 类地行星、气态巨行星、冰巨星分类显示
- **科学配色**: 根据实际天体颜色进行视觉设计

### 🎨 视觉效果
- **星空背景**: 沉浸式宇宙星空环境
- **运动轨迹**: 多种拖尾效果选择
- **材质渲染**: 真实的光照和材质效果
- **响应式设计**: 适配各种屏幕尺寸

## 🚀 快速开始

### 环境要求
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可体验3D太阳系模拟器。

## 🏗️ 技术架构

### 核心技术栈
- **React 18**: 用户界面构建
- **Three.js**: 3D图形渲染引擎
- **@react-three/fiber**: React的Three.js渲染器
- **@react-three/drei**: Three.js辅助工具库
- **Tailwind CSS**: 实用优先的CSS框架
- **Radix UI**: 无障碍组件库
- **TypeScript**: 类型安全的JavaScript

### 组件架构
```
src/
├── components/
│   ├── SolarSystem.tsx     # 3D太阳系主场景
│   ├── ControlPanel.tsx    # 左侧控制面板
│   ├── Legend.tsx          # 右下角图例说明
│   ├── PlanetList.tsx      # 行星信息列表
│   └── ui/                 # 基础UI组件
├── pages/
│   └── Home.tsx           # 主页面
└── lib/
    └── utils.ts           # 工具函数
```

## 🎯 使用指南

### 基本操作
1. **场景控制**: 
   - 鼠标左键拖拽: 旋转视角
   - 鼠标滚轮: 缩放场景
   - 鼠标右键拖拽: 平移场景

2. **时间控制**:
   - 时间速度滑块: 调节模拟时间流速
   - 播放/暂停按钮: 控制动画播放状态

3. **显示选项**:
   - 显示轨道: 切换轨道环的显示
   - 显示标签: 切换行星名称显示
   - 真实比例: 切换真实/视觉比例模式

### 高级功能
- **焦点跟踪**: 选择特定行星进行跟踪观察
- **轨迹效果**: 自定义运动拖尾的类型和强度
- **信息面板**: 查看详细的行星科普信息

## 🔧 自定义开发

### 添加新行星
在 `SolarSystem.tsx` 中的 `planetsData` 数组添加新的行星配置：

```typescript
{
  name: '新行星',
  nameEn: 'NewPlanet',
  distance: 25,
  size: 0.8,
  color: '#FF6B6B',
  speed: 0.006,
  type: 'ice'
}
```

### 修改视觉效果
- 调整 `StarField` 组件修改星空背景
- 修改 `Planet` 组件的材质属性改变行星外观
- 自定义 `OrbitRing` 组件样式调整轨道显示

### 扩展控制面板
在 `ControlPanel.tsx` 中添加新的控制项：

```typescript
<ControlItem label="新功能">
  <Switch
    checked={newFeature}
    onCheckedChange={setNewFeature}
  />
</ControlItem>
```

## 📱 响应式支持

项目采用响应式设计，支持以下设备：
- 桌面端 (1920x1080及以上)
- 平板端 (768x1024)
- 移动端 (375x667及以上)

## 🎨 主题定制

使用Tailwind CSS的深色主题系统，主要颜色配置：
- 主背景: `bg-gray-900`
- 面板背景: `bg-slate-900/95`
- 边框颜色: `border-slate-700`
- 主色调: `text-blue-300`

## 📈 性能优化

- 使用 `useFrame` 钩子优化动画渲染
- 通过 `useMemo` 缓存几何体和材质
- 星空背景采用点云系统减少渲染开销
- 组件懒加载提升初始加载速度

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- Three.js 社区提供的优秀3D库
- NASA JPL 提供的行星数据参考
- Radix UI 提供的无障碍组件支持
- Tailwind CSS 提供的样式系统

---

**享受探索宇宙的乐趣！** 🚀✨
