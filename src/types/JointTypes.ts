import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { BaseJointConfig, JointType } from './PhysicsTypes';

/**
 * Distance joint configuration
 * 距离关节配置
 */
export interface DistanceJointConfig extends BaseJointConfig {
  type: JointType.Distance;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Rest length of the distance joint | 距离关节的静止长度 */
  length: Fixed;
  /** Minimum length (optional) | 最小长度（可选） */
  minLength?: Fixed;
  /** Maximum length (optional) | 最大长度（可选） */
  maxLength?: Fixed;
  /** Stiffness/frequency of the joint | 关节的刚度/频率 */
  stiffness?: Fixed;
  /** Damping ratio | 阻尼比 */
  damping?: Fixed;
}

/**
 * Revolute joint configuration
 * 旋转关节配置
 */
export interface RevoluteJointConfig extends BaseJointConfig {
  type: JointType.Revolute;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Reference angle between bodies | 物体之间的参考角度 */
  referenceAngle?: Fixed;
  /** Enable angle limits | 启用角度限制 */
  enableLimit?: boolean;
  /** Lower angle limit | 下角度限制 */
  lowerAngle?: Fixed;
  /** Upper angle limit | 上角度限制 */
  upperAngle?: Fixed;
  /** Enable motor | 启用电机 */
  enableMotor?: boolean;
  /** Motor speed | 电机速度 */
  motorSpeed?: Fixed;
  /** Maximum motor torque | 最大电机扭矩 */
  maxMotorTorque?: Fixed;
}

/**
 * Prismatic joint configuration
 * 棱柱关节配置
 */
export interface PrismaticJointConfig extends BaseJointConfig {
  type: JointType.Prismatic;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Local translation axis on body A | 物体A上的本地平移轴 */
  localAxisA: FixedVector2;
  /** Reference angle between bodies | 物体之间的参考角度 */
  referenceAngle?: Fixed;
  /** Enable translation limits | 启用平移限制 */
  enableLimit?: boolean;
  /** Lower translation limit | 下平移限制 */
  lowerTranslation?: Fixed;
  /** Upper translation limit | 上平移限制 */
  upperTranslation?: Fixed;
  /** Enable motor | 启用电机 */
  enableMotor?: boolean;
  /** Motor speed | 电机速度 */
  motorSpeed?: Fixed;
  /** Maximum motor force | 最大电机力 */
  maxMotorForce?: Fixed;
}

/**
 * Weld joint configuration
 * 焊接关节配置
 */
export interface WeldJointConfig extends BaseJointConfig {
  type: JointType.Weld;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Reference angle between bodies | 物体之间的参考角度 */
  referenceAngle?: Fixed;
  /** Stiffness/frequency of the joint | 关节的刚度/频率 */
  stiffness?: Fixed;
  /** Damping ratio | 阻尼比 */
  damping?: Fixed;
}

/**
 * Rope joint configuration
 * 绳索关节配置
 */
export interface RopeJointConfig extends BaseJointConfig {
  type: JointType.Rope;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Maximum rope length | 最大绳索长度 */
  maxLength: Fixed;
}

/**
 * Mouse joint configuration
 * 鼠标关节配置
 */
export interface MouseJointConfig extends BaseJointConfig {
  type: JointType.Mouse;
  /** Target point in world coordinates | 世界坐标中的目标点 */
  target: FixedVector2;
  /** Maximum force | 最大力 */
  maxForce: Fixed;
  /** Stiffness/frequency of the joint | 关节的刚度/频率 */
  stiffness?: Fixed;
  /** Damping ratio | 阻尼比 */
  damping?: Fixed;
}

/**
 * Pulley joint configuration
 * 滑轮关节配置
 */
export interface PulleyJointConfig extends BaseJointConfig {
  type: JointType.Pulley;
  /** Ground anchor point A | 地面锚点A */
  groundAnchorA: FixedVector2;
  /** Ground anchor point B | 地面锚点B */
  groundAnchorB: FixedVector2;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Length of rope connected to body A | 连接到物体A的绳索长度 */
  lengthA: Fixed;
  /** Length of rope connected to body B | 连接到物体B的绳索长度 */
  lengthB: Fixed;
  /** Pulley ratio | 滑轮比 */
  ratio?: Fixed;
}

/**
 * Gear joint configuration
 * 齿轮关节配置
 */
export interface GearJointConfig extends BaseJointConfig {
  type: JointType.Gear;
  /** First joint (must be revolute or prismatic) | 第一个关节（必须是旋转或棱柱关节） */
  joint1: unknown; // Will be typed as specific engine's joint type
  /** Second joint (must be revolute or prismatic) | 第二个关节（必须是旋转或棱柱关节） */
  joint2: unknown; // Will be typed as specific engine's joint type
  /** Gear ratio | 齿轮比 */
  ratio: Fixed;
}

/**
 * Motor joint configuration
 * 电机关节配置
 */
export interface MotorJointConfig extends BaseJointConfig {
  type: JointType.Motor;
  /** Linear offset between bodies | 物体之间的线性偏移 */
  linearOffset: FixedVector2;
  /** Angular offset between bodies | 物体之间的角度偏移 */
  angularOffset: Fixed;
  /** Maximum force | 最大力 */
  maxForce: Fixed;
  /** Maximum torque | 最大扭矩 */
  maxTorque: Fixed;
  /** Correction factor | 修正因子 */
  correctionFactor?: Fixed;
}

/**
 * Wheel joint configuration
 * 车轮关节配置
 */
export interface WheelJointConfig extends BaseJointConfig {
  type: JointType.Wheel;
  /** Local anchor point on body A | 物体A上的本地锚点 */
  localAnchorA: FixedVector2;
  /** Local anchor point on body B | 物体B上的本地锚点 */
  localAnchorB: FixedVector2;
  /** Local translation axis on body A | 物体A上的本地平移轴 */
  localAxisA: FixedVector2;
  /** Enable motor | 启用电机 */
  enableMotor?: boolean;
  /** Motor speed | 电机速度 */
  motorSpeed?: Fixed;
  /** Maximum motor torque | 最大电机扭矩 */
  maxMotorTorque?: Fixed;
  /** Spring stiffness | 弹簧刚度 */
  stiffness?: Fixed;
  /** Spring damping | 弹簧阻尼 */
  damping?: Fixed;
}

/**
 * Union type for all joint configurations
 * 所有关节配置的联合类型
 */
export type JointConfig = 
  | DistanceJointConfig
  | RevoluteJointConfig
  | PrismaticJointConfig
  | WeldJointConfig
  | RopeJointConfig
  | MouseJointConfig
  | PulleyJointConfig
  | GearJointConfig
  | MotorJointConfig
  | WheelJointConfig;

/**
 * Joint limit information
 * 关节限制信息
 */
export interface JointLimits {
  /** Whether limits are enabled | 是否启用限制 */
  enabled: boolean;
  /** Lower limit | 下限制 */
  lower: Fixed;
  /** Upper limit | 上限制 */
  upper: Fixed;
}

/**
 * Joint motor information
 * 关节电机信息
 */
export interface JointMotor {
  /** Whether motor is enabled | 是否启用电机 */
  enabled: boolean;
  /** Motor speed/velocity | 电机速度/速率 */
  speed: Fixed;
  /** Maximum motor force/torque | 最大电机力/扭矩 */
  maxForce: Fixed;
}

/**
 * Joint break settings
 * 关节断裂设置
 */
export interface JointBreakSettings {
  /** Whether breaking is enabled | 是否启用断裂 */
  enabled: boolean;
  /** Force threshold for breaking | 断裂的力阈值 */
  forceThreshold: Fixed;
  /** Torque threshold for breaking | 断裂的扭矩阈值 */
  torqueThreshold: Fixed;
}

/**
 * Extended joint configuration with common settings
 * 带有通用设置的扩展关节配置
 */
export interface ExtendedJointConfig extends BaseJointConfig {
  /** Joint limits | 关节限制 */
  limits?: JointLimits;
  /** Joint motor | 关节电机 */
  motor?: JointMotor;
  /** Break settings | 断裂设置 */
  breakSettings?: JointBreakSettings;
  /** Whether to auto-destroy on break | 是否在断裂时自动销毁 */
  autoDestroyOnBreak?: boolean;
}