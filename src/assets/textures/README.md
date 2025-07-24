# 行星纹理资源指南

本目录用于存放高质量的行星纹理文件，以实现逼真的3D行星效果。

## 推荐纹理来源

### 1. NASA官方资源（免费）
- **网站**: https://www.nasa.gov/multimedia/imagegallery/
- **特色**: 真实的卫星图像和科学数据
- **格式**: 通常为高分辨率JPEG/PNG

### 2. Solar System Scope（免费）
- **网站**: https://www.solarsystemscope.com/textures/
- **特色**: 专门的行星纹理包
- **格式**: 各种分辨率的纹理贴图

### 3. Planetary Pixel Emporium（免费）
- **网站**: http://planetpixelemporium.com/
- **特色**: 专业的行星纹理数据库
- **格式**: 多种贴图类型（漫反射、法线、镜面等）

## 所需纹理类型

每个行星建议包含以下纹理文件：

### 基础纹理
- `{planet}_diffuse.jpg` - 漫反射贴图（基础颜色）2K-4K分辨率
- `{planet}_normal.jpg` - 法线贴图（表面细节）
- `{planet}_specular.jpg` - 镜面反射贴图（水面、冰面反光）

### 高级纹理
- `{planet}_height.jpg` - 高度贴图（地形起伏）
- `{planet}_roughness.jpg` - 粗糙度贴图
- `{planet}_emissive.jpg` - 发光贴图（城市灯光等）

### 大气效果
- `{planet}_clouds.jpg` - 云层纹理（地球、金星等）
- `{planet}_atmosphere.jpg` - 大气散射贴图

## 文件命名规范

```
planets/
├── earth/
│   ├── earth_diffuse.jpg     (4K推荐)
│   ├── earth_normal.jpg      (2K推荐)
│   ├── earth_specular.jpg    (2K推荐)  
│   ├── earth_night.jpg       (发光贴图)
│   └── earth_clouds.jpg      (云层贴图)
├── mars/
│   ├── mars_diffuse.jpg
│   ├── mars_normal.jpg
│   └── mars_height.jpg
└── ...
```

## 纹理优化建议

### 分辨率选择
- **漫反射贴图**: 2K-4K (2048x1024 - 4096x2048)
- **法线贴图**: 2K (2048x1024)
- **其他贴图**: 1K-2K (1024x512 - 2048x1024)

### 格式优化
- 使用JPEG格式减少文件大小
- 对于需要透明度的贴图使用PNG
- 考虑使用WebP格式进一步压缩

### 性能优化
- 提供多个分辨率版本（LOD）
- 使用mipmap提高渲染性能
- 考虑使用纹理压缩格式

## 具体行星建议

### 地球 Earth
- **漫反射**: 真实卫星图像，显示大陆、海洋
- **法线贴图**: 地形高度数据转换
- **镜面贴图**: 海洋区域高反射，陆地低反射
- **发光贴图**: 夜晚城市灯光
- **云层贴图**: 实时气象云图

### 火星 Mars
- **漫反射**: 火星表面颜色纹理
- **法线贴图**: 峡谷、环形山细节
- **高度贴图**: 奥林匹斯山等地形特征

### 木星 Jupiter
- **漫反射**: 大红斑和条纹图案
- **动态效果**: 大气层条纹动画

### 土星 Saturn
- **漫反射**: 土星表面纹理
- **环系统**: 单独的环系统纹理

## 版权注意事项

- NASA图像通常为公有领域，可自由使用
- 其他来源请检查具体的使用许可
- 商业使用前请确认版权状态
- 建议保留原始来源信息

## 安装步骤

1. 从推荐网站下载纹理文件
2. 按照命名规范重命名文件
3. 放置到对应的行星目录中
4. 更新代码中的纹理路径
5. 测试加载和渲染效果