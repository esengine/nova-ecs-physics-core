# @esengine/nova-ecs-physics-core

Core physics engine abstraction layer for NovaECS - provides a pluggable, type-safe physics engine architecture with comprehensive event handling and debugging capabilities.

NovaECS的核心物理引擎抽象层 - 提供可插拔、类型安全的物理引擎架构，具备完善的事件处理和调试功能。

[![npm version](https://badge.fury.io/js/%40esengine%2Fnova-ecs-physics-core.svg)](https://badge.fury.io/js/%40esengine%2Fnova-ecs-physics-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features | 特性

### 🏗️ Core Architecture | 核心架构
- **🔌 Pluggable Design**: Engine-agnostic abstraction layer supporting multiple physics engines | **可插拔设计**：支持多种物理引擎的引擎无关抽象层
- **🎯 Type Safety**: 100% TypeScript with full type safety and IntelliSense support | **类型安全**：100% TypeScript，完整的类型安全和智能提示
- **⚡ High Performance**: Optimized ECS integration with efficient memory management | **高性能**：优化的ECS集成，高效的内存管理

### 🧮 Deterministic Physics | 确定性物理
- **🎲 Fixed-Point Math**: Seamless integration with @esengine/nova-ecs-math for cross-platform consistency | **定点数学**：与@esengine/nova-ecs-math无缝集成，确保跨平台一致性
- **🔄 Reproducible**: Deterministic physics simulation for multiplayer and replay systems | **可重现**：确定性物理模拟，支持多人游戏和回放系统

### 📡 Advanced Event System | 高级事件系统
- **🎪 Rich Events**: 13 types of physics events (collision, sensor, joint, body lifecycle) | **丰富事件**：13种物理事件类型（碰撞、传感器、关节、物体生命周期）
- **⚡ Real-time**: Event-driven architecture with priority-based processing | **实时**：事件驱动架构，支持优先级处理
- **🔗 Decoupled**: Loose coupling between physics and game logic | **解耦**：物理和游戏逻辑之间的松耦合

### 🐛 Debug & Development | 调试和开发
- **🎨 Visual Debug**: Comprehensive debug rendering system with customizable styles | **可视化调试**：全面的调试渲染系统，可自定义样式
- **📊 Performance Monitor**: Built-in profiling and statistics tracking | **性能监控**：内置性能分析和统计跟踪
- **🔧 Developer Tools**: Rich debugging interfaces and utilities | **开发者工具**：丰富的调试接口和工具

### 🧩 Extensibility | 可扩展性
- **📦 Modular**: Use only the components you need | **模块化**：只使用您需要的组件
- **🔧 Extensible**: Easy to extend with custom physics engines and features | **可扩展**：易于扩展自定义物理引擎和功能
- **🧪 Test Friendly**: Mockable interfaces for easy testing | **测试友好**：可模拟的接口，便于测试

## 📦 Installation | 安装

```bash
npm install @esengine/nova-ecs-physics-core
```

## API Documentation | API 文档

For complete API documentation, visit: [https://esengine.github.io/nove-ecs-physics-core/](https://esengine.github.io/nova-ecs-physics-core/)

完整的API文档请访问：[https://esengine.github.io/nove-ecs-physics-core/](https://esengine.github.io/nova-ecs-physics-core/)


## 🚀 Quick Start | 快速开始

```typescript
import { World } from '@esengine/nova-ecs';
import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import {
  // Components
  RigidBodyComponent,
  ColliderComponent,
  PhysicsTransformComponent,
  CollisionEventComponent,
  
  // Types
  RigidBodyType,
  ColliderType,
  
  // Events
  CollisionBeginEvent,
  CollisionEndEvent
} from '@esengine/nova-ecs-physics-core';

// This example assumes you have a physics plugin installed
// 此示例假设您已安装物理插件
// import { Box2DPhysicsPlugin } from '@esengine/nova-ecs-physics-box2d';

async function setupPhysics() {
  // Create world and install physics plugin
  const world = new World();
  
  /* const physicsPlugin = new Box2DPhysicsPlugin({
    worldConfig: {
      gravity: new FixedVector2(0, -9.81),
      allowSleep: true
    }
  });
  
  await world.plugins.install(physicsPlugin); */

  // Create a dynamic physics entity
  const entity = world.createEntity();

  // Add transform component
  entity.addComponent(new PhysicsTransformComponent(
    new FixedVector2(0, 10), // position
    new Fixed(0),            // rotation
    new FixedVector2(1, 1)   // scale
  ));

  // Add rigid body component
  entity.addComponent(new RigidBodyComponent(
    RigidBodyType.Dynamic,   // type
    new Fixed(0.1),          // linear damping
    new Fixed(0.1),          // angular damping
    new Fixed(1.0),          // gravity scale
    true,                    // allow sleep
    false,                   // fixed rotation
    false                    // bullet (for fast moving objects)
  ));

  // Add box collider
  entity.addComponent(new ColliderComponent(
    {
      type: ColliderType.Box,
      halfWidth: new Fixed(1),
      halfHeight: new Fixed(1)
    },
    {
      friction: new Fixed(0.3),
      restitution: new Fixed(0.1),
      density: new Fixed(1.0)
    }
  ));

  // Add collision event handling
  const collisionComp = new CollisionEventComponent();
  collisionComp.addCollisionBeginCallback((other) => {
    console.log(`Collision started with entity ${(other as any).id}`);
  });
  entity.addComponent(collisionComp);

  // Subscribe to global physics events
  world.eventBus.subscribe(CollisionBeginEvent, (event) => {
    console.log('Global collision detected!');
    const impulse = event.getTotalImpulse();
    console.log(`Collision impulse: ${impulse.toNumber()}`);
  });

  // Game loop
  function gameLoop(deltaTime: number) {
    world.update(deltaTime);
  }

  setInterval(() => gameLoop(16), 16);
}

setupPhysics();
```

## 🏗️ Architecture | 架构

### Core Interfaces | 核心接口

```typescript
// Main physics engine interface
interface IPhysicsEngine {
  readonly name: string;
  readonly version: string;
  
  createWorld(config: PhysicsWorldConfig): IPhysicsWorld;
  createRigidBody(world: IPhysicsWorld, config: RigidBodyConfig): IRigidBody;
  createCollider(body: IRigidBody, config: ColliderConfig): ICollider;
  createJoint(world: IPhysicsWorld, config: BaseJointConfig): IJoint;
  
  initialize(): Promise<void>;
  destroy(): void;
}

// Physics world interface
interface IPhysicsWorld {
  step(deltaTime: Fixed): void;
  setGravity(gravity: FixedVector2): void;
  getGravity(): FixedVector2;
  raycast(input: RaycastInput): RaycastResult[];
  queryAABB(lowerBound: FixedVector2, upperBound: FixedVector2): unknown[];
  onCollision(callback: (data: CollisionEventData) => void): void;
  destroy(): void;
}
```

### Components | 组件

| Component | Description | 描述 |
|-----------|-------------|------|
| `RigidBodyComponent` | Physics rigid body properties | 物理刚体属性 |
| `ColliderComponent` | Collision shapes and materials | 碰撞形状和材质 |
| `PhysicsTransformComponent` | Transform synchronized with physics | 与物理同步的变换 |
| `JointComponent` | Constraints between bodies | 物体之间的约束 |
| `CollisionEventComponent` | Collision event callbacks | 碰撞事件回调 |

### Systems | 系统

| System | Responsibility | 职责 |
|--------|----------------|------|
| `PhysicsWorldSystem` | Manages physics simulation and events | 管理物理模拟和事件 |
| `PhysicsBodySystem` | Creates and manages rigid bodies | 创建和管理刚体 |
| `PhysicsColliderSystem` | Creates and manages colliders | 创建和管理碰撞器 |
| `PhysicsJointSystem` | Creates and manages joints | 创建和管理关节 |

## 📡 Event System | 事件系统

### Physics Events | 物理事件

```typescript
import {
  // Collision Events
  CollisionBeginEvent,
  CollisionEndEvent,
  PreSolveEvent,
  PostSolveEvent,
  
  // Sensor Events
  SensorBeginEvent,
  SensorEndEvent,
  
  // Body Events
  BodySleepEvent,
  BodyWakeEvent,
  
  // Joint Events
  JointBreakEvent,
  
  // Step Events
  PhysicsStepBeginEvent,
  PhysicsStepEndEvent,
  
  // Raycast Events
  RaycastHitEvent
} from '@esengine/nova-ecs-physics-core';

// Subscribe to collision events
world.eventBus.subscribe(CollisionBeginEvent, (event) => {
  const bodyA = event.bodyA;
  const bodyB = event.bodyB;
  const impulse = event.getTotalImpulse();
  
  console.log(`Collision impulse: ${impulse.toNumber()}`);
});

// Handle sensor triggers
world.eventBus.subscribe(SensorBeginEvent, (event) => {
  console.log('Something entered the sensor!');
});

// Monitor joint breaking
world.eventBus.subscribe(JointBreakEvent, (event) => {
  const breakForce = event.breakForce;
  console.log(`Joint broke with force: ${breakForce.toNumber()}`);
});
```

### Event Manager | 事件管理器

```typescript
interface IPhysicsEventManager {
  // Collision events
  onCollisionBegin(listener: EventListener<CollisionBeginEvent>): void;
  onCollisionEnd(listener: EventListener<CollisionEndEvent>): void;
  
  // Sensor events
  onSensorBegin(listener: EventListener<SensorBeginEvent>): void;
  onSensorEnd(listener: EventListener<SensorEndEvent>): void;
  
  // Body events
  onBodySleep(listener: EventListener<BodySleepEvent>): void;
  onBodyWake(listener: EventListener<BodyWakeEvent>): void;
  
  // Utilities
  emit(event: PhysicsEvent): void;
  clearAllListeners(): void;
  getListenerCount(eventType: string): number;
}
```

## 🐛 Debug & Development | 调试和开发

### Debug Renderer | 调试渲染器

```typescript
import {
  IPhysicsDebugRenderer,
  BasePhysicsDebugRenderer,
  DEFAULT_DEBUG_CONFIG,
  DEFAULT_DEBUG_COLORS
} from '@esengine/nova-ecs-physics-core';

// Create custom debug renderer
class CanvasDebugRenderer extends BasePhysicsDebugRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  // Implement abstract methods
  beginFrame(): void { /* ... */ }
  endFrame(): void { /* ... */ }
  clear(): void { /* ... */ }
  
  drawLine(start: FixedVector2, end: FixedVector2, color: string): void {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x.toNumber(), start.y.toNumber());
    this.ctx.lineTo(end.x.toNumber(), end.y.toNumber());
    this.ctx.stroke();
  }
  
  // ... other drawing methods
}

// Setup debug renderer
const canvas = document.getElementById('debug-canvas') as HTMLCanvasElement;
const debugRenderer = new CanvasDebugRenderer(canvas);

debugRenderer.setEnabled(true);
debugRenderer.setConfig({
  drawBodies: true,
  drawColliders: true,
  drawJoints: true,
  drawContactPoints: true,
  drawStatistics: true
});

// Custom colors
debugRenderer.setColors({
  dynamicBody: '#00FF00',
  staticBody: '#FFFFFF',
  sensor: '#FF00FF',
  contactPoint: '#FF0000'
});
```

### Performance Monitoring | 性能监控

```typescript
interface PhysicsDebugStats {
  bodyCount: number;
  activeBodies: number;
  sleepingBodies: number;
  colliderCount: number;
  jointCount: number;
  contactCount: number;
  stepTime: Fixed;
  fps: number;
  memoryUsage: number;
}

// Display performance stats
debugRenderer.drawStatistics({
  bodyCount: 100,
  activeBodies: 75,
  sleepingBodies: 25,
  colliderCount: 120,
  jointCount: 10,
  contactCount: 45,
  stepTime: new Fixed(2.5), // milliseconds
  fps: 60,
  memoryUsage: 1024 * 1024 // bytes
});
```

## 🔧 Advanced Features | 高级功能

### Joint System | 关节系统

```typescript
import {
  // Joint Types
  DistanceJointConfig,
  RevoluteJointConfig,
  PrismaticJointConfig,
  WeldJointConfig,
  RopeJointConfig,
  MouseJointConfig,
  PulleyJointConfig,
  GearJointConfig,
  MotorJointConfig,
  WheelJointConfig,
  
  // Joint Features
  JointLimits,
  JointMotor,
  JointBreakSettings
} from '@esengine/nova-ecs-physics-core';

// Create a revolute joint (hinge)
const revoluteJoint: RevoluteJointConfig = {
  type: JointType.Revolute,
  bodyA: bodyA,
  bodyB: bodyB,
  localAnchorA: new FixedVector2(0, 0),
  localAnchorB: new FixedVector2(1, 0),
  enableLimit: true,
  lowerAngle: Fixed.PI.negate(),
  upperAngle: Fixed.PI,
  enableMotor: true,
  motorSpeed: new Fixed(2),
  maxMotorTorque: new Fixed(100)
};

// Create a distance joint with spring properties
const distanceJoint: DistanceJointConfig = {
  type: JointType.Distance,
  bodyA: bodyA,
  bodyB: bodyB,
  localAnchorA: new FixedVector2(0, 0),
  localAnchorB: new FixedVector2(0, 0),
  length: new Fixed(5),
  stiffness: new Fixed(1000),
  damping: new Fixed(50)
};
```

### Collision Filtering | 碰撞过滤

```typescript
// Define collision categories
const COLLISION_CATEGORIES = {
  PLAYER: 0x0001,
  ENEMY: 0x0002,
  GROUND: 0x0004,
  PICKUP: 0x0008,
  PROJECTILE: 0x0010
} as const;

// Create collision filter
const playerFilter: CollisionFilter = {
  categoryBits: COLLISION_CATEGORIES.PLAYER,
  maskBits: COLLISION_CATEGORIES.GROUND | COLLISION_CATEGORIES.ENEMY | COLLISION_CATEGORIES.PICKUP,
  groupIndex: 0
};

// Apply to collider
const collider = new ColliderComponent(
  {
    type: ColliderType.Circle,
    radius: new Fixed(0.5)
  },
  {
    friction: new Fixed(0.7),
    restitution: new Fixed(0.0),
    density: new Fixed(1.0)
  },
  playerFilter, // collision filter
  false         // is sensor
);
```

## 🎮 Supported Physics Engines | 支持的物理引擎

### ✅ Available Now | 现已可用

#### Box2D.js
- **Package**: `@esengine/nova-ecs-physics-box2d`
- **Version**: 2D physics engine
- **Best for**: Platformers, puzzle games, 2D simulations
- **Features**: Mature, stable, deterministic, extensive joint support
- **最适合**: 平台游戏、益智游戏、2D仿真
- **特性**: 成熟、稳定、确定性、广泛的关节支持

### 🚧 Coming Soon | 即将推出

#### Rapier
- **Package**: `@esengine/nova-ecs-physics-rapier`
- **Version**: 2D/3D physics engine
- **Best for**: High-performance games, 3D simulations
- **Features**: Rust-powered, cross-platform, modern architecture
- **最适合**: 高性能游戏、3D仿真
- **特性**: Rust驱动、跨平台、现代架构

#### Cannon.js
- **Package**: `@esengine/nova-ecs-physics-cannon`
- **Version**: 3D physics engine
- **Best for**: 3D web games, vehicle simulations
- **Features**: Pure JavaScript, lightweight, 3D focused
- **最适合**: 3D网页游戏、车辆仿真
- **特性**: 纯JavaScript、轻量级、专注3D

## 🔧 Creating Custom Physics Engines | 创建自定义物理引擎

```typescript
import {
  BasePhysicsPlugin,
  IPhysicsEngine,
  IPhysicsEngineFactory,
  PhysicsLogger
} from '@esengine/nova-ecs-physics-core';

// Implement physics engine
class MyPhysicsEngine implements IPhysicsEngine {
  readonly name = 'MyEngine';
  readonly version = '1.0.0';
  
  async initialize(): Promise<void> {
    PhysicsLogger.log('Initializing MyPhysicsEngine...');
    // Initialize your physics engine
  }
  
  createWorld(config: PhysicsWorldConfig): IPhysicsWorld {
    // Create and return physics world implementation
    return new MyPhysicsWorld(config);
  }
  
  createRigidBody(world: IPhysicsWorld, config: RigidBodyConfig): IRigidBody {
    // Create and return rigid body implementation
    return new MyRigidBody(config);
  }
  
  createCollider(body: IRigidBody, config: ColliderConfig): ICollider {
    // Create and return collider implementation
    return new MyCollider(body, config);
  }
  
  createJoint(world: IPhysicsWorld, config: BaseJointConfig): IJoint {
    // Create and return joint implementation
    return new MyJoint(world, config);
  }
  
  destroy(): void {
    PhysicsLogger.log('Destroying MyPhysicsEngine...');
    // Cleanup resources
  }
}

// Create engine factory
class MyPhysicsEngineFactory implements IPhysicsEngineFactory {
  createEngine(): IPhysicsEngine {
    return new MyPhysicsEngine();
  }
  
  getSupportedFeatures(): string[] {
    return ['2d', '3d', 'rigid-bodies', 'colliders', 'joints', 'sensors'];
  }
  
  isFeatureSupported(feature: string): boolean {
    return this.getSupportedFeatures().includes(feature);
  }
}

// Create plugin
class MyPhysicsPlugin extends BasePhysicsPlugin {
  constructor(config?: PhysicsPluginConfig) {
    super('MyPhysics', '1.0.0', new MyPhysicsEngineFactory(), config);
  }
}

// Usage
const world = new World();
const plugin = new MyPhysicsPlugin({
  worldConfig: {
    gravity: new FixedVector2(0, -9.81)
  },
  enableDebugRender: true
});

await world.plugins.install(plugin);
```

## 🛠️ Development | 开发

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

# Run tests with coverage | 运行测试并生成覆盖率报告
npm run test:coverage

# Run linter (TypeScript + ESLint) | 运行代码检查
npm run lint

# Fix linting issues | 修复代码问题
npm run lint:fix

# Format code | 格式化代码
npm run format

# Generate API documentation | 生成API文档
npm run docs

# Development mode with watch | 开发模式（监听文件变化）
npm run dev
```

## 🤝 Contributing | 贡献

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 获取指南。

### Development Workflow | 开发流程

1. Fork the repository | 分叉仓库
2. Create a feature branch | 创建功能分支
3. Make your changes with tests | 进行更改并添加测试
4. Run `npm run lint` to check code quality | 运行代码质量检查
5. Run `npm test` to ensure tests pass | 确保测试通过
6. Submit a pull request | 提交拉取请求

## 📖 Related Projects | 相关项目

- [**NovaECS**](https://github.com/esengine/NovaECS) - Next-generation ECS framework | 下一代ECS框架
- [**nova-ecs-math**](https://github.com/esengine/nova-ecs-math) - Fixed-point mathematics library | 定点数学库
- [**nova-ecs-physics-box2d**](https://github.com/esengine/nova-ecs-physics-box2d) - Box2D implementation | Box2D实现

## 📄 License | 许可证

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments | 致谢

- Box2D physics engine team for the excellent reference implementation
- NovaECS community for feedback and contributions
- All contributors who helped shape this project

---

**Made with ❤️ by the NovaECS team**  
**由 NovaECS 团队用 ❤️ 制作**