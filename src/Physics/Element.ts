import { Vec2 } from "wtc-math";

/**
 * Interface representing a physics element.
 */
export interface IElement {
  /** The current position of the element. */
  position: Vec2;
  /** The position of the element in the previous frame. */
  oldPosition: Vec2;
  /** The acceleration of the element. */
  acceleration: Vec2;
  /**
   * Applies a force to the element.
   * @param force The force to apply.
   */
  applyForce(force: Vec2): void;
  /**
   * Integrates the element's position based on Verlet integration.
   * @param props An object containing the time step (delta).
   */
  integrate(props: { delta: number }): void;
}

/**
 * Properties for creating an Element.
 */
export type ElementProps = {
  /**
   * The initial position of the element.
   * @default new Vec2(0, 0)
   */
  position?: Vec2;
  /**
   * The position of the element in the previous frame.
   * Used to calculate initial velocity for Verlet integration.
   * If not provided, it defaults to the current `position`, implying no initial velocity.
   */
  oldPosition?: Vec2;
  /**
   * The initial acceleration of the element.
   * @default new Vec2(0, 0)
   */
  acceleration?: Vec2;
};

/**
 * Represents a basic physics element that uses Verlet integration for motion.
 */
export class Element implements IElement {
  position: Vec2;
  oldPosition: Vec2;
  acceleration: Vec2;

  constructor({
    position = new Vec2(0, 0),
    oldPosition,
    acceleration = new Vec2(0, 0),
  }: ElementProps = {}) {
    this.position = position;
    this.oldPosition = oldPosition || position.clone();
    this.acceleration = acceleration;
  }

  /**
   * Applies a force to the element by adding to its acceleration.
   * @param force The force vector to apply.
   */
  applyForce(force: Vec2): void {
    this.acceleration.add(force);
  }

  /**
   * Updates the element's position using the Verlet integration algorithm.
   * @param props An object containing the time step.
   * @param props.delta The time elapsed since the last integration, in seconds.
   */
  integrate({ delta }: { delta: number }): {
    acceleration: Vec2;
    position: Vec2;
    oldPosition: Vec2;
  } {
    const tp = this.position.clone();

    // v = p - p_old
    const velocity = this.position.subtractNew(this.oldPosition);

    // p = p + v + a * dt^2
    this.position.add(velocity).add(this.acceleration.scale(delta * delta));

    this.oldPosition.resetToVector(tp);
    this.acceleration.reset(0, 0);

    return {
      acceleration: this.position.subtractNew(this.oldPosition),
      position: this.position.clone(),
      oldPosition: this.oldPosition.clone(),
    };
  }
}
