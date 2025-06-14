import { Vec2 } from "wtc-math";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";
import { Element, type IElement } from "../Physics/Element";
import { params } from "../config";
import type { GameEngine } from "../Core/GameEngine";

/**
 * Interface representing a Bullet game object.
 */
export interface IBullet extends IGameObject {
  /** The physics element that controls the bullet's movement. */
  physics: IElement;
  /** The radius of the bullet. */
  radius: number;
}

/**
 * Properties for creating a Bullet.
 */
export type BulletProps = Omit<GameObjectProps, "dimensions"> & {
  /** The initial velocity of the bullet. */
  velocity: Vec2;
  /** The radius of the bullet. */
  radius?: number;
};

/**
 * Represents a bullet fired by the player.
 */
export class Bullet extends GameObject implements IBullet {
  physics: IElement;
  radius: number;

  /**
   * Creates a new Bullet object.
   * @param props The properties for the bullet.
   */
  constructor({ id, position, dpr, velocity, radius = 5 }: BulletProps) {
    super({
      id,
      position: position.subtractScalarNew(radius),
      dimensions: new Vec2(radius * 2, radius * 2),
      dpr,
    });

    this.radius = radius;
    this.physics = new Element({
      position: this.position,
      oldPosition: this.position.subtractNew(velocity),
    });
    this.needsRedraw = true;
  }

  /**
   * Draws the bullet on the canvas.
   */
  drawObject() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "black";
    this.ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.needsRedraw = false;
  }

  /**
   * Updates the bullet's state.
   * @param engine The game engine instance.
   * @param deltaTime The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {
    // Apply gravity
    this.physics.applyForce(new Vec2(0, params.gravity * 50000 * deltaTime));
    this.physics.applyForce(params.wind.scaleNew(50000 * deltaTime));
    // Integrate physics
    this.physics.integrate({ delta: deltaTime });

    const groundHeight = params["ground height"];
    const bottom = this.position.y + this.radius;

    // Check for collision with ground
    if (bottom > engine.dims.y - groundHeight) {
      this.isDestroyed = true;
    }

    // Check if off-screen
    if (this.position.x < 0 || this.position.x > engine.dims.x) {
      this.isDestroyed = true;
    }
  }
}
