import { Vec2 } from "wtc-math";

import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";

export interface IBackground extends IGameObject {}

export type BackgroundProps = Omit<GameObjectProps, "position">;

export class Background extends GameObject implements IBackground {
  constructor({ id, dimensions, dpr = 2 }: BackgroundProps) {
    super({ id, position: new Vec2(0, 0), dimensions, dpr });
  }

  drawObject() {
    console.log("drawing bg");
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    const tileSize = 20;
    for (let y = 0; y < this.dims.y; y += tileSize) {
      for (let x = 0; x < this.dims.x; x += tileSize) {
        this.ctx.fillStyle =
          (x / tileSize) % 2 === (y / tileSize) % 2 ? "#AADDEE" : "#BBDDFF";
        this.ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
    this.needsRedraw = false;
  }
}
