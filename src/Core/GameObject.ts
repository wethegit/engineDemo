import type { Vec2 } from "wtc-math";

import type { GameEngine } from "./GameEngine";

export interface IGameObject {
  id: string;
  position: Vec2;
  dims: Vec2;
  dpr: number;
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  needsRedraw: boolean;
  renderable: boolean;

  render(engine: GameEngine): void;
  drawObject(): void;
  draw(): void;
  update(engine: GameEngine, deltaTime: number): void;
}

export type GameObjectProps = {
  id: string;
  position: Vec2;
  dimensions: Vec2;
  dpr?: number;
};

export class GameObject implements IGameObject {
  id: string;
  position: Vec2;
  dims: Vec2;
  dpr: number;
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor({ id, position, dimensions, dpr = 2 }: GameObjectProps) {
    this.id = id;
    this.position = position;
    this.dims = dimensions;
    this.dpr = dpr;
    this.c = document.createElement("canvas");
    const ctx = this.c.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.c.width = this.dims.x * dpr;
    this.c.height = this.dims.y * dpr;

    this.ctx.scale(dpr, dpr);

    this.draw();
  }

  render(engine: GameEngine) {
    if (this.renderable) {
      const pos = this.position.scaleNew(engine.dpr);
      engine.ctx.drawImage(this.c, pos.x, pos.y);
    }
  }

  drawObject() {
    console.warn(
      `GameObject ${this.id} should implements the drawObject function. This is a fallback.`
    );
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(0, 0, this.dims.x, this.dims.y);
    this.needsRedraw = false;
  }

  draw() {
    if (this.needsRedraw) this.drawObject();
  }

  update(engine: GameEngine, deltaTime: number) {
    // Do nothing, this should be overridden;
  }

  // Whether the element is renderable. This should actively cull, right now it's just a placeholder.
  get renderable() {
    return true;
  }

  #needsRedraw = true;
  set needsRedraw(needsRedraw) {
    this.#needsRedraw = needsRedraw === true;
  }
  get needsRedraw() {
    return this.#needsRedraw;
  }
}
