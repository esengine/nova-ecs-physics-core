import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';

/**
 * Physics world configuration
 * 物理世界配置
 */
export interface PhysicsWorldConfig {
  /** Gravity vector | 重力向量 */
  gravity: FixedVector2;
  /** Allow sleeping bodies for performance | 允许休眠物体以提高性能 */
  allowSleep?: boolean;
  /** Velocity iterations for constraint solver | 约束求解器的速度迭代次数 */
  velocityIterations?: number;
  /** Position iterations for constraint solver | 约束求解器的位置迭代次数 */
  positionIterations?: number;
  /** Time step for physics simulation | 物理模拟的时间步长 */
  timeStep?: Fixed;
}

/**
 * Rigid body types
 * 刚体类型
 */
export enum RigidBodyType {
  /** Static body (immovable) | 静态物体（不可移动） */
  Static = 'static',
  /** Kinematic body (movable but not affected by forces) | 运动学物体（可移动但不受力影响） */
  Kinematic = 'kinematic',
  /** Dynamic body (fully simulated) | 动态物体（完全模拟） */
  Dynamic = 'dynamic'
}

/**
 * Rigid body configuration
 * 刚体配置
 */
export interface RigidBodyConfig {
  /** Body type | 物体类型 */
  type: RigidBodyType;
  /** Initial position | 初始位置 */
  position: FixedVector2;
  /** Initial rotation in radians | 初始旋转角度（弧度） */
  rotation?: Fixed;
  /** Linear velocity | 线性速度 */
  linearVelocity?: FixedVector2;
  /** Angular velocity | 角速度 */
  angularVelocity?: Fixed;
  /** Linear damping | 线性阻尼 */
  linearDamping?: Fixed;
  /** Angular damping | 角阻尼 */
  angularDamping?: Fixed;
  /** Gravity scale | 重力缩放 */
  gravityScale?: Fixed;
  /** Whether the body can sleep | 物体是否可以休眠 */
  allowSleep?: boolean;
  /** Whether the body starts awake | 物体是否开始时处于唤醒状态 */
  awake?: boolean;
  /** Whether the body has fixed rotation | 物体是否固定旋转 */
  fixedRotation?: boolean;
  /** Whether the body is a bullet (for continuous collision detection) | 物体是否为子弹（用于连续碰撞检测） */
  bullet?: boolean;
  /** User data | 用户数据 */
  userData?: unknown;
}

/**
 * Collider shape types
 * 碰撞器形状类型
 */
export enum ColliderType {
  /** Box/Rectangle shape | 盒子/矩形形状 */
  Box = 'box',
  /** Circle shape | 圆形形状 */
  Circle = 'circle',
  /** Polygon shape | 多边形形状 */
  Polygon = 'polygon',
  /** Edge/Line shape | 边缘/线条形状 */
  Edge = 'edge',
  /** Chain shape | 链条形状 */
  Chain = 'chain'
}

/**
 * Box collider configuration
 * 盒子碰撞器配置
 */
export interface BoxColliderConfig {
  type: ColliderType.Box;
  /** Half width | 半宽 */
  halfWidth: Fixed;
  /** Half height | 半高 */
  halfHeight: Fixed;
  /** Local position offset | 本地位置偏移 */
  offset?: FixedVector2;
  /** Local rotation offset | 本地旋转偏移 */
  rotation?: Fixed;
}

/**
 * Circle collider configuration
 * 圆形碰撞器配置
 */
export interface CircleColliderConfig {
  type: ColliderType.Circle;
  /** Radius | 半径 */
  radius: Fixed;
  /** Local position offset | 本地位置偏移 */
  offset?: FixedVector2;
}

/**
 * Polygon collider configuration
 * 多边形碰撞器配置
 */
export interface PolygonColliderConfig {
  type: ColliderType.Polygon;
  /** Vertices in local space | 本地空间中的顶点 */
  vertices: FixedVector2[];
  /** Local position offset | 本地位置偏移 */
  offset?: FixedVector2;
  /** Local rotation offset | 本地旋转偏移 */
  rotation?: Fixed;
}

/**
 * Edge collider configuration
 * 边缘碰撞器配置
 */
export interface EdgeColliderConfig {
  type: ColliderType.Edge;
  /** Start point | 起始点 */
  start: FixedVector2;
  /** End point | 结束点 */
  end: FixedVector2;
}

/**
 * Chain collider configuration
 * 链条碰撞器配置
 */
export interface ChainColliderConfig {
  type: ColliderType.Chain;
  /** Chain vertices | 链条顶点 */
  vertices: FixedVector2[];
  /** Whether the chain is a loop | 链条是否为循环 */
  loop?: boolean;
}

/**
 * Union type for all collider configurations
 * 所有碰撞器配置的联合类型
 */
export type ColliderConfig = 
  | BoxColliderConfig 
  | CircleColliderConfig 
  | PolygonColliderConfig 
  | EdgeColliderConfig 
  | ChainColliderConfig;

/**
 * Physics material properties
 * 物理材质属性
 */
export interface PhysicsMaterial {
  /** Friction coefficient | 摩擦系数 */
  friction: Fixed;
  /** Restitution (bounciness) | 恢复系数（弹性） */
  restitution: Fixed;
  /** Density | 密度 */
  density: Fixed;
}

/**
 * Collision filter data
 * 碰撞过滤数据
 */
export interface CollisionFilter {
  /** Category bits | 类别位 */
  categoryBits: number;
  /** Mask bits | 掩码位 */
  maskBits: number;
  /** Group index | 组索引 */
  groupIndex?: number;
}

/**
 * Contact point information
 * 接触点信息
 */
export interface ContactPoint {
  /** World position of contact | 接触点的世界位置 */
  position: FixedVector2;
  /** Contact normal | 接触法线 */
  normal: FixedVector2;
  /** Normal impulse | 法线冲量 */
  normalImpulse: Fixed;
  /** Tangent impulse | 切线冲量 */
  tangentImpulse: Fixed;
  /** Separation distance | 分离距离 */
  separation: Fixed;
}

/**
 * Collision event data
 * 碰撞事件数据
 */
export interface CollisionEventData {
  /** First body involved in collision | 碰撞中涉及的第一个物体 */
  bodyA: unknown; // Will be typed as specific engine's body type
  /** Second body involved in collision | 碰撞中涉及的第二个物体 */
  bodyB: unknown; // Will be typed as specific engine's body type
  /** Contact points | 接触点 */
  contacts: ContactPoint[];
  /** Whether this is the beginning of contact | 是否为接触开始 */
  isBeginContact: boolean;
  /** Whether this is the end of contact | 是否为接触结束 */
  isEndContact: boolean;
}

/**
 * Ray casting input
 * 射线投射输入
 */
export interface RaycastInput {
  /** Ray start point | 射线起始点 */
  origin: FixedVector2;
  /** Ray direction (should be normalized) | 射线方向（应该是标准化的） */
  direction: FixedVector2;
  /** Maximum ray distance | 最大射线距离 */
  maxDistance: Fixed;
  /** Collision filter | 碰撞过滤器 */
  filter?: CollisionFilter;
}

/**
 * Ray casting result
 * 射线投射结果
 */
export interface RaycastResult {
  /** Whether the ray hit something | 射线是否击中了什么 */
  hit: boolean;
  /** Hit point in world space | 世界空间中的击中点 */
  point?: FixedVector2;
  /** Surface normal at hit point | 击中点的表面法线 */
  normal?: FixedVector2;
  /** Distance from ray origin to hit point | 从射线原点到击中点的距离 */
  distance?: Fixed;
  /** The body that was hit | 被击中的物体 */
  body?: unknown; // Will be typed as specific engine's body type
}

/**
 * Joint types
 * 关节类型
 */
export enum JointType {
  /** Distance joint | 距离关节 */
  Distance = 'distance',
  /** Revolute joint | 旋转关节 */
  Revolute = 'revolute',
  /** Prismatic joint | 棱柱关节 */
  Prismatic = 'prismatic',
  /** Weld joint | 焊接关节 */
  Weld = 'weld',
  /** Rope joint | 绳索关节 */
  Rope = 'rope',
  /** Mouse joint | 鼠标关节 */
  Mouse = 'mouse',
  /** Pulley joint | 滑轮关节 */
  Pulley = 'pulley',
  /** Gear joint | 齿轮关节 */
  Gear = 'gear',
  /** Motor joint | 电机关节 */
  Motor = 'motor',
  /** Wheel joint | 车轮关节 */
  Wheel = 'wheel'
}

/**
 * Base joint configuration
 * 基础关节配置
 */
export interface BaseJointConfig {
  /** Joint type | 关节类型 */
  type: JointType;
  /** First body | 第一个物体 */
  bodyA: unknown;
  /** Second body | 第二个物体 */
  bodyB: unknown;
  /** Whether bodies connected to this joint should collide | 连接到此关节的物体是否应该碰撞 */
  collideConnected?: boolean;
  /** User data | 用户数据 */
  userData?: unknown;
}
