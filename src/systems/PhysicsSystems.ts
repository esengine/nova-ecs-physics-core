import { System, Entity, World } from '@esengine/nova-ecs';
import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { IPhysicsEngine, IPhysicsWorld } from '../interfaces/IPhysicsEngine';
import { PhysicsWorldConfig, RigidBodyConfig, BaseJointConfig } from '../types/PhysicsTypes';
import {
  RigidBodyComponent,
  ColliderComponent,
  JointComponent,
  PhysicsTransformComponent,
  CollisionEventComponent
} from '../components/PhysicsComponents';
import { PhysicsLogger } from '../utils/Logger';

/**
 * Collision event data interface
 * 碰撞事件数据接口
 */
interface CollisionEventData {
  bodyA: unknown;
  bodyB: unknown;
  contacts?: unknown[];
  isBeginContact: boolean;
  isEndContact: boolean;
}

/**
 * Body with user data interface
 * 带有用户数据的物体接口
 */
interface BodyWithUserData {
  getUserData(): unknown;
}

/**
 * Physics world system that manages the physics simulation
 * 管理物理模拟的物理世界系统
 */
export class PhysicsWorldSystem extends System {
  /** Physics engine instance | 物理引擎实例 */
  private engine: IPhysicsEngine;
  
  /** Physics world instance | 物理世界实例 */
  private physicsWorld: IPhysicsWorld | null = null;
  
  /** World configuration | 世界配置 */
  private worldConfig: PhysicsWorldConfig;
  
  /** Fixed time step for physics | 物理的固定时间步长 */
  private fixedTimeStep: Fixed;
  
  /** Accumulator for fixed time stepping | 固定时间步长的累加器 */
  private accumulator: Fixed = Fixed.ZERO;
  
  /** Maximum sub-steps per frame | 每帧最大子步数 */
  private maxSubSteps: number = 10;

  constructor(
    engine: IPhysicsEngine,
    worldConfig: PhysicsWorldConfig,
    fixedTimeStep: Fixed | number = 1/60
  ) {
    super([]);
    this.engine = engine;
    this.worldConfig = worldConfig;
    this.fixedTimeStep = fixedTimeStep instanceof Fixed ? fixedTimeStep : new Fixed(fixedTimeStep);
  }

  /**
   * Initialize the physics world
   * 初始化物理世界
   */
  async onAddedToWorld(world: World): Promise<void> {
    super.onAddedToWorld(world);
    
    await this.engine.initialize();
    this.physicsWorld = this.engine.createWorld(this.worldConfig);
    
    // Set up collision event handling
    this.physicsWorld.onCollision((data) => {
      this.handleCollisionEvent(data);
    });
  }

  /**
   * Update physics simulation
   * 更新物理模拟
   */
  update(_entities: Entity[], deltaTime: number): void {
    if (!this.physicsWorld) return;

    const fixedDeltaTime = new Fixed(deltaTime);
    this.accumulator = this.accumulator.add(fixedDeltaTime);

    let subSteps = 0;
    while (this.accumulator.greaterThanOrEqual(this.fixedTimeStep) && subSteps < this.maxSubSteps) {
      this.physicsWorld.step(this.fixedTimeStep);
      this.accumulator = this.accumulator.subtract(this.fixedTimeStep);
      subSteps++;
    }

    // Update transform components from physics bodies
    this.updateTransforms();
  }

  /**
   * Update transform components from physics bodies
   * 从物理刚体更新变换组件
   */
  private updateTransforms(): void {
    if (!this.world) return;

    const entities = this.world.query()
      .with(RigidBodyComponent, PhysicsTransformComponent)
      .execute();

    for (const entity of entities) {
      const rigidBody = entity.getComponent(RigidBodyComponent);
      const transform = entity.getComponent(PhysicsTransformComponent);

      if (rigidBody?.body && transform) {
        transform.updatePrevious();
        transform.position = rigidBody.body.getPosition();
        transform.rotation = rigidBody.body.getRotation();
      }
    }
  }

  /**
   * Handle collision events
   * 处理碰撞事件
   */
  private handleCollisionEvent(data: unknown): void {
    if (!this.world) return;

    try {
      // Cast to collision event data (specific engines will provide proper typing)
      // 转换为碰撞事件数据（特定引擎会提供适当的类型）
      const collisionData = data as CollisionEventData;
      
      // Find entities associated with the colliding bodies
      // 查找与碰撞体相关的实体
      const entityA = this.getEntityFromBody(collisionData.bodyA);
      const entityB = this.getEntityFromBody(collisionData.bodyB);

      if (entityA && entityB) {
        this.handleEntityCollision(entityA, entityB, collisionData);
      }
    } catch (error) {
      PhysicsLogger.warn(`Failed to handle collision event: ${String(error)}`);
    }
  }

  /**
   * Get entity from physics body user data
   * 从物理体用户数据获取实体
   */
  private getEntityFromBody(body: unknown): Entity | null {
    try {
      // Bodies should have entity stored in userData
      // 物理体应该在userData中存储实体
      const bodyWithUserData = body as BodyWithUserData;
      const userData = bodyWithUserData.getUserData();
      
      if (userData && typeof userData === 'object' && 'id' in userData) {
        return userData as Entity;
      }
    } catch (error) {
      // Ignore errors when getting user data
      // 获取用户数据时忽略错误
    }
    return null;
  }

  /**
   * Handle collision between two entities
   * 处理两个实体之间的碰撞
   */
  private handleEntityCollision(entityA: Entity, entityB: Entity, collisionData: CollisionEventData): void {
    // Handle collision events for entity A
    const collisionCompA = entityA.getComponent(CollisionEventComponent);
    if (collisionCompA) {
      if (collisionData.isBeginContact) {
        collisionCompA.onCollisionBegin.forEach(callback => {
          try {
            callback(entityB);
          } catch (error) {
            PhysicsLogger.warn(`Error in collision begin callback: ${String(error)}`);
          }
        });
      } else if (collisionData.isEndContact) {
        collisionCompA.onCollisionEnd.forEach(callback => {
          try {
            callback(entityB);
          } catch (error) {
            PhysicsLogger.warn(`Error in collision end callback: ${String(error)}`);
          }
        });
      }
    }

    // Handle collision events for entity B
    const collisionCompB = entityB.getComponent(CollisionEventComponent);
    if (collisionCompB) {
      if (collisionData.isBeginContact) {
        collisionCompB.onCollisionBegin.forEach(callback => {
          try {
            callback(entityA);
          } catch (error) {
            PhysicsLogger.warn(`Error in collision begin callback: ${String(error)}`);
          }
        });
      } else if (collisionData.isEndContact) {
        collisionCompB.onCollisionEnd.forEach(callback => {
          try {
            callback(entityA);
          } catch (error) {
            PhysicsLogger.warn(`Error in collision end callback: ${String(error)}`);
          }
        });
      }
    }
  }

  /**
   * Get the physics world
   * 获取物理世界
   */
  getPhysicsWorld(): IPhysicsWorld | null {
    return this.physicsWorld;
  }

  /**
   * Get the physics engine
   * 获取物理引擎
   */
  getEngine(): IPhysicsEngine {
    return this.engine;
  }

  /**
   * Set gravity
   * 设置重力
   */
  setGravity(gravity: FixedVector2): void {
    this.physicsWorld?.setGravity(gravity);
  }

  /**
   * Get gravity
   * 获取重力
   */
  getGravity(): FixedVector2 {
    return this.physicsWorld?.getGravity() ?? new FixedVector2();
  }

  /**
   * Cleanup when removed from world
   * 从世界移除时清理
   */
  onRemovedFromWorld(): void {
    this.physicsWorld?.destroy();
    this.physicsWorld = null;
    this.engine.destroy();
    super.onRemovedFromWorld();
  }
}

/**
 * Physics body system that manages rigid body creation and updates
 * 管理刚体创建和更新的物理刚体系统
 */
export class PhysicsBodySystem extends System {
  /** Physics world system reference | 物理世界系统引用 */
  private worldSystem: PhysicsWorldSystem;

  constructor(worldSystem: PhysicsWorldSystem) {
    super([RigidBodyComponent]);
    this.worldSystem = worldSystem;
  }

  /**
   * Handle entity added with rigid body component
   * 处理添加了刚体组件的实体
   */
  onEntityAdded(entity: Entity): void {
    const rigidBodyComp = entity.getComponent(RigidBodyComponent);
    const transformComp = entity.getComponent(PhysicsTransformComponent);
    const physicsWorld = this.worldSystem.getPhysicsWorld();
    const engine = this.worldSystem.getEngine();

    if (!rigidBodyComp) {
      PhysicsLogger.warn(`Entity ${entity.id} missing RigidBodyComponent`);
      return;
    }

    if (!physicsWorld || !engine) {
      PhysicsLogger.warn('Physics world or engine not available');
      return;
    }

    try {
      // Create physics body configuration
      const bodyConfig = {
        type: rigidBodyComp.type,
        position: transformComp?.position ?? new FixedVector2(),
        rotation: transformComp?.rotation ?? Fixed.ZERO,
        linearVelocity: new FixedVector2(),
        angularVelocity: Fixed.ZERO,
        linearDamping: rigidBodyComp.linearDamping,
        angularDamping: rigidBodyComp.angularDamping,
        gravityScale: rigidBodyComp.gravityScale,
        allowSleep: rigidBodyComp.allowSleep,
        awake: true,
        fixedRotation: rigidBodyComp.fixedRotation,
        bullet: rigidBodyComp.bullet,
        userData: entity
      };

      // Create the physics body
      rigidBodyComp.body = engine.createRigidBody(physicsWorld, bodyConfig as RigidBodyConfig);
      
      // Create or update transform component if needed
      if (!transformComp) {
        entity.addComponent(new PhysicsTransformComponent(
          rigidBodyComp.body.getPosition(),
          rigidBodyComp.body.getRotation()
        ));
      }

      PhysicsLogger.log(`Created physics body for entity ${entity.id}`);
    } catch (error) {
      PhysicsLogger.error(`Failed to create physics body for entity ${entity.id}: ${String(error)}`);
    }
  }

  /**
   * Handle entity removed with rigid body component
   * 处理移除了刚体组件的实体
   */
  onEntityRemoved(entity: Entity): void {
    const rigidBodyComp = entity.getComponent(RigidBodyComponent);
    if (rigidBodyComp?.body) {
      rigidBodyComp.body.destroy();
      rigidBodyComp.body = null;
    }
  }

  update(entities: Entity[], _deltaTime: number): void {
    // Update rigid body properties from components
    for (const entity of entities) {
      const rigidBodyComp = entity.getComponent(RigidBodyComponent);
      
      if (!rigidBodyComp) continue;
      
      if (rigidBodyComp.body) {
        // Sync component properties to physics body if they changed
        // This allows runtime modification of physics properties
        // 同步组件属性到物理体（如果有变化）
        // 这允许运行时修改物理属性
        try {
          // Update mass if component has mass property
          // Note: Mass updates should be done carefully as they can affect performance
          // 注意：质量更新应该谨慎进行，因为它们可能影响性能
        } catch (error) {
          PhysicsLogger.warn(`Failed to update properties for entity ${entity.id}: ${String(error)}`);
        }
      }
    }
  }
}

/**
 * Physics collider system that manages collider creation and updates
 * 管理碰撞器创建和更新的物理碰撞器系统
 */
export class PhysicsColliderSystem extends System {
  /** Physics world system reference | 物理世界系统引用 */
  private worldSystem: PhysicsWorldSystem;

  constructor(worldSystem: PhysicsWorldSystem) {
    super([ColliderComponent, RigidBodyComponent]);
    this.worldSystem = worldSystem;
  }

  /**
   * Handle entity added with collider component
   * 处理添加了碰撞器组件的实体
   */
  onEntityAdded(entity: Entity): void {
    const colliderComp = entity.getComponent(ColliderComponent);
    const rigidBodyComp = entity.getComponent(RigidBodyComponent);
    const engine = this.worldSystem.getEngine();

    if (!colliderComp || !rigidBodyComp) {
      PhysicsLogger.warn(`Entity ${entity.id} missing required components`);
      return;
    }
    if (!rigidBodyComp.body) {
      PhysicsLogger.warn(`Entity ${entity.id} has ColliderComponent but no physics body`);
      return;
    }

    if (!engine) {
      PhysicsLogger.warn('Physics engine not available');
      return;
    }

    try {
      // Create the collider
      colliderComp.collider = engine.createCollider(
        rigidBodyComp.body,
        colliderComp.config,
        colliderComp.material
      );

      // Set additional properties
      if (colliderComp.collider) {
        colliderComp.collider.setFilter(colliderComp.filter);
        colliderComp.collider.setSensor(colliderComp.isSensor);
        colliderComp.collider.setUserData(entity);
      }

      PhysicsLogger.log(`Created collider for entity ${entity.id}`);
    } catch (error) {
      PhysicsLogger.error(`Failed to create collider for entity ${entity.id}: ${String(error)}`);
    }
  }

  /**
   * Handle entity removed with collider component
   * 处理移除了碰撞器组件的实体
   */
  onEntityRemoved(entity: Entity): void {
    const colliderComp = entity.getComponent(ColliderComponent);
    if (colliderComp?.collider) {
      colliderComp.collider.destroy();
      colliderComp.collider = null;
    }
  }

  update(entities: Entity[], _deltaTime: number): void {
    // Update collider properties if needed
    for (const entity of entities) {
      const colliderComp = entity.getComponent(ColliderComponent);
      
      if (!colliderComp) continue;
      
      if (colliderComp.collider) {
        try {
          // Update material if it has changed
          // 如果材质发生变化，更新材质
          const currentMaterial = colliderComp.collider.getMaterial();
          if (!currentMaterial.friction.equals(colliderComp.material.friction) ||
              !currentMaterial.restitution.equals(colliderComp.material.restitution) ||
              !currentMaterial.density.equals(colliderComp.material.density)) {
            colliderComp.collider.setMaterial(colliderComp.material);
          }

          // Update sensor state if it has changed
          // 如果传感器状态发生变化，更新状态
          if (colliderComp.collider.isSensor() !== colliderComp.isSensor) {
            colliderComp.collider.setSensor(colliderComp.isSensor);
          }
        } catch (error) {
          PhysicsLogger.warn(`Failed to update collider properties for entity ${entity.id}: ${String(error)}`);
        }
      }
    }
  }
}

/**
 * Physics joint system that manages joint creation and updates
 * 管理关节创建和更新的物理关节系统
 */
export class PhysicsJointSystem extends System {
  /** Physics world system reference | 物理世界系统引用 */
  private worldSystem: PhysicsWorldSystem;

  constructor(worldSystem: PhysicsWorldSystem) {
    super([JointComponent]);
    this.worldSystem = worldSystem;
  }

  /**
   * Handle entity added with joint component
   * 处理添加了关节组件的实体
   */
  onEntityAdded(entity: Entity): void {
    const jointComp = entity.getComponent(JointComponent);
    
    if (!jointComp) {
      PhysicsLogger.warn(`Entity ${entity.id} missing JointComponent`);
      return;
    }
    
    const physicsWorld = this.worldSystem.getPhysicsWorld();
    const engine = this.worldSystem.getEngine();

    if (!physicsWorld || !engine) {
      PhysicsLogger.warn('Physics world or engine not available');
      return;
    }

    if (!jointComp.active) {
      return; // Skip inactive joints
    }

    try {
      // Create the joint
      jointComp.joint = engine.createJoint(physicsWorld, jointComp.config as BaseJointConfig);
      
      if (jointComp.joint) {
        jointComp.joint.setUserData(entity);
      }

      PhysicsLogger.log(`Created joint for entity ${entity.id}`);
    } catch (error) {
      PhysicsLogger.error(`Failed to create joint for entity ${entity.id}: ${String(error)}`);
    }
  }

  /**
   * Handle entity removed with joint component
   * 处理移除了关节组件的实体
   */
  onEntityRemoved(entity: Entity): void {
    const jointComp = entity.getComponent(JointComponent);
    if (jointComp?.joint) {
      jointComp.joint.destroy();
      jointComp.joint = null;
    }
  }

  update(entities: Entity[], _deltaTime: number): void {
    // Update joint properties and monitor joint health
    for (const entity of entities) {
      const jointComp = entity.getComponent(JointComponent);
      
      if (!jointComp) continue;
      
      if (jointComp.joint) {
        try {
          // Check if joint should be active/inactive
          // 检查关节是否应该激活/非激活
          const isJointActive = jointComp.joint.isActive();
          if (isJointActive !== jointComp.active) {
            // Joint activation state mismatch - this might indicate joint breaking
            // 关节激活状态不匹配 - 这可能表示关节断裂
            PhysicsLogger.warn(`Joint activation state mismatch for entity ${entity.id}`);
          }

          // Update active state from component
          // 从组件更新激活状态
          if (!jointComp.active && isJointActive) {
            // If component says inactive but joint is active, destroy the joint
            // 如果组件说非激活但关节激活，销毁关节
            jointComp.joint.destroy();
            jointComp.joint = null;
          }
        } catch (error) {
          PhysicsLogger.warn(`Failed to update joint properties for entity ${entity.id}: ${String(error)}`);
        }
      } else if (jointComp.active) {
        // Joint is null but should be active - try to recreate
        // 关节为空但应该激活 - 尝试重新创建
        this.onEntityAdded(entity);
      }
    }
  }
}
