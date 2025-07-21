import { Event, EventPriority } from '@esengine/nova-ecs';
import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { IRigidBody, ICollider } from '../interfaces/IPhysicsEngine';
import { ContactPoint } from '../types/PhysicsTypes';

/**
 * Base physics event
 * 物理事件基类
 */
export abstract class PhysicsEvent extends Event {
  constructor(type: string, priority: EventPriority = EventPriority.Normal) {
    super(type, priority);
  }
}

/**
 * Collision begin event
 * 碰撞开始事件
 */
export class CollisionBeginEvent extends PhysicsEvent {
  constructor(
    /** First body in collision | 碰撞中的第一个物体 */
    public readonly bodyA: IRigidBody,
    /** Second body in collision | 碰撞中的第二个物体 */
    public readonly bodyB: IRigidBody,
    /** Collider A | 碰撞器A */
    public readonly colliderA: ICollider,
    /** Collider B | 碰撞器B */
    public readonly colliderB: ICollider,
    /** Contact points | 接触点 */
    public readonly contacts: ContactPoint[],
    /** Normal impulse | 法线冲量 */
    public readonly normalImpulse: Fixed,
    /** Tangent impulse | 切线冲量 */
    public readonly tangentImpulse: Fixed
  ) {
    super('CollisionBegin', EventPriority.High);
  }

  /**
   * Get the other body in the collision
   * 获取碰撞中的另一个物体
   */
  getOtherBody(body: IRigidBody): IRigidBody | null {
    if (body === this.bodyA) return this.bodyB;
    if (body === this.bodyB) return this.bodyA;
    return null;
  }

  /**
   * Get the other collider in the collision
   * 获取碰撞中的另一个碰撞器
   */
  getOtherCollider(collider: ICollider): ICollider | null {
    if (collider === this.colliderA) return this.colliderB;
    if (collider === this.colliderB) return this.colliderA;
    return null;
  }

  /**
   * Get total collision impulse
   * 获取总碰撞冲量
   */
  getTotalImpulse(): Fixed {
    return this.normalImpulse.add(this.tangentImpulse);
  }
}

/**
 * Collision end event
 * 碰撞结束事件
 */
export class CollisionEndEvent extends PhysicsEvent {
  constructor(
    /** First body in collision | 碰撞中的第一个物体 */
    public readonly bodyA: IRigidBody,
    /** Second body in collision | 碰撞中的第二个物体 */
    public readonly bodyB: IRigidBody,
    /** Collider A | 碰撞器A */
    public readonly colliderA: ICollider,
    /** Collider B | 碰撞器B */
    public readonly colliderB: ICollider,
    /** Duration of the collision | 碰撞持续时间 */
    public readonly duration: Fixed
  ) {
    super('CollisionEnd', EventPriority.High);
  }

  /**
   * Get the other body in the collision
   * 获取碰撞中的另一个物体
   */
  getOtherBody(body: IRigidBody): IRigidBody | null {
    if (body === this.bodyA) return this.bodyB;
    if (body === this.bodyB) return this.bodyA;
    return null;
  }
}

/**
 * Sensor begin event (trigger enter)
 * 传感器开始事件（触发器进入）
 */
export class SensorBeginEvent extends PhysicsEvent {
  constructor(
    /** Sensor body | 传感器物体 */
    public readonly sensorBody: IRigidBody,
    /** Sensor collider | 传感器碰撞器 */
    public readonly sensorCollider: ICollider,
    /** Other body that entered the sensor | 进入传感器的其他物体 */
    public readonly otherBody: IRigidBody,
    /** Other collider that entered the sensor | 进入传感器的其他碰撞器 */
    public readonly otherCollider: ICollider
  ) {
    super('SensorBegin', EventPriority.High);
  }
}

/**
 * Sensor end event (trigger exit)
 * 传感器结束事件（触发器退出）
 */
export class SensorEndEvent extends PhysicsEvent {
  constructor(
    /** Sensor body | 传感器物体 */
    public readonly sensorBody: IRigidBody,
    /** Sensor collider | 传感器碰撞器 */
    public readonly sensorCollider: ICollider,
    /** Other body that exited the sensor | 退出传感器的其他物体 */
    public readonly otherBody: IRigidBody,
    /** Other collider that exited the sensor | 退出传感器的其他碰撞器 */
    public readonly otherCollider: ICollider,
    /** Duration the other body was in the sensor | 其他物体在传感器中的持续时间 */
    public readonly duration: Fixed
  ) {
    super('SensorEnd', EventPriority.High);
  }
}

/**
 * Pre-solve event (before collision resolution)
 * 预解决事件（碰撞解决前）
 */
export class PreSolveEvent extends PhysicsEvent {
  constructor(
    /** First body in collision | 碰撞中的第一个物体 */
    public readonly bodyA: IRigidBody,
    /** Second body in collision | 碰撞中的第二个物体 */
    public readonly bodyB: IRigidBody,
    /** Collider A | 碰撞器A */
    public readonly colliderA: ICollider,
    /** Collider B | 碰撞器B */
    public readonly colliderB: ICollider,
    /** Contact points | 接触点 */
    public readonly contacts: ContactPoint[],
    /** Whether collision should be processed | 是否应该处理碰撞 */
    public processingEnabled: boolean = true
  ) {
    super('PreSolve', EventPriority.Highest);
  }

  /**
   * Disable collision processing
   * 禁用碰撞处理
   */
  disableProcessing(): void {
    this.processingEnabled = false;
  }

  /**
   * Enable collision processing
   * 启用碰撞处理
   */
  enableProcessing(): void {
    this.processingEnabled = true;
  }
}

/**
 * Post-solve event (after collision resolution)
 * 后解决事件（碰撞解决后）
 */
export class PostSolveEvent extends PhysicsEvent {
  constructor(
    /** First body in collision | 碰撞中的第一个物体 */
    public readonly bodyA: IRigidBody,
    /** Second body in collision | 碰撞中的第二个物体 */
    public readonly bodyB: IRigidBody,
    /** Collider A | 碰撞器A */
    public readonly colliderA: ICollider,
    /** Collider B | 碰撞器B */
    public readonly colliderB: ICollider,
    /** Contact points | 接触点 */
    public readonly contacts: ContactPoint[],
    /** Normal impulse applied | 应用的法线冲量 */
    public readonly normalImpulse: Fixed,
    /** Tangent impulse applied | 应用的切线冲量 */
    public readonly tangentImpulse: Fixed
  ) {
    super('PostSolve', EventPriority.High);
  }
}

/**
 * Body sleep event
 * 物体休眠事件
 */
export class BodySleepEvent extends PhysicsEvent {
  constructor(
    /** Body that went to sleep | 进入休眠的物体 */
    public readonly body: IRigidBody
  ) {
    super('BodySleep', EventPriority.Low);
  }
}

/**
 * Body wake event
 * 物体唤醒事件
 */
export class BodyWakeEvent extends PhysicsEvent {
  constructor(
    /** Body that woke up | 被唤醒的物体 */
    public readonly body: IRigidBody
  ) {
    super('BodyWake', EventPriority.Low);
  }
}

/**
 * Joint break event
 * 关节断裂事件
 */
export class JointBreakEvent extends PhysicsEvent {
  constructor(
    /** Joint that broke | 断裂的关节 */
    public readonly joint: unknown, // Will be typed as specific engine's joint type
    /** Force that caused the break | 导致断裂的力 */
    public readonly breakForce: Fixed,
    /** Torque that caused the break | 导致断裂的扭矩 */
    public readonly breakTorque: Fixed
  ) {
    super('JointBreak', EventPriority.High);
  }
}

/**
 * Physics step begin event
 * 物理步骤开始事件
 */
export class PhysicsStepBeginEvent extends PhysicsEvent {
  constructor(
    /** Time step | 时间步长 */
    public readonly timeStep: Fixed,
    /** Step count | 步骤计数 */
    public readonly stepCount: number
  ) {
    super('PhysicsStepBegin', EventPriority.Low);
  }
}

/**
 * Physics step end event
 * 物理步骤结束事件
 */
export class PhysicsStepEndEvent extends PhysicsEvent {
  constructor(
    /** Time step | 时间步长 */
    public readonly timeStep: Fixed,
    /** Step count | 步骤计数 */
    public readonly stepCount: number,
    /** Step duration | 步骤持续时间 */
    public readonly duration: Fixed
  ) {
    super('PhysicsStepEnd', EventPriority.Low);
  }
}

/**
 * Raycast hit event
 * 射线投射命中事件
 */
export class RaycastHitEvent extends PhysicsEvent {
  constructor(
    /** Ray origin | 射线起点 */
    public readonly origin: FixedVector2,
    /** Ray direction | 射线方向 */
    public readonly direction: FixedVector2,
    /** Hit point | 命中点 */
    public readonly hitPoint: FixedVector2,
    /** Hit normal | 命中法线 */
    public readonly hitNormal: FixedVector2,
    /** Hit distance | 命中距离 */
    public readonly hitDistance: Fixed,
    /** Hit body | 命中的物体 */
    public readonly hitBody: IRigidBody,
    /** Hit collider | 命中的碰撞器 */
    public readonly hitCollider: ICollider
  ) {
    super('RaycastHit', EventPriority.Normal);
  }
}