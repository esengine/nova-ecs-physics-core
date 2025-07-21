import { System, Entity, World } from '@esengine/nova-ecs';
import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { IPhysicsEngine, IPhysicsWorld } from '../interfaces/IPhysicsEngine';
import { PhysicsWorldConfig } from '../types/PhysicsTypes';
import {
  RigidBodyComponent,
  ColliderComponent,
  JointComponent,
  PhysicsTransformComponent,
  CollisionEventComponent
} from '../components/PhysicsComponents';

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
  update(entities: Entity[], deltaTime: number): void {
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
      const rigidBody = entity.getComponent(RigidBodyComponent)!;
      const transform = entity.getComponent(PhysicsTransformComponent)!;

      if (rigidBody.body) {
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
  private handleCollisionEvent(data: any): void {
    // This will be implemented by specific engine adapters
    // 这将由特定的引擎适配器实现
  }

  /**
   * Get the physics world
   * 获取物理世界
   */
  getPhysicsWorld(): IPhysicsWorld | null {
    return this.physicsWorld;
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
    const rigidBodyComp = entity.getComponent(RigidBodyComponent)!;
    const transformComp = entity.getComponent(PhysicsTransformComponent);
    const physicsWorld = this.worldSystem.getPhysicsWorld();

    if (!physicsWorld) return;

    // Create physics body
    const bodyConfig = {
      type: rigidBodyComp.type,
      position: transformComp?.position ?? new FixedVector2(),
      rotation: transformComp?.rotation ?? Fixed.ZERO,
      linearDamping: rigidBodyComp.linearDamping,
      angularDamping: rigidBodyComp.angularDamping,
      gravityScale: rigidBodyComp.gravityScale,
      allowSleep: rigidBodyComp.allowSleep,
      fixedRotation: rigidBodyComp.fixedRotation,
      bullet: rigidBodyComp.bullet,
      userData: entity
    };

    // This will be implemented by specific engine adapters
    // rigidBodyComp.body = this.worldSystem.engine.createRigidBody(physicsWorld, bodyConfig);
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

  update(entities: Entity[], deltaTime: number): void {
    // Update any dynamic properties if needed
    // 如果需要，更新任何动态属性
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
    const colliderComp = entity.getComponent(ColliderComponent)!;
    const rigidBodyComp = entity.getComponent(RigidBodyComponent)!;

    if (!rigidBodyComp.body) return;

    // This will be implemented by specific engine adapters
    // colliderComp.collider = this.worldSystem.engine.createCollider(
    //   rigidBodyComp.body,
    //   colliderComp.config,
    //   colliderComp.material
    // );
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

  update(entities: Entity[], deltaTime: number): void {
    // Update collider properties if needed
    // 如果需要，更新碰撞器属性
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
    const jointComp = entity.getComponent(JointComponent)!;
    const physicsWorld = this.worldSystem.getPhysicsWorld();

    if (!physicsWorld) return;

    // This will be implemented by specific engine adapters
    // jointComp.joint = this.worldSystem.engine.createJoint(physicsWorld, jointComp.config);
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

  update(entities: Entity[], deltaTime: number): void {
    // Update joint properties if needed
    // 如果需要，更新关节属性
  }
}
