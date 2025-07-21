import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { IRigidBody, ICollider, IJoint } from '../interfaces/IPhysicsEngine';
import { ContactPoint } from '../types/PhysicsTypes';

/**
 * Debug rendering configuration
 * 调试渲染配置
 */
export interface PhysicsDebugDrawConfig {
  /** Draw rigid bodies | 绘制刚体 */
  drawBodies: boolean;
  /** Draw body transforms (position and rotation) | 绘制物体变换（位置和旋转） */
  drawTransforms: boolean;
  /** Draw colliders/fixtures | 绘制碰撞器/装置 */
  drawColliders: boolean;
  /** Draw joints | 绘制关节 */
  drawJoints: boolean;
  /** Draw AABBs (axis-aligned bounding boxes) | 绘制轴对齐包围盒 */
  drawAABBs: boolean;
  /** Draw contact points | 绘制接触点 */
  drawContactPoints: boolean;
  /** Draw contact normals | 绘制接触法线 */
  drawContactNormals: boolean;
  /** Draw velocities | 绘制速度 */
  drawVelocities: boolean;
  /** Draw center of mass | 绘制质心 */
  drawCenterOfMass: boolean;
  /** Draw physics statistics | 绘制物理统计信息 */
  drawStatistics: boolean;
  /** Draw inactive/sleeping bodies differently | 不同方式绘制非活动/休眠的物体 */
  drawSleepingBodies: boolean;
  /** Draw sensors differently from solid colliders | 不同方式绘制传感器与实体碰撞器 */
  drawSensors: boolean;
}

/**
 * Debug drawing colors
 * 调试绘制颜色
 */
export interface PhysicsDebugColors {
  /** Active body outline color | 活动物体轮廓颜色 */
  activeBody: string;
  /** Inactive body outline color | 非活动物体轮廓颜色 */
  inactiveBody: string;
  /** Sleeping body outline color | 休眠物体轮廓颜色 */
  sleepingBody: string;
  /** Static body outline color | 静态物体轮廓颜色 */
  staticBody: string;
  /** Kinematic body outline color | 运动学物体轮廓颜色 */
  kinematicBody: string;
  /** Dynamic body outline color | 动态物体轮廓颜色 */
  dynamicBody: string;
  /** Joint line color | 关节线条颜色 */
  joint: string;
  /** AABB outline color | AABB轮廓颜色 */
  aabb: string;
  /** Contact point color | 接触点颜色 */
  contactPoint: string;
  /** Contact normal color | 接触法线颜色 */
  contactNormal: string;
  /** Velocity vector color | 速度矢量颜色 */
  velocity: string;
  /** Center of mass color | 质心颜色 */
  centerOfMass: string;
  /** Sensor outline color | 传感器轮廓颜色 */
  sensor: string;
  /** Background color | 背景颜色 */
  background: string;
  /** Text color | 文本颜色 */
  text: string;
}

/**
 * Debug statistics information
 * 调试统计信息
 */
export interface PhysicsDebugStats {
  /** Number of bodies in the world | 世界中的物体数量 */
  bodyCount: number;
  /** Number of active bodies | 活动物体数量 */
  activeBodies: number;
  /** Number of sleeping bodies | 休眠物体数量 */
  sleepingBodies: number;
  /** Number of static bodies | 静态物体数量 */
  staticBodies: number;
  /** Number of dynamic bodies | 动态物体数量 */
  dynamicBodies: number;
  /** Number of kinematic bodies | 运动学物体数量 */
  kinematicBodies: number;
  /** Number of colliders | 碰撞器数量 */
  colliderCount: number;
  /** Number of joints | 关节数量 */
  jointCount: number;
  /** Number of contact points | 接触点数量 */
  contactCount: number;
  /** Physics step time in milliseconds | 物理步骤时间（毫秒） */
  stepTime: Fixed;
  /** Frame rate | 帧率 */
  fps: number;
  /** Memory usage in bytes | 内存使用量（字节） */
  memoryUsage: number;
}

/**
 * Physics debug renderer interface
 * 物理调试渲染器接口
 */
export interface IPhysicsDebugRenderer {
  // Configuration | 配置
  
  /**
   * Enable/disable debug rendering
   * 启用/禁用调试渲染
   */
  setEnabled(enabled: boolean): void;
  
  /**
   * Check if debug rendering is enabled
   * 检查是否启用调试渲染
   */
  isEnabled(): boolean;
  
  /**
   * Set debug draw configuration
   * 设置调试绘制配置
   */
  setConfig(config: Partial<PhysicsDebugDrawConfig>): void;
  
  /**
   * Get debug draw configuration
   * 获取调试绘制配置
   */
  getConfig(): PhysicsDebugDrawConfig;
  
  /**
   * Set debug colors
   * 设置调试颜色
   */
  setColors(colors: Partial<PhysicsDebugColors>): void;
  
  /**
   * Get debug colors
   * 获取调试颜色
   */
  getColors(): PhysicsDebugColors;

  // Drawing methods | 绘制方法
  
  /**
   * Begin debug frame
   * 开始调试帧
   */
  beginFrame(): void;
  
  /**
   * End debug frame
   * 结束调试帧
   */
  endFrame(): void;
  
  /**
   * Clear the debug canvas
   * 清除调试画布
   */
  clear(): void;
  
  /**
   * Draw all rigid bodies
   * 绘制所有刚体
   */
  drawRigidBodies(bodies: IRigidBody[]): void;
  
  /**
   * Draw a single rigid body
   * 绘制单个刚体
   */
  drawRigidBody(body: IRigidBody): void;
  
  /**
   * Draw all colliders
   * 绘制所有碰撞器
   */
  drawColliders(colliders: ICollider[]): void;
  
  /**
   * Draw a single collider
   * 绘制单个碰撞器
   */
  drawCollider(collider: ICollider): void;
  
  /**
   * Draw all joints
   * 绘制所有关节
   */
  drawJoints(joints: IJoint[]): void;
  
  /**
   * Draw a single joint
   * 绘制单个关节
   */
  drawJoint(joint: IJoint): void;
  
  /**
   * Draw contact points
   * 绘制接触点
   */
  drawContactPoints(contacts: ContactPoint[]): void;
  
  /**
   * Draw a single contact point
   * 绘制单个接触点
   */
  drawContactPoint(contact: ContactPoint): void;
  
  /**
   * Draw physics statistics
   * 绘制物理统计信息
   */
  drawStatistics(stats: PhysicsDebugStats): void;

  // Primitive drawing methods | 原始绘制方法
  
  /**
   * Draw a line
   * 绘制线条
   */
  drawLine(start: FixedVector2, end: FixedVector2, color: string, thickness?: Fixed): void;
  
  /**
   * Draw a circle
   * 绘制圆形
   */
  drawCircle(center: FixedVector2, radius: Fixed, color: string, filled?: boolean): void;
  
  /**
   * Draw a rectangle
   * 绘制矩形
   */
  drawRect(position: FixedVector2, width: Fixed, height: Fixed, rotation: Fixed, color: string, filled?: boolean): void;
  
  /**
   * Draw a polygon
   * 绘制多边形
   */
  drawPolygon(vertices: FixedVector2[], color: string, filled?: boolean): void;
  
  /**
   * Draw a point
   * 绘制点
   */
  drawPoint(position: FixedVector2, size: Fixed, color: string): void;
  
  /**
   * Draw a vector/arrow
   * 绘制矢量/箭头
   */
  drawVector(origin: FixedVector2, direction: FixedVector2, length: Fixed, color: string): void;
  
  /**
   * Draw text
   * 绘制文本
   */
  drawText(text: string, position: FixedVector2, color: string, size?: number): void;

  // Transform methods | 变换方法
  
  /**
   * Set camera/view transform
   * 设置相机/视图变换
   */
  setViewTransform(position: FixedVector2, rotation: Fixed, zoom: Fixed): void;
  
  /**
   * Reset view transform to default
   * 重置视图变换为默认值
   */
  resetViewTransform(): void;
  
  /**
   * Convert world coordinates to screen coordinates
   * 将世界坐标转换为屏幕坐标
   */
  worldToScreen(worldPos: FixedVector2): FixedVector2;
  
  /**
   * Convert screen coordinates to world coordinates
   * 将屏幕坐标转换为世界坐标
   */
  screenToWorld(screenPos: FixedVector2): FixedVector2;

  // Utility methods | 工具方法
  
  /**
   * Take a screenshot of the debug canvas
   * 截取调试画布的屏幕截图
   */
  takeScreenshot(): Promise<Blob | string>;
  
  /**
   * Save debug configuration to JSON
   * 将调试配置保存为JSON
   */
  exportConfig(): string;
  
  /**
   * Load debug configuration from JSON
   * 从JSON加载调试配置
   */
  importConfig(configJson: string): void;
  
  /**
   * Get render target (canvas/context)
   * 获取渲染目标（画布/上下文）
   */
  getRenderTarget(): unknown;
  
  /**
   * Dispose of the debug renderer and clean up resources
   * 释放调试渲染器并清理资源
   */
  dispose(): void;
}

/**
 * Default debug draw configuration
 * 默认调试绘制配置
 */
export const DEFAULT_DEBUG_CONFIG: PhysicsDebugDrawConfig = {
  drawBodies: true,
  drawTransforms: false,
  drawColliders: true,
  drawJoints: true,
  drawAABBs: false,
  drawContactPoints: false,
  drawContactNormals: false,
  drawVelocities: false,
  drawCenterOfMass: false,
  drawStatistics: true,
  drawSleepingBodies: true,
  drawSensors: true
};

/**
 * Default debug colors
 * 默认调试颜色
 */
export const DEFAULT_DEBUG_COLORS: PhysicsDebugColors = {
  activeBody: '#00FF00',
  inactiveBody: '#808080',
  sleepingBody: '#0000FF',
  staticBody: '#FFFFFF',
  kinematicBody: '#FFFF00',
  dynamicBody: '#00FF00',
  joint: '#FF00FF',
  aabb: '#FF0000',
  contactPoint: '#FF0000',
  contactNormal: '#FFFF00',
  velocity: '#00FFFF',
  centerOfMass: '#FF8000',
  sensor: '#FF00FF',
  background: '#000000',
  text: '#FFFFFF'
};