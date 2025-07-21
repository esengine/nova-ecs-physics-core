import { Fixed, FixedVector2 } from '@esengine/nova-ecs-math';
import { IRigidBody, ICollider, IJoint } from '../interfaces/IPhysicsEngine';
import { ContactPoint } from '../types/PhysicsTypes';
import {
  IPhysicsDebugRenderer,
  PhysicsDebugDrawConfig,
  PhysicsDebugColors,
  PhysicsDebugStats,
  DEFAULT_DEBUG_CONFIG,
  DEFAULT_DEBUG_COLORS
} from './IPhysicsDebugRenderer';

/**
 * Base implementation of physics debug renderer
 * 物理调试渲染器的基础实现
 */
export abstract class BasePhysicsDebugRenderer implements IPhysicsDebugRenderer {
  /** Whether debug rendering is enabled | 是否启用调试渲染 */
  protected enabled: boolean = false;
  
  /** Debug draw configuration | 调试绘制配置 */
  protected config: PhysicsDebugDrawConfig;
  
  /** Debug colors | 调试颜色 */
  protected colors: PhysicsDebugColors;
  
  /** Current view transform | 当前视图变换 */
  protected viewPosition: FixedVector2 = new FixedVector2();
  protected viewRotation: Fixed = Fixed.ZERO;
  protected viewZoom: Fixed = Fixed.ONE;

  constructor() {
    this.config = { ...DEFAULT_DEBUG_CONFIG };
    this.colors = { ...DEFAULT_DEBUG_COLORS };
  }

  // Configuration methods | 配置方法

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setConfig(config: Partial<PhysicsDebugDrawConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): PhysicsDebugDrawConfig {
    return { ...this.config };
  }

  setColors(colors: Partial<PhysicsDebugColors>): void {
    this.colors = { ...this.colors, ...colors };
  }

  getColors(): PhysicsDebugColors {
    return { ...this.colors };
  }

  // Abstract methods that must be implemented by subclasses
  // 必须由子类实现的抽象方法
  
  abstract beginFrame(): void;
  abstract endFrame(): void;
  abstract clear(): void;
  abstract getRenderTarget(): unknown;
  abstract dispose(): void;

  // High-level drawing methods | 高级绘制方法

  drawRigidBodies(bodies: IRigidBody[]): void {
    if (!this.enabled || !this.config.drawBodies) return;

    for (const body of bodies) {
      this.drawRigidBody(body);
    }
  }

  drawRigidBody(body: IRigidBody): void {
    if (!this.enabled || !body) return;

    const position = body.getPosition();
    const rotation = body.getRotation();
    
    // Determine body color based on state
    let color = this.colors.dynamicBody;
    if (!body.isActive()) {
      color = this.colors.inactiveBody;
    } else if (!body.isAwake()) {
      color = this.colors.sleepingBody;
    }

    // Draw body transform
    if (this.config.drawTransforms) {
      const size = new Fixed(0.5);
      this.drawVector(position, new FixedVector2(rotation.cos(), rotation.sin()), size, color);
    }

    // Draw center of mass
    if (this.config.drawCenterOfMass) {
      this.drawPoint(position, new Fixed(0.1), this.colors.centerOfMass);
    }

    // Draw velocity
    if (this.config.drawVelocities) {
      const velocity = body.getLinearVelocity();
      const velocityMagnitude = velocity.magnitude();
      if (velocityMagnitude.greaterThan(Fixed.ZERO)) {
        this.drawVector(position, velocity.normalize(), velocityMagnitude, this.colors.velocity);
      }
    }
  }

  drawColliders(colliders: ICollider[]): void {
    if (!this.enabled || !this.config.drawColliders) return;

    for (const collider of colliders) {
      this.drawCollider(collider);
    }
  }

  drawCollider(collider: ICollider): void {
    if (!this.enabled || !collider) return;

    const body = collider.getBody();
    if (!body) return;

    const position = body.getPosition();
    
    // Choose color based on sensor state
    const color = collider.isSensor() ? this.colors.sensor : this.colors.dynamicBody;
    
    // Draw collider shape (implementation depends on collider type)
    // This is a simplified implementation - real implementations would
    // need to handle different collider types (box, circle, polygon, etc.)
    // 绘制碰撞器形状（实现取决于碰撞器类型）
    // 这是一个简化的实现 - 真正的实现需要处理不同的碰撞器类型
    this.drawPoint(position, new Fixed(0.2), color);
  }

  drawJoints(joints: IJoint[]): void {
    if (!this.enabled || !this.config.drawJoints) return;

    for (const joint of joints) {
      this.drawJoint(joint);
    }
  }

  drawJoint(joint: IJoint): void {
    if (!this.enabled || !joint) return;

    const bodyA = joint.getBodyA();
    const bodyB = joint.getBodyB();
    
    if (bodyA && bodyB) {
      const posA = bodyA.getPosition();
      const posB = bodyB.getPosition();
      this.drawLine(posA, posB, this.colors.joint, new Fixed(2));
    }
  }

  drawContactPoints(contacts: ContactPoint[]): void {
    if (!this.enabled || !this.config.drawContactPoints) return;

    for (const contact of contacts) {
      this.drawContactPoint(contact);
    }
  }

  drawContactPoint(contact: ContactPoint): void {
    if (!this.enabled) return;

    // Draw contact point
    this.drawPoint(contact.position, new Fixed(0.1), this.colors.contactPoint);
    
    // Draw contact normal
    if (this.config.drawContactNormals) {
      const normalEnd = contact.position.add(contact.normal.multiply(new Fixed(0.5)));
      this.drawLine(contact.position, normalEnd, this.colors.contactNormal, new Fixed(1));
    }
  }

  drawStatistics(stats: PhysicsDebugStats): void {
    if (!this.enabled || !this.config.drawStatistics) return;

    const lines: string[] = [
      `Bodies: ${stats.bodyCount}`,
      `Active: ${stats.activeBodies}`,
      `Sleeping: ${stats.sleepingBodies}`,
      `Colliders: ${stats.colliderCount}`,
      `Joints: ${stats.jointCount}`,
      `Contacts: ${stats.contactCount}`,
      `Step Time: ${stats.stepTime.toNumber().toFixed(2)}ms`,
      `FPS: ${stats.fps}`,
      `Memory: ${(stats.memoryUsage / 1024 / 1024).toFixed(2)}MB`
    ];

    const startPos = new FixedVector2(10, 10);
    const lineHeight = 20;
    
    for (let i = 0; i < lines.length; i++) {
      const position = new FixedVector2(startPos.x, startPos.y.add(new Fixed(i * lineHeight)));
      this.drawText(lines[i] || '', position, this.colors.text, 14);
    }
  }

  // Transform methods | 变换方法

  setViewTransform(position: FixedVector2, rotation: Fixed, zoom: Fixed): void {
    this.viewPosition = position;
    this.viewRotation = rotation;
    this.viewZoom = zoom;
  }

  resetViewTransform(): void {
    this.viewPosition = new FixedVector2();
    this.viewRotation = Fixed.ZERO;
    this.viewZoom = Fixed.ONE;
  }

  worldToScreen(worldPos: FixedVector2): FixedVector2 {
    // Apply view transform
    // 应用视图变换
    const relativePos = worldPos.subtract(this.viewPosition);
    const scaledPos = relativePos.multiply(this.viewZoom);
    
    // Apply rotation if needed
    if (!this.viewRotation.equals(Fixed.ZERO)) {
      const cos = this.viewRotation.cos();
      const sin = this.viewRotation.sin();
      const rotatedX = scaledPos.x.multiply(cos).subtract(scaledPos.y.multiply(sin));
      const rotatedY = scaledPos.x.multiply(sin).add(scaledPos.y.multiply(cos));
      return new FixedVector2(rotatedX, rotatedY);
    }
    
    return scaledPos;
  }

  screenToWorld(screenPos: FixedVector2): FixedVector2 {
    // Reverse the world to screen transform
    // 反转世界到屏幕的变换
    let worldPos = screenPos;
    
    // Reverse rotation
    if (!this.viewRotation.equals(Fixed.ZERO)) {
      const cos = this.viewRotation.cos();
      const sin = this.viewRotation.sin();
      const rotatedX = worldPos.x.multiply(cos).add(worldPos.y.multiply(sin));
      const rotatedY = worldPos.y.multiply(cos).subtract(worldPos.x.multiply(sin));
      worldPos = new FixedVector2(rotatedX, rotatedY);
    }
    
    // Reverse scale and translation
    const unscaledPos = worldPos.divide(this.viewZoom);
    return unscaledPos.add(this.viewPosition);
  }

  // Utility methods | 工具方法

  takeScreenshot(): Promise<Blob | string> {
    // Default implementation returns empty string
    // Subclasses should override this with actual screenshot logic
    // 默认实现返回空字符串
    // 子类应该用实际的截图逻辑重写此方法
    return Promise.resolve('');
  }

  exportConfig(): string {
    const exportData = {
      config: this.config,
      colors: this.colors,
      enabled: this.enabled
    };
    return JSON.stringify(exportData, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const importData = JSON.parse(configJson) as {
        config?: Partial<PhysicsDebugDrawConfig>;
        colors?: Partial<PhysicsDebugColors>;
        enabled?: boolean;
      };
      
      if (importData.config) {
        this.setConfig(importData.config);
      }
      if (importData.colors) {
        this.setColors(importData.colors);
      }
      if (typeof importData.enabled === 'boolean') {
        this.setEnabled(importData.enabled);
      }
    } catch (error) {
      // Use a proper logging method instead of console
      // 使用适当的日志方法而不是 console
      throw new Error(`Failed to import debug config: ${String(error)}`);
    }
  }

  // Abstract primitive drawing methods that must be implemented
  // 必须实现的抽象原始绘制方法
  
  abstract drawLine(start: FixedVector2, end: FixedVector2, color: string, thickness?: Fixed): void;
  abstract drawCircle(center: FixedVector2, radius: Fixed, color: string, filled?: boolean): void;
  abstract drawRect(position: FixedVector2, width: Fixed, height: Fixed, rotation: Fixed, color: string, filled?: boolean): void;
  abstract drawPolygon(vertices: FixedVector2[], color: string, filled?: boolean): void;
  abstract drawPoint(position: FixedVector2, size: Fixed, color: string): void;
  abstract drawVector(origin: FixedVector2, direction: FixedVector2, length: Fixed, color: string): void;
  abstract drawText(text: string, position: FixedVector2, color: string, size?: number): void;
}