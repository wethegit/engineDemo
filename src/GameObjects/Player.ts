import { GameEngine } from "../Core/GameEngine";
import { Vec2 } from "wtc-math";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";
import { Bullet } from "./Bullet";

/**
 * Interface representing the Player game object.
 */
export interface IPlayer extends IGameObject {
  /** The movement speed of the player. */
  speed: number;
  /** The horizontal direction of the player. */
  directionX: number;
  /** The angle of the player's cannon. */
  cannonAngle: number;
}

/**
 * Props for the Player game object.
 */
export type PlayerProps = GameObjectProps & {
  /** The movement speed of the player. */
  speed: number;
};

/**
 * Represents the player-controlled tank in the game.
 */
export class Player extends GameObject implements IPlayer {
  /** The movement speed of the player. */
  speed: number;
  /** The horizontal direction of the player. */
  directionX: number;
  /** The angle of the player's cannon in radians. */
  cannonAngle: number;
  timer?: number;

  /**
   * Creates a new Player object.
   * @param id The unique identifier for the game object.
   * @param position The initial position of the player.
   * @param dimensions The dimensions of the player.
   * @param dpr The device pixel ratio.
   * @param speed The movement speed of the player.
   */
  constructor({ id, position, dimensions, dpr = 2, speed }: PlayerProps) {
    super({ id, position, dimensions, dpr });
    this.speed = speed;
    this.directionX = 1;
    this.cannonAngle = 0;
  }

  /**
   * Draws the player's tank on the canvas.
   */
  drawObject() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(0, 0, this.dims.x, this.dims.y);
    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.dims.x / 2,
    //   this.dims.y / 2,
    //   this.dims.x / 2,
    //   0,
    //   Math.PI * 2
    // );
    // this.ctx.fill();
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(this.dims.x / 2, this.dims.y / 2, 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(this.dims.x / 2, this.dims.y / 2);
    this.ctx.lineTo(
      this.dims.x / 2 + Math.cos(this.cannonAngle) * 20,
      this.dims.y / 2 + Math.sin(this.cannonAngle) * 20
    );
    this.ctx.stroke();

    this.needsRedraw = false;
  }

  /**
   * Updates the player's state based on input and game logic.
   * @param engine The game engine instance.
   * @param deltaTime The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {
    if (engine.inputManager.isKeyDown("a")) {
      this.position.x -= this.speed * deltaTime;
    } else if (engine.inputManager.isKeyDown("d")) {
      this.position.x += this.speed * deltaTime;
    }

    if (this.position.x > engine.dims.x + this.dims.x) {
      this.position.x = -this.dims.x;
    } else if (this.position.x < -this.dims.x) {
      this.position.x = engine.dims.x + this.dims.x;
    }

    this.needsRedraw = true;
    const difference = engine.inputManager.mousePosition.subtractNew(
      this.position
    );
    this.cannonAngle = difference.angle;
    const power = difference.length * 0.003;

    if (engine.inputManager.isMouseButtonDown(0)) {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        // kick back
        this.position.x -= difference.x * 0.01;
        // uncomment this to fly
        // this.position.y -= difference.y * 0.01;

        engine.addObject(
          new Bullet({
            id: "lil-bullet" + Date.now(),
            position: this.position.clone(),
            dpr: this.dpr,
            acceleration: new Vec2(
              Math.cos(this.cannonAngle) * power,
              Math.sin(this.cannonAngle) * power
            ),
          })
        );
      }, 30);
    }
  }
}
