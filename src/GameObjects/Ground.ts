import { Vec2 } from "wtc-math";

import { params } from "../config";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
  AnchorPoint,
} from "../Core/GameObject";

/**
 * Interface for the Ground game object.
 */
export interface IGround extends IGameObject {}

/**
 * Props for the Ground game object.
 */
export type GroundProps = Omit<GameObjectProps, "position">;

/**
 * Renders the ground for the game.
 */
export class Ground extends GameObject implements IGround {
  /**
   * Creates a new Ground object.
   * @param id The unique identifier for the game object.
   * @param dimensions The dimensions of the ground.
   * @param dpr The device pixel ratio.
   */
  constructor({ id, dimensions, dpr = 2 }: GroundProps) {
    super({
      id,
      position: new Vec2(0, 0),
      dimensions,
      dpr,
      anchorPoint: AnchorPoint.TOP_LEFT,
    });
  }

  /**
   * Draws the ground on the canvas.
   */
  drawObject() {
    console.log("drawing ground");
    const groundHeight = params["ground height"];
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      0,
      this.dims.y - groundHeight,
      this.dims.x,
      this.dims.y - groundHeight
    );
    this.needsRedraw = false;
  }
}
