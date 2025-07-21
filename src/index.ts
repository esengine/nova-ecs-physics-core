/**
 * @esengine/nova-ecs-physics-core - Core physics engine abstraction layer for NovaECS
 * NovaECS的核心物理引擎抽象层
 *
 * @packageDocumentation
 */

// Core interfaces
export {
  IPhysicsEngine,
  IPhysicsWorld,
  IRigidBody,
  ICollider,
  IJoint,
  IPhysicsEngineFactory
} from './interfaces/IPhysicsEngine';

// Types
export {
  PhysicsWorldConfig,
  RigidBodyConfig,
  RigidBodyType,
  ColliderConfig,
  ColliderType,
  BoxColliderConfig,
  CircleColliderConfig,
  PolygonColliderConfig,
  EdgeColliderConfig,
  ChainColliderConfig,
  PhysicsMaterial,
  CollisionFilter,
  ContactPoint,
  CollisionEventData,
  RaycastInput,
  RaycastResult,
  JointType,
  BaseJointConfig
} from './types/PhysicsTypes';

// Components
export {
  RigidBodyComponent,
  ColliderComponent,
  JointComponent,
  PhysicsTransformComponent,
  CollisionEventComponent
} from './components/PhysicsComponents';

// Systems
export {
  PhysicsWorldSystem,
  PhysicsBodySystem,
  PhysicsColliderSystem,
  PhysicsJointSystem
} from './systems/PhysicsSystems';

// Plugins
export {
  BasePhysicsPlugin,
  PhysicsPluginConfig
} from './plugins/BasePhysicsPlugin';

// Re-export commonly used types from dependencies
export type { Component, System, Entity, World, BasePlugin } from '@esengine/nova-ecs';
export type { Fixed, FixedVector2, FixedMatrix2x2 } from '@esengine/nova-ecs-math';
