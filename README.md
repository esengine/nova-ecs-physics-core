# @esengine/nova-ecs-physics-core

Core physics engine abstraction layer for NovaECS - provides a pluggable physics engine architecture that allows you to choose and switch between different physics engines.

NovaECS的核心物理引擎抽象层 - 提供可插拔的物理引擎架构，允许您选择和切换不同的物理引擎。

[![npm version](https://badge.fury.io/js/%40esengine%2Fnova-ecs-physics-core.svg)](https://badge.fury.io/js/%40esengine%2Fnova-ecs-physics-core)
[![CI](https://github.com/esengine/nova-ecs-physics-core/workflows/CI/badge.svg)](https://github.com/esengine/nova-ecs-physics-core/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

## Features | 特性

- **🔌 Pluggable Architecture**: Switch between different physics engines without changing your game code | **可插拔架构**：无需更改游戏代码即可切换不同的物理引擎
- **🎯 Engine Agnostic**: Unified API that works with Box2D, Rapier, Cannon.js and more | **引擎无关**：统一的API，支持Box2D、Rapier、Cannon.js等
- **🧮 Fixed-Point Ready**: Seamless integration with @esengine/nova-ecs-math for deterministic physics | **定点数就绪**：与@esengine/nova-ecs-math无缝集成，实现确定性物理
- **⚡ High Performance**: Optimized ECS integration with efficient component and system design | **高性能**：优化的ECS集成，高效的组件和系统设计
- **🔧 TypeScript**: Full type safety and IntelliSense support | **TypeScript**：完整的类型安全和智能提示支持
- **📦 Modular**: Use only the features you need | **模块化**：只使用您需要的功能
- **🧪 Test Friendly**: Easy to mock and test physics behavior | **测试友好**：易于模拟和测试物理行为

## Architecture | 架构

```
@esengine/nova-ecs-physics-core          // Core abstraction layer | 核心抽象层
├── @esengine/nova-ecs-physics-box2d     // Box2D implementation | Box2D实现
├── @esengine/nova-ecs-physics-rapier    // Rapier implementation | Rapier实现 (planned)
└── @esengine/nova-ecs-physics-cannon    // Cannon implementation | Cannon实现 (planned)
```

## Installation | 安装

```bash
npm install @esengine/nova-ecs-physics-core
```

For specific physics engine implementations:
对于特定的物理引擎实现：

```bash
# Box2D implementation (recommended for 2D games)
npm install @esengine/nova-ecs-physics-box2d

# Rapier implementation (planned - for high-performance 2D/3D)
npm install @esengine/nova-ecs-physics-rapier

# Cannon implementation (planned - for 3D games)
npm install @esengine/nova-ecs-physics-cannon
```

## Quick Start | 快速开始

```typescript
import { World } from '@esengine/nova-ecs';
import { FixedVector2 } from '@esengine/nova-ecs-math';
import {
  RigidBodyComponent,
  ColliderComponent,
  PhysicsTransformComponent,
  RigidBodyType,
  ColliderType
} from '@esengine/nova-ecs-physics-core';

// This example assumes you have a physics plugin installed
// 此示例假设您已安装物理插件
import { Box2DPhysicsPlugin } from '@esengine/nova-ecs-physics-box2d';

// Create world and install physics plugin
const world = new World();
const physicsPlugin = new Box2DPhysicsPlugin({
  worldConfig: {
    gravity: new FixedVector2(0, -9.81)
  }
});

await world.plugins.install(physicsPlugin);

// Create a dynamic physics entity
const entity = world.createEntity();

// Add physics components
entity.addComponent(new PhysicsTransformComponent(
  new FixedVector2(0, 10), // position
  0,                       // rotation
  new FixedVector2(1, 1)   // scale
));

entity.addComponent(new RigidBodyComponent(
  RigidBodyType.Dynamic,   // type
  0.1,                     // linear damping
  0.1,                     // angular damping
  1.0                      // gravity scale
));

entity.addComponent(new ColliderComponent({
  type: ColliderType.Box,
  halfWidth: new Fixed(1),
  halfHeight: new Fixed(1)
}));

// Game loop
function gameLoop(deltaTime: number) {
  world.update(deltaTime);
}

setInterval(() => gameLoop(16), 16);
```

## Core Concepts | 核心概念

### Physics Engine Interface | 物理引擎接口

```typescript
interface IPhysicsEngine {
  readonly name: string;
  readonly version: string;
  
  createWorld(config: PhysicsWorldConfig): IPhysicsWorld;
  createRigidBody(world: IPhysicsWorld, config: RigidBodyConfig): IRigidBody;
  createCollider(body: IRigidBody, config: ColliderConfig): ICollider;
  
  initialize(): Promise<void>;
  destroy(): void;
}
```

### Components | 组件

- **RigidBodyComponent**: Represents a physics rigid body | 表示物理刚体
- **ColliderComponent**: Defines collision shapes and properties | 定义碰撞形状和属性
- **PhysicsTransformComponent**: Syncs with physics body transform | 与物理刚体变换同步
- **JointComponent**: Connects bodies with constraints | 用约束连接刚体
- **CollisionEventComponent**: Handles collision callbacks | 处理碰撞回调

### Systems | 系统

- **PhysicsWorldSystem**: Manages physics simulation stepping | 管理物理模拟步进
- **PhysicsBodySystem**: Creates and manages rigid bodies | 创建和管理刚体
- **PhysicsColliderSystem**: Creates and manages colliders | 创建和管理碰撞器
- **PhysicsJointSystem**: Creates and manages joints | 创建和管理关节

## Supported Physics Engines | 支持的物理引擎

### Box2D.js ✅
- **Status**: Available | **状态**：可用
- **Package**: `@esengine/nova-ecs-physics-box2d`
- **Best for**: 2D games, platformers, puzzle games | **最适合**：2D游戏、平台游戏、益智游戏
- **Features**: Mature, stable, deterministic | **特性**：成熟、稳定、确定性

### Rapier 🚧
- **Status**: Planned | **状态**：计划中
- **Package**: `@esengine/nova-ecs-physics-rapier`
- **Best for**: High-performance 2D/3D games | **最适合**：高性能2D/3D游戏
- **Features**: Fast, cross-platform, modern | **特性**：快速、跨平台、现代

### Cannon.js 🚧
- **Status**: Planned | **状态**：计划中
- **Package**: `@esengine/nova-ecs-physics-cannon`
- **Best for**: 3D games, simulations | **最适合**：3D游戏、仿真
- **Features**: Pure JavaScript, 3D focused | **特性**：纯JavaScript、专注3D

## Creating Custom Physics Engines | 创建自定义物理引擎

```typescript
import { BasePhysicsPlugin, IPhysicsEngine, IPhysicsEngineFactory } from '@esengine/nova-ecs-physics-core';

class MyPhysicsEngine implements IPhysicsEngine {
  readonly name = 'MyEngine';
  readonly version = '1.0.0';
  
  async initialize(): Promise<void> {
    // Initialize your physics engine
  }
  
  createWorld(config: PhysicsWorldConfig): IPhysicsWorld {
    // Create physics world
  }
  
  // Implement other required methods...
}

class MyPhysicsEngineFactory implements IPhysicsEngineFactory {
  createEngine(): IPhysicsEngine {
    return new MyPhysicsEngine();
  }
  
  getSupportedFeatures(): string[] {
    return ['2d', 'rigid-bodies', 'colliders'];
  }
  
  isFeatureSupported(feature: string): boolean {
    return this.getSupportedFeatures().includes(feature);
  }
}

class MyPhysicsPlugin extends BasePhysicsPlugin {
  constructor() {
    super('MyPhysics', '1.0.0', new MyPhysicsEngineFactory());
  }
}
```

## Development | 开发

### Prerequisites | 前置要求

- Node.js >= 16
- npm >= 7

### Setup | 设置

```bash
git clone https://github.com/esengine/nova-ecs-physics-core.git
cd nova-ecs-physics-core
npm install
```

### Scripts | 脚本

```bash
# Build the library | 构建库
npm run build

# Run tests | 运行测试
npm test

# Run linter | 运行代码检查
npm run lint

# Generate documentation | 生成文档
npm run docs
```

## Related Projects | 相关项目

- [NovaECS](https://github.com/esengine/NovaECS) - Next-generation Entity Component System framework | 下一代实体组件系统框架
- [nova-ecs-math](https://github.com/esengine/nova-ecs-math) - Fixed-point mathematics library | 定点数学库
- [nova-ecs-physics-box2d](https://github.com/esengine/nova-ecs-physics-box2d) - Box2D physics engine implementation | Box2D物理引擎实现

## License | 许可证

MIT
