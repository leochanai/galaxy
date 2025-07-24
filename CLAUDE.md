# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload (uses esbuild watch mode)
- `npm run build` - Create production build (minified, no sourcemaps)

## Architecture Overview

This is a 3D Solar System and Galaxy Cluster Simulator built with:

- **React 18** + **TypeScript** - UI framework with type safety
- **Three.js** + **@react-three/fiber** - 3D graphics rendering engine with React integration
- **@react-three/drei** - Three.js utilities and helpers
- **Tailwind CSS** - Styling framework
- **Radix UI** - Accessible component primitives
- **Custom esbuild setup** - Build system configured in `scripts/build.mjs`

### Key Components

- `SolarSystem.tsx` - Main 3D scene component handling planet rendering and interactions
- `Galaxy.tsx` - Galaxy cluster visualization component
- `ControlPanel.tsx` - Left sidebar with time controls, display options, and settings
- `Legend.tsx` - Right sidebar with planet information and legends
- `PlanetList.tsx` - Interactive list of planets with focus functionality

### Data Architecture

The application uses a data-driven approach with separate data files:

- `src/data/galaxyData.ts` - Galaxy information, types, and positioning data
- `src/data/planetData.ts` - Solar system planet configurations
- `src/data/satelliteData.ts` - Moon and satellite data for planets

Each data structure includes both scientific information and display properties (colors, sizes, distances) optimized for 3D visualization.

### 3D Rendering System

- Uses React Three Fiber's Canvas component as the root 3D container
- Planet objects are rendered as Three.js meshes with custom materials
- Orbit paths use THREE.RingGeometry for visual orbit indicators
- Camera controls handled by @react-three/drei's OrbitControls
- Star field background using THREE.Points for performance

### State Management

- Uses React hooks for local component state
- Props drilling for shared state between SolarSystem and control components
- Time-based animations using useFrame hook from @react-three/fiber

### Build System

Custom esbuild configuration in `scripts/build.mjs`:
- Bundles TypeScript/React with automatic JSX transformation
- Processes Tailwind CSS via PostCSS plugin
- Handles static assets (HTML, images)
- Development mode includes file watching and local server
- Production mode enables minification and tree shaking

## UI Component System

Uses shadcn/ui pattern with Radix UI primitives:
- All UI components in `src/components/ui/`
- Consistent dark theme styling
- Accessible component implementations
- Tailwind CSS utility classes for styling

## Language and Localization

- Primary language is Chinese (Simplified)
- UI text and comments are in Chinese
- Scientific data includes both Chinese and English names where applicable