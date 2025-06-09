import { Vec2 } from "wtc-math";

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
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(400, 300, 20, 20);
    // this.ctx.fillRect( 0, this.dims.y/4, this.dims.x, this.dims.y/8);
    this.needsRedraw = false;
  }
}
