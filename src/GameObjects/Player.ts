import { GameEngine } from "../Core/GameEngine";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";

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
    this.needsRedraw = false;
  }

  /**
   * Updates the player's state based on input and game logic.
   * @param engine The game engine instance.
   * @param deltaTime The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {}
}
