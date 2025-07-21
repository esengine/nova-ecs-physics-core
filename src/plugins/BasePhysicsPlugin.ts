import { BasePlugin, World, PluginPriority } from '@esengine/nova-ecs';
import { FixedVector2, Fixed } from '@esengine/nova-ecs-math';
import { IPhysicsEngine, IPhysicsEngineFactory } from '../interfaces/IPhysicsEngine';
import { PhysicsWorldConfig } from '../types/PhysicsTypes';
import {
  PhysicsWorldSystem,
  PhysicsBodySystem,
  PhysicsColliderSystem,
  PhysicsJointSystem
} from '../systems/PhysicsSystems';

/**
 * Configuration for physics plugin
 * 物理插件配置
 */
export interface PhysicsPluginConfig {
  /** Physics world configuration | 物理世界配置 */
  worldConfig?: Partial<PhysicsWorldConfig>;
  /** Fixed time step for physics simulation | 物理模拟的固定时间步长 */
  fixedTimeStep?: Fixed | number;
  /** Maximum sub-steps per frame | 每帧最大子步数 */
  maxSubSteps?: number;
  /** Whether to enable debug rendering | 是否启用调试渲染 */
  enableDebugRender?: boolean;
  /** Auto-create physics systems | 自动创建物理系统 */
  autoCreateSystems?: boolean;
}

/**
 * Base physics plugin that provides common functionality for physics engine integrations
 * 为物理引擎集成提供通用功能的基础物理插件
 */
export abstract class BasePhysicsPlugin extends BasePlugin {
  /** Physics engine factory | 物理引擎工厂 */
  protected engineFactory: IPhysicsEngineFactory;
  
  /** Physics engine instance | 物理引擎实例 */
  protected engine: IPhysicsEngine | null = null;
  
  /** Physics world system | 物理世界系统 */
  protected worldSystem: PhysicsWorldSystem | null = null;
  
  /** Physics body system | 物理刚体系统 */
  protected bodySystem: PhysicsBodySystem | null = null;
  
  /** Physics collider system | 物理碰撞器系统 */
  protected colliderSystem: PhysicsColliderSystem | null = null;
  
  /** Physics joint system | 物理关节系统 */
  protected jointSystem: PhysicsJointSystem | null = null;
  
  /** Plugin configuration | 插件配置 */
  protected config: PhysicsPluginConfig;

  constructor(
    name: string,
    version: string,
    engineFactory: IPhysicsEngineFactory,
    config: PhysicsPluginConfig = {}
  ) {
    super({
      name,
      version,
      description: `Physics plugin for ${name}`,
      priority: PluginPriority.High,
      dependencies: ['@esengine/nova-ecs-math']
    });
    
    this.engineFactory = engineFactory;
    this.config = {
      worldConfig: {
        gravity: new FixedVector2(0, -9.81),
        allowSleep: true,
        velocityIterations: 8,
        positionIterations: 3,
        timeStep: new Fixed(1/60)
      },
      fixedTimeStep: 1/60,
      maxSubSteps: 10,
      enableDebugRender: false,
      autoCreateSystems: true,
      ...config
    };
  }

  /**
   * Install the physics plugin
   * 安装物理插件
   */
  async install(world: World): Promise<void> {
    this.log('Installing physics plugin...');
    
    try {
      // Create physics engine
      this.engine = this.engineFactory.createEngine();
      await this.engine.initialize();
      
      // Create world configuration
      const worldConfig: PhysicsWorldConfig = {
        gravity: new FixedVector2(0, -9.81),
        allowSleep: true,
        velocityIterations: 8,
        positionIterations: 3,
        timeStep: new Fixed(1/60),
        ...this.config.worldConfig
      };
      
      // Create physics systems
      if (this.config.autoCreateSystems) {
        this.createPhysicsSystems(world, worldConfig);
      }
      
      this.log('Physics plugin installed successfully');
    } catch (error) {
      this.error(`Failed to install physics plugin: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Uninstall the physics plugin
   * 卸载物理插件
   */
  uninstall(world: World): void {
    this.log('Uninstalling physics plugin...');
    
    try {
      // Remove systems
      if (this.worldSystem) {
        world.removeSystem(this.worldSystem);
        this.worldSystem = null;
      }
      
      if (this.bodySystem) {
        world.removeSystem(this.bodySystem);
        this.bodySystem = null;
      }
      
      if (this.colliderSystem) {
        world.removeSystem(this.colliderSystem);
        this.colliderSystem = null;
      }
      
      if (this.jointSystem) {
        world.removeSystem(this.jointSystem);
        this.jointSystem = null;
      }
      
      // Destroy engine
      if (this.engine) {
        this.engine.destroy();
        this.engine = null;
      }
      
      this.log('Physics plugin uninstalled successfully');
    } catch (error) {
      this.error(`Failed to uninstall physics plugin: ${String(error)}`);
      throw error;
    }
  }

  /**
   * Create physics systems
   * 创建物理系统
   */
  protected createPhysicsSystems(world: World, worldConfig: PhysicsWorldConfig): void {
    if (!this.engine) {
      throw new Error('Physics engine not initialized');
    }
    
    // Create world system
    this.worldSystem = new PhysicsWorldSystem(
      this.engine,
      worldConfig,
      this.config.fixedTimeStep
    );
    world.addSystem(this.worldSystem);
    
    // Create body system
    this.bodySystem = new PhysicsBodySystem(this.worldSystem);
    world.addSystem(this.bodySystem);
    
    // Create collider system
    this.colliderSystem = new PhysicsColliderSystem(this.worldSystem);
    world.addSystem(this.colliderSystem);
    
    // Create joint system
    this.jointSystem = new PhysicsJointSystem(this.worldSystem);
    world.addSystem(this.jointSystem);
  }

  /**
   * Get the physics engine
   * 获取物理引擎
   */
  getEngine(): IPhysicsEngine | null {
    return this.engine;
  }

  /**
   * Get the physics world system
   * 获取物理世界系统
   */
  getWorldSystem(): PhysicsWorldSystem | null {
    return this.worldSystem;
  }

  /**
   * Get the physics body system
   * 获取物理刚体系统
   */
  getBodySystem(): PhysicsBodySystem | null {
    return this.bodySystem;
  }

  /**
   * Get the physics collider system
   * 获取物理碰撞器系统
   */
  getColliderSystem(): PhysicsColliderSystem | null {
    return this.colliderSystem;
  }

  /**
   * Get the physics joint system
   * 获取物理关节系统
   */
  getJointSystem(): PhysicsJointSystem | null {
    return this.jointSystem;
  }

  /**
   * Update plugin (called every frame)
   * 更新插件（每帧调用）
   */
  update(_deltaTime: number): void {
    // Base implementation does nothing
    // Subclasses can override for custom behavior
    // 基础实现什么都不做
    // 子类可以重写以实现自定义行为
  }

  /**
   * Validate plugin configuration
   * 验证插件配置
   */
  validateConfig(_config: Record<string, unknown>): boolean {
    // Basic validation - subclasses should override for specific validation
    // 基础验证 - 子类应该重写以进行特定验证
    return true;
  }

  /**
   * Get supported features
   * 获取支持的功能
   */
  getSupportedFeatures(): string[] {
    return this.engineFactory.getSupportedFeatures();
  }

  /**
   * Check if a feature is supported
   * 检查是否支持某个功能
   */
  isFeatureSupported(feature: string): boolean {
    return this.engineFactory.isFeatureSupported(feature);
  }

  /**
   * Get debug information
   * 获取调试信息
   */
  getDebugInfo(): Record<string, unknown> {
    return {
      engineName: this.engine?.name ?? 'Not initialized',
      engineVersion: this.engine?.version ?? 'Unknown',
      supportedFeatures: this.getSupportedFeatures(),
      config: this.config
    };
  }
}
