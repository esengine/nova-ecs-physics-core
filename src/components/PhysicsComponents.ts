import { Component } from '@esengine/nova-ecs';
import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import {
  IRigidBody,
  ICollider,
  IJoint
} from '../interfaces/IPhysicsEngine';
import {
  RigidBodyType,
  ColliderConfig,
  PhysicsMaterial,
  CollisionFilter
} from '../types/PhysicsTypes';

/**
 * Rigid body component that wraps physics engine body
 * 包装物理引擎刚体的刚体组件
 */
export class RigidBodyComponent extends Component {
  /** The physics engine body | 物理引擎刚体 */
  public body: IRigidBody | null = null;
  
  /** Body type | 刚体类型 */
  public type: RigidBodyType;
  
  /** Linear damping | 线性阻尼 */
  public linearDamping: Fixed;
  
  /** Angular damping | 角阻尼 */
  public angularDamping: Fixed;
  
  /** Gravity scale | 重力缩放 */
  public gravityScale: Fixed;
  
  /** Whether the body can sleep | 物体是否可以休眠 */
  public allowSleep: boolean;
  
  /** Whether the body has fixed rotation | 物体是否固定旋转 */
  public fixedRotation: boolean;
  
  /** Whether the body is a bullet | 物体是否为子弹 */
  public bullet: boolean;

  constructor(
    type: RigidBodyType = RigidBodyType.Dynamic,
    linearDamping: Fixed | number = 0,
    angularDamping: Fixed | number = 0,
    gravityScale: Fixed | number = 1,
    allowSleep: boolean = true,
    fixedRotation: boolean = false,
    bullet: boolean = false
  ) {
    super();
    this.type = type;
    this.linearDamping = linearDamping instanceof Fixed ? linearDamping : new Fixed(linearDamping);
    this.angularDamping = angularDamping instanceof Fixed ? angularDamping : new Fixed(angularDamping);
    this.gravityScale = gravityScale instanceof Fixed ? gravityScale : new Fixed(gravityScale);
    this.allowSleep = allowSleep;
    this.fixedRotation = fixedRotation;
    this.bullet = bullet;
  }

  /**
   * Get position from physics body
   * 从物理刚体获取位置
   */
  getPosition(): FixedVector2 {
    return this.body?.getPosition() ?? new FixedVector2();
  }

  /**
   * Set position to physics body
   * 设置物理刚体位置
   */
  setPosition(position: FixedVector2): void {
    this.body?.setPosition(position);
  }

  /**
   * Get rotation from physics body
   * 从物理刚体获取旋转
   */
  getRotation(): Fixed {
    return this.body?.getRotation() ?? Fixed.ZERO;
  }

  /**
   * Set rotation to physics body
   * 设置物理刚体旋转
   */
  setRotation(rotation: Fixed): void {
    this.body?.setRotation(rotation);
  }

  /**
   * Get linear velocity from physics body
   * 从物理刚体获取线性速度
   */
  getLinearVelocity(): FixedVector2 {
    return this.body?.getLinearVelocity() ?? new FixedVector2();
  }

  /**
   * Set linear velocity to physics body
   * 设置物理刚体线性速度
   */
  setLinearVelocity(velocity: FixedVector2): void {
    this.body?.setLinearVelocity(velocity);
  }

  /**
   * Apply force at center
   * 在中心施加力
   */
  applyForce(force: FixedVector2): void {
    this.body?.applyForce(force);
  }

  /**
   * Apply impulse at center
   * 在中心施加冲量
   */
  applyImpulse(impulse: FixedVector2): void {
    this.body?.applyImpulse(impulse);
  }
}

/**
 * Collider component that wraps physics engine collider
 * 包装物理引擎碰撞器的碰撞器组件
 */
export class ColliderComponent extends Component {
  /** The physics engine collider | 物理引擎碰撞器 */
  public collider: ICollider | null = null;
  
  /** Collider configuration | 碰撞器配置 */
  public config: ColliderConfig;
  
  /** Physics material | 物理材质 */
  public material: PhysicsMaterial;
  
  /** Collision filter | 碰撞过滤器 */
  public filter: CollisionFilter;
  
  /** Whether this is a sensor | 是否为传感器 */
  public isSensor: boolean;

  constructor(
    config: ColliderConfig,
    material: PhysicsMaterial = {
      friction: new Fixed(0.3),
      restitution: new Fixed(0.1),
      density: new Fixed(1.0)
    },
    filter: CollisionFilter = {
      categoryBits: 0x0001,
      maskBits: 0xFFFF,
      groupIndex: 0
    },
    isSensor: boolean = false
  ) {
    super();
    this.config = config;
    this.material = material;
    this.filter = filter;
    this.isSensor = isSensor;
  }

  /**
   * Set physics material
   * 设置物理材质
   */
  setMaterial(material: PhysicsMaterial): void {
    this.material = material;
    this.collider?.setMaterial(material);
  }

  /**
   * Set collision filter
   * 设置碰撞过滤器
   */
  setFilter(filter: CollisionFilter): void {
    this.filter = filter;
    this.collider?.setFilter(filter);
  }

  /**
   * Set sensor state
   * 设置传感器状态
   */
  setSensor(isSensor: boolean): void {
    this.isSensor = isSensor;
    this.collider?.setSensor(isSensor);
  }
}

/**
 * Joint component that wraps physics engine joint
 * 包装物理引擎关节的关节组件
 */
export class JointComponent extends Component {
  /** The physics engine joint | 物理引擎关节 */
  public joint: IJoint | null = null;
  
  /** Joint configuration | 关节配置 */
  public config: unknown; // Will be more specific in implementations
  
  /** Whether the joint is active | 关节是否激活 */
  public active: boolean;

  constructor(config: unknown, active: boolean = true) {
    super();
    this.config = config;
    this.active = active;
  }

  /**
   * Get reaction force
   * 获取反作用力
   */
  getReactionForce(): FixedVector2 {
    return this.joint?.getReactionForce() ?? new FixedVector2();
  }

  /**
   * Get reaction torque
   * 获取反作用扭矩
   */
  getReactionTorque(): Fixed {
    return this.joint?.getReactionTorque() ?? Fixed.ZERO;
  }
}

/**
 * Physics transform component that syncs with physics body
 * 与物理刚体同步的物理变换组件
 */
export class PhysicsTransformComponent extends Component {
  /** Position | 位置 */
  public position: FixedVector2;
  
  /** Rotation in radians | 旋转角度（弧度） */
  public rotation: Fixed;
  
  /** Scale (not affected by physics) | 缩放（不受物理影响） */
  public scale: FixedVector2;
  
  /** Previous position for interpolation | 用于插值的前一位置 */
  public previousPosition: FixedVector2;
  
  /** Previous rotation for interpolation | 用于插值的前一旋转 */
  public previousRotation: Fixed;

  constructor(
    position: FixedVector2 = new FixedVector2(),
    rotation: Fixed | number = 0,
    scale: FixedVector2 = new FixedVector2(1, 1)
  ) {
    super();
    this.position = position;
    this.rotation = rotation instanceof Fixed ? rotation : new Fixed(rotation);
    this.scale = scale;
    this.previousPosition = new FixedVector2(position.x, position.y);
    this.previousRotation = new Fixed(this.rotation.toNumber());
  }

  /**
   * Update previous values for interpolation
   * 更新用于插值的前一值
   */
  updatePrevious(): void {
    this.previousPosition.set(this.position.x, this.position.y);
    this.previousRotation = new Fixed(this.rotation.toNumber());
  }

  /**
   * Get interpolated position
   * 获取插值位置
   */
  getInterpolatedPosition(alpha: Fixed): FixedVector2 {
    return FixedVector2.lerp(this.previousPosition, this.position, alpha);
  }

  /**
   * Get interpolated rotation
   * 获取插值旋转
   */
  getInterpolatedRotation(alpha: Fixed): Fixed {
    return this.previousRotation.add(
      this.rotation.subtract(this.previousRotation).multiply(alpha)
    );
  }
}

/**
 * Collision event component for handling collision callbacks
 * 用于处理碰撞回调的碰撞事件组件
 */
export class CollisionEventComponent extends Component {
  /** Collision begin callbacks | 碰撞开始回调 */
  public onCollisionBegin: Array<(other: unknown) => void> = [];

  /** Collision end callbacks | 碰撞结束回调 */
  public onCollisionEnd: Array<(other: unknown) => void> = [];

  /** Sensor begin callbacks | 传感器开始回调 */
  public onSensorBegin: Array<(other: unknown) => void> = [];

  /** Sensor end callbacks | 传感器结束回调 */
  public onSensorEnd: Array<(other: unknown) => void> = [];

  /**
   * Add collision begin callback
   * 添加碰撞开始回调
   */
  addCollisionBeginCallback(callback: (other: unknown) => void): void {
    this.onCollisionBegin.push(callback);
  }

  /**
   * Add collision end callback
   * 添加碰撞结束回调
   */
  addCollisionEndCallback(callback: (other: unknown) => void): void {
    this.onCollisionEnd.push(callback);
  }

  /**
   * Add sensor begin callback
   * 添加传感器开始回调
   */
  addSensorBeginCallback(callback: (other: unknown) => void): void {
    this.onSensorBegin.push(callback);
  }

  /**
   * Add sensor end callback
   * 添加传感器结束回调
   */
  addSensorEndCallback(callback: (other: unknown) => void): void {
    this.onSensorEnd.push(callback);
  }
}
