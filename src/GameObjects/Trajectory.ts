import { Vec2 } from "wtc-math";
import type { GameEngine } from "../Core/GameEngine";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
  AnchorPoint,
} from "../Core/GameObject";

import { Element, type IElement } from "../Physics/Element";
import { params } from "../config";
import { Player } from "./Player";
import { rayBoundaryIntersection } from "../Helpers/Intersections";

/**
 * Interface representing a Bullet game object.
 */
export interface ITrajectory extends IGameObject {
  /** The physics element that controls the trajectory's movement. */
  physics: IElement;
  /** The player object that is firing the trajectory. */
  playerObject: Player;
  /** The points of the trajectory. */
  points: (Vec2 | null)[];
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
  points: (Vec2 | null)[] = [];

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
      anchorPoint: AnchorPoint.TOP_LEFT,
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
    let isFirstPoint = true;

    for (const point of this.points) {
      if (point === null) {
        // End the current path and start a new one
        this.ctx.stroke();
        this.ctx.beginPath();
        isFirstPoint = true;
        continue;
      }

      if (isFirstPoint) {
        this.ctx.moveTo(point.x, point.y);
        isFirstPoint = false;
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
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
    for (let i = 0; i < 200; i++) {
      if (i % 3 == 0) this.points.push(this.physics.position.clone());

      this.physics.applyForce(new Vec2(0, params.gravity * 50000 * timeStep));
      this.physics.applyForce(params.wind.scaleNew(50000 * timeStep));
      const { acceleration } = this.physics.integrate({
        delta: timeStep,
      });

      // Handle vertical wrapping
      if (this.physics.position.y > engine.dims.y - params["ground height"]) {
        this.points.push(this.physics.position.clone());
        break;
      }

      // Handle horizontal wrapping
      if (this.physics.position.x < 0) {
        // Add the point at the left edge
        const { intersects, point } = rayBoundaryIntersection(
          this.physics.oldPosition,
          this.physics.ray,
          0,
          "vertical"
        );
        this.points.push(point);

        // Add a break point (null) to indicate a gap in the line
        this.points.push(null);
        // Wrap to the right side
        this.physics.position.x = engine.dims.x;
        this.physics.oldPosition =
          this.physics.position.subtractNew(acceleration);
        this.points.push(this.physics.position.clone());
      } else if (this.physics.position.x > engine.dims.x) {
        // Add the point at the right edge
        // Find intersection with right edge by creating a ray from old position to current
        // First attempt - results in some odd artifacts sometimes.
        // -  this.points.push(new Vec2(engine.dims.x, this.physics.position.y));
        // Second attempt - Good, but could be encapsulated better.
        // -  const ray = this.physics.position.subtractNew(this.physics.oldPosition);
        // -  const t = (engine.dims.x - this.physics.oldPosition.x) / ray.x;
        // -  const intersectY = this.physics.oldPosition.y + ray.y * t;
        // -  this.points.push(new Vec2(engine.dims.x, intersectY));
        // Third attempt - juct compartmentalizing the above into a function
        const { intersects, point } = rayBoundaryIntersection(
          this.physics.oldPosition,
          this.physics.ray,
          engine.dims.x,
          "vertical"
        );
        this.points.push(point);

        // Add a break point (null) to indicate a gap in the line
        this.points.push(null);
        // Wrap to the left side
        this.physics.position.x = 0;
        this.physics.oldPosition.resetToVector(
          this.physics.position.subtractNew(acceleration)
        );
        this.points.push(this.physics.position.clone());
      }
    }

    this.needsUpdate = false;
    this.needsRedraw = true;
  }
}
