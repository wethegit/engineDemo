import { Vec2 } from "wtc-math";

import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

export type GameEngineArguments = {
  canvas: HTMLCanvasElement;
  dimensions?: Vec2;
  dpr?: number;
};

export interface IGameEngine {
  canvas: HTMLCanvasElement;
  dims: Vec2;
  dpr: number;
  ctx: CanvasRenderingContext2D;
  gameObjects: GameObject[];
  lastTime: number;
  deltaTime: number;
  animationFrameId: number | null;
  inputManager: InputManager;
}

export class GameEngine implements IGameEngine {
  canvas: HTMLCanvasElement;
  dims!: Vec2;
  dpr!: number;
  ctx: CanvasRenderingContext2D;
  gameObjects!: GameObject[];
  lastTime: number = 0;
  deltaTime: number = 0;
  animationFrameId: number | null = null;
  inputManager: InputManager;

  constructor({
    canvas,
    dimensions = new Vec2(1000, 1000),
    dpr = 2,
  }: GameEngineArguments) {
    if (!canvas) throw new Error("Canvas not defined.");
    this.canvas = canvas;
    this.dims = dimensions;
    this.dpr = dpr;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) throw new Error("Context not able to be created.");
    this.ctx = ctx;
    canvas.width = this.dims.x * dpr;
    canvas.height = this.dims.y * dpr;
    // this.ctx.scale(dpr, dpr);

    this.gameObjects = [];
    this.inputManager = new InputManager();
  }

  addObject(obj: GameObject) {
    if (obj instanceof GameObject) {
      this.gameObjects.push(obj);
    }
  }

  removeObject(obj: GameObject) {
    this.gameObjects = this.gameObjects.filter((o) => o !== obj);
  }

  update(deltaTime: number) {
    this.gameObjects.forEach((obj) => obj.update(this, deltaTime));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);

    this.gameObjects.forEach((obj) => {
      obj.render(this);
    });
  }

  // Using an arrow function to preserve the context
  gameLoop = (d: number) => {
    if (!this.playing) return;

    this.deltaTime = (d - this.lastTime) / 1000;
    this.lastTime = d;

    this.update(this.deltaTime);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  #playing = false;
  set playing(p) {
    if (!this.animationFrameId && p === true) {
      console.log("Game loop started");
      this.#playing = true;
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    } else if (this.animationFrameId && p === false) {
      console.log("Game loop stopped");
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.#playing = false;
    }
  }
  get playing() {
    return this.#playing;
  }
}
