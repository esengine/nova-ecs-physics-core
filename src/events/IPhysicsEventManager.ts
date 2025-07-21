import { EventListener } from '@esengine/nova-ecs';
import {
  CollisionBeginEvent,
  CollisionEndEvent,
  SensorBeginEvent,
  SensorEndEvent,
  PreSolveEvent,
  PostSolveEvent,
  BodySleepEvent,
  BodyWakeEvent,
  JointBreakEvent,
  PhysicsStepBeginEvent,
  PhysicsStepEndEvent,
  RaycastHitEvent,
  PhysicsEvent
} from './PhysicsEvents';

/**
 * Physics event manager interface for handling physics-related events
 * 处理物理相关事件的物理事件管理器接口
 */
export interface IPhysicsEventManager {
  // Collision events | 碰撞事件
  
  /**
   * Subscribe to collision begin events
   * 订阅碰撞开始事件
   */
  onCollisionBegin(listener: EventListener<CollisionBeginEvent>): void;
  
  /**
   * Subscribe to collision end events
   * 订阅碰撞结束事件
   */
  onCollisionEnd(listener: EventListener<CollisionEndEvent>): void;
  
  /**
   * Subscribe to sensor begin events
   * 订阅传感器开始事件
   */
  onSensorBegin(listener: EventListener<SensorBeginEvent>): void;
  
  /**
   * Subscribe to sensor end events
   * 订阅传感器结束事件
   */
  onSensorEnd(listener: EventListener<SensorEndEvent>): void;
  
  /**
   * Subscribe to pre-solve events
   * 订阅预解决事件
   */
  onPreSolve(listener: EventListener<PreSolveEvent>): void;
  
  /**
   * Subscribe to post-solve events
   * 订阅后解决事件
   */
  onPostSolve(listener: EventListener<PostSolveEvent>): void;

  // Body events | 物体事件
  
  /**
   * Subscribe to body sleep events
   * 订阅物体休眠事件
   */
  onBodySleep(listener: EventListener<BodySleepEvent>): void;
  
  /**
   * Subscribe to body wake events
   * 订阅物体唤醒事件
   */
  onBodyWake(listener: EventListener<BodyWakeEvent>): void;

  // Joint events | 关节事件
  
  /**
   * Subscribe to joint break events
   * 订阅关节断裂事件
   */
  onJointBreak(listener: EventListener<JointBreakEvent>): void;

  // Physics step events | 物理步骤事件
  
  /**
   * Subscribe to physics step begin events
   * 订阅物理步骤开始事件
   */
  onPhysicsStepBegin(listener: EventListener<PhysicsStepBeginEvent>): void;
  
  /**
   * Subscribe to physics step end events
   * 订阅物理步骤结束事件
   */
  onPhysicsStepEnd(listener: EventListener<PhysicsStepEndEvent>): void;

  // Raycast events | 射线投射事件
  
  /**
   * Subscribe to raycast hit events
   * 订阅射线投射命中事件
   */
  onRaycastHit(listener: EventListener<RaycastHitEvent>): void;

  // Generic event handling | 通用事件处理
  
  /**
   * Subscribe to any physics event
   * 订阅任何物理事件
   */
  onPhysicsEvent(listener: EventListener<PhysicsEvent>): void;

  // Unsubscription methods | 取消订阅方法
  
  /**
   * Unsubscribe from collision begin events
   * 取消订阅碰撞开始事件
   */
  offCollisionBegin(listener: EventListener<CollisionBeginEvent>): void;
  
  /**
   * Unsubscribe from collision end events
   * 取消订阅碰撞结束事件
   */
  offCollisionEnd(listener: EventListener<CollisionEndEvent>): void;
  
  /**
   * Unsubscribe from sensor begin events
   * 取消订阅传感器开始事件
   */
  offSensorBegin(listener: EventListener<SensorBeginEvent>): void;
  
  /**
   * Unsubscribe from sensor end events
   * 取消订阅传感器结束事件
   */
  offSensorEnd(listener: EventListener<SensorEndEvent>): void;
  
  /**
   * Unsubscribe from pre-solve events
   * 取消订阅预解决事件
   */
  offPreSolve(listener: EventListener<PreSolveEvent>): void;
  
  /**
   * Unsubscribe from post-solve events
   * 取消订阅后解决事件
   */
  offPostSolve(listener: EventListener<PostSolveEvent>): void;
  
  /**
   * Unsubscribe from body sleep events
   * 取消订阅物体休眠事件
   */
  offBodySleep(listener: EventListener<BodySleepEvent>): void;
  
  /**
   * Unsubscribe from body wake events
   * 取消订阅物体唤醒事件
   */
  offBodyWake(listener: EventListener<BodyWakeEvent>): void;
  
  /**
   * Unsubscribe from joint break events
   * 取消订阅关节断裂事件
   */
  offJointBreak(listener: EventListener<JointBreakEvent>): void;
  
  /**
   * Unsubscribe from physics step begin events
   * 取消订阅物理步骤开始事件
   */
  offPhysicsStepBegin(listener: EventListener<PhysicsStepBeginEvent>): void;
  
  /**
   * Unsubscribe from physics step end events
   * 取消订阅物理步骤结束事件
   */
  offPhysicsStepEnd(listener: EventListener<PhysicsStepEndEvent>): void;
  
  /**
   * Unsubscribe from raycast hit events
   * 取消订阅射线投射命中事件
   */
  offRaycastHit(listener: EventListener<RaycastHitEvent>): void;
  
  /**
   * Unsubscribe from any physics event
   * 取消订阅任何物理事件
   */
  offPhysicsEvent(listener: EventListener<PhysicsEvent>): void;

  // Event emission | 事件发射
  
  /**
   * Emit a physics event
   * 发射物理事件
   */
  emit(event: PhysicsEvent): void;

  // Utility methods | 工具方法
  
  /**
   * Clear all event listeners
   * 清除所有事件监听器
   */
  clearAllListeners(): void;
  
  /**
   * Get the number of listeners for a specific event type
   * 获取特定事件类型的监听器数量
   */
  getListenerCount(eventType: string): number;
  
  /**
   * Check if there are any listeners for a specific event type
   * 检查特定事件类型是否有监听器
   */
  hasListeners(eventType: string): boolean;
  
  /**
   * Get all registered event types
   * 获取所有注册的事件类型
   */
  getEventTypes(): string[];
}