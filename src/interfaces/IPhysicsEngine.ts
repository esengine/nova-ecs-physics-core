import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import {
  PhysicsWorldConfig,
  RigidBodyConfig,
  ColliderConfig,
  PhysicsMaterial,
  CollisionFilter,
  RaycastInput,
  RaycastResult,
  BaseJointConfig,
  CollisionEventData
} from '../types/PhysicsTypes';

/**
 * Physics world interface
 * 物理世界接口
 */
export interface IPhysicsWorld {
  /** Step the physics simulation | 步进物理模拟 */
  step(deltaTime: Fixed): void;
  
  /** Set gravity | 设置重力 */
  setGravity(gravity: FixedVector2): void;
  
  /** Get gravity | 获取重力 */
  getGravity(): FixedVector2;
  
  /** Perform raycast | 执行射线投射 */
  raycast(input: RaycastInput): RaycastResult[];
  
  /** Query bodies in AABB | 查询AABB中的物体 */
  queryAABB(lowerBound: FixedVector2, upperBound: FixedVector2): unknown[];
  
  /** Add collision event listener | 添加碰撞事件监听器 */
  onCollision(callback: (data: CollisionEventData) => void): void;
  
  /** Remove collision event listener | 移除碰撞事件监听器 */
  offCollision(callback: (data: CollisionEventData) => void): void;
  
  /** Destroy the world | 销毁世界 */
  destroy(): void;
  
  /** Get debug draw data | 获取调试绘制数据 */
  getDebugDrawData?(): unknown;
}

/**
 * Rigid body interface
 * 刚体接口
 */
export interface IRigidBody {
  /** Get position | 获取位置 */
  getPosition(): FixedVector2;
  
  /** Set position | 设置位置 */
  setPosition(position: FixedVector2): void;
  
  /** Get rotation | 获取旋转 */
  getRotation(): Fixed;
  
  /** Set rotation | 设置旋转 */
  setRotation(rotation: Fixed): void;
  
  /** Get linear velocity | 获取线性速度 */
  getLinearVelocity(): FixedVector2;
  
  /** Set linear velocity | 设置线性速度 */
  setLinearVelocity(velocity: FixedVector2): void;
  
  /** Get angular velocity | 获取角速度 */
  getAngularVelocity(): Fixed;
  
  /** Set angular velocity | 设置角速度 */
  setAngularVelocity(velocity: Fixed): void;
  
  /** Apply force at center | 在中心施加力 */
  applyForce(force: FixedVector2): void;
  
  /** Apply force at point | 在点施加力 */
  applyForceAtPoint(force: FixedVector2, point: FixedVector2): void;
  
  /** Apply impulse at center | 在中心施加冲量 */
  applyImpulse(impulse: FixedVector2): void;
  
  /** Apply impulse at point | 在点施加冲量 */
  applyImpulseAtPoint(impulse: FixedVector2, point: FixedVector2): void;
  
  /** Apply torque | 施加扭矩 */
  applyTorque(torque: Fixed): void;
  
  /** Get mass | 获取质量 */
  getMass(): Fixed;
  
  /** Set mass | 设置质量 */
  setMass(mass: Fixed): void;
  
  /** Get whether body is awake | 获取物体是否唤醒 */
  isAwake(): boolean;
  
  /** Set awake state | 设置唤醒状态 */
  setAwake(awake: boolean): void;
  
  /** Get whether body is active | 获取物体是否激活 */
  isActive(): boolean;
  
  /** Set active state | 设置激活状态 */
  setActive(active: boolean): void;
  
  /** Get user data | 获取用户数据 */
  getUserData(): unknown;
  
  /** Set user data | 设置用户数据 */
  setUserData(data: unknown): void;
  
  /** Destroy the body | 销毁物体 */
  destroy(): void;
}

/**
 * Collider interface
 * 碰撞器接口
 */
export interface ICollider {
  /** Get the rigid body this collider is attached to | 获取此碰撞器附加到的刚体 */
  getBody(): IRigidBody;
  
  /** Set physics material | 设置物理材质 */
  setMaterial(material: PhysicsMaterial): void;
  
  /** Get physics material | 获取物理材质 */
  getMaterial(): PhysicsMaterial;
  
  /** Set collision filter | 设置碰撞过滤器 */
  setFilter(filter: CollisionFilter): void;
  
  /** Get collision filter | 获取碰撞过滤器 */
  getFilter(): CollisionFilter;
  
  /** Set whether this is a sensor | 设置是否为传感器 */
  setSensor(isSensor: boolean): void;
  
  /** Get whether this is a sensor | 获取是否为传感器 */
  isSensor(): boolean;
  
  /** Get user data | 获取用户数据 */
  getUserData(): unknown;
  
  /** Set user data | 设置用户数据 */
  setUserData(data: unknown): void;
  
  /** Destroy the collider | 销毁碰撞器 */
  destroy(): void;
}

/**
 * Joint interface
 * 关节接口
 */
export interface IJoint {
  /** Get the first body | 获取第一个物体 */
  getBodyA(): IRigidBody;
  
  /** Get the second body | 获取第二个物体 */
  getBodyB(): IRigidBody;
  
  /** Get reaction force | 获取反作用力 */
  getReactionForce(): FixedVector2;
  
  /** Get reaction torque | 获取反作用扭矩 */
  getReactionTorque(): Fixed;
  
  /** Get whether the joint is active | 获取关节是否激活 */
  isActive(): boolean;
  
  /** Get user data | 获取用户数据 */
  getUserData(): unknown;
  
  /** Set user data | 设置用户数据 */
  setUserData(data: unknown): void;
  
  /** Destroy the joint | 销毁关节 */
  destroy(): void;
}

/**
 * Main physics engine interface
 * 主要物理引擎接口
 */
export interface IPhysicsEngine {
  /** Engine name | 引擎名称 */
  readonly name: string;
  
  /** Engine version | 引擎版本 */
  readonly version: string;
  
  /** Create a physics world | 创建物理世界 */
  createWorld(config: PhysicsWorldConfig): IPhysicsWorld;
  
  /** Create a rigid body | 创建刚体 */
  createRigidBody(world: IPhysicsWorld, config: RigidBodyConfig): IRigidBody;
  
  /** Create a collider | 创建碰撞器 */
  createCollider(body: IRigidBody, config: ColliderConfig, material?: PhysicsMaterial): ICollider;
  
  /** Create a joint | 创建关节 */
  createJoint(world: IPhysicsWorld, config: BaseJointConfig): IJoint;
  
  /** Initialize the engine | 初始化引擎 */
  initialize(): Promise<void>;
  
  /** Destroy the engine | 销毁引擎 */
  destroy(): void;
  
  /** Get engine-specific debug information | 获取引擎特定的调试信息 */
  getDebugInfo?(): unknown;
}

/**
 * Physics engine factory interface
 * 物理引擎工厂接口
 */
export interface IPhysicsEngineFactory {
  /** Create a physics engine instance | 创建物理引擎实例 */
  createEngine(): IPhysicsEngine;
  
  /** Get supported features | 获取支持的功能 */
  getSupportedFeatures(): string[];
  
  /** Check if a feature is supported | 检查是否支持某个功能 */
  isFeatureSupported(feature: string): boolean;
}
