import { Vec2 } from "wtc-math";

import { params } from "../config";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";

export interface IGround extends IGameObject {}

export type GroundProps = Omit<GameObjectProps, "position">;

export class Ground extends GameObject implements IGround {
  constructor({ id, dimensions, dpr = 2 }: GroundProps) {
    super({ id, position: new Vec2(0, 0), dimensions, dpr });
  }

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
