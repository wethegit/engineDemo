import { Vec2 } from "wtc-math";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";
import { Element, type IElement } from "../Physics/Element";
import { params } from "../config";
import type { GameEngine } from "../Core/GameEngine";
import { Player } from "./Player";

/**
 * Interface representing a Bullet game object.
 */
export interface ITrajectory extends IGameObject {
  /** The physics element that controls the trajectory's movement. */
  physics: IElement;
  /** The player object that is firing the trajectory. */
  playerObject: Player;
  /** The points of the trajectory. */
  points: Vec2[];
  /** Whether the trajectory needs to be updated. */
  needsUpdate: boolean;
}

/**
 * Properties for creating a Bullet.
 */
export type TrajectoryProps = GameObjectProps & {
  /** The player object that is firing the trajectory. */
  playerObject: Player;
};

/**
 * Represents a bullet fired by the player.
 */
export class Trajectory extends GameObject implements ITrajectory {
  physics: IElement;
  playerObject: Player;
  needsUpdate: boolean = true;
  points: Vec2[] = [];

  /**
   * Creates a new Bullet object.
   * @param props The properties for the bullet.
   */
  constructor({
    id,
    position,
    dimensions,
    dpr,
    playerObject,
  }: TrajectoryProps) {
    super({
      id,
      position,
      dimensions,
      dpr,
    });
    this.playerObject = playerObject;
    playerObject.addListener(this);
    this.physics = new Element({
      position: this.position,
      oldPosition: this.position,
    });
    this.needsRedraw = false;
  }

  /**
   * Draws the bullet on the canvas.
   */
  drawObject() {
    if (!this.points?.length) return;

    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
    this.needsRedraw = false;
  }

  trigger(player: Player, startPos: Vec2, velocity: Vec2) {
    // console.log("trigger", startPos, velocity);
    this.physics = new Element({
      position: startPos,
      oldPosition: startPos.subtractNew(velocity),
    });
    this.needsUpdate = true;
  }

  /**
   * Updates the trajectory's state.
   * @param engine The game engine instance.
   * @param deltaTime The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {
    if (!this.needsUpdate) return;

    this.points.length = 0;

    const timeStep = 1 / 60;
    for (let i = 0; i < 100; i++) {
      if (i % 3 == 0) this.points.push(this.physics.position.clone());

      this.physics.applyForce(new Vec2(0, params.gravity * 50000 * timeStep));
      this.physics.applyForce(params.wind.scaleNew(50000 * timeStep));
      this.physics.integrate({ delta: timeStep });

      if (this.physics.position.y > engine.dims.y - params["ground height"])
        break;
      if (
        this.physics.position.x < 0 ||
        this.physics.position.x > engine.dims.x
      )
        break;
    }

    this.needsUpdate = false;
    this.needsRedraw = true;
  }
}
