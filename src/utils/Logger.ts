/**
 * Simple logger utility for physics systems
 * 物理系统的简单日志工具
 */
export class PhysicsLogger {
  private static prefix = '[NovaECS-Physics]';

  static log(message: string): void {
    // eslint-disable-next-line no-console
    console.log(`${this.prefix} ${message}`);
  }

  static warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn(`${this.prefix} ${message}`);
  }

  static error(message: string): void {
    // eslint-disable-next-line no-console
    console.error(`${this.prefix} ${message}`);
  }
}