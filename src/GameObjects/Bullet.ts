// import { type Vec2 } from "wtc-math";
import { Vec2 } from "wtc-math";

import { params } from "../config";

import { GameEngine } from "../Core/GameEngine";
import { GameObject } from "../Core/GameObject";
import type { GameObjectProps, IGameObject } from "../Core/GameObject";
import { InputManager } from "../Core/InputManager";

export type BulletProps = Omit<
  GameObjectProps,
  "dimensions" | "rotation" | "timeout"
> & {
  /** The amount of time a bullet is active before it's removed **/
  timeout?: number;
  rotation?: number;
  dimensions?: Vec2;
  velocity?: Vec2;
  acceleration: Vec2;
};

export class Bullet extends GameObject implements IGameObject {
  velocity: Vec2;
  acceleration: Vec2;

  constructor({
    id,
    position,
    dimensions = new Vec2(10, 10),
    dpr = 2,
    timeout = 10000,
    velocity,
    rotation = 0,
    acceleration,
  }: BulletProps) {
    super({ id, position, dimensions, dpr, rotation });
    this.rotation = rotation;
    this.velocity = velocity || new Vec2(0, 0);
    this.acceleration = acceleration;
  }

  drawObject() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.arc(
      this.dims.x / 2,
      this.dims.y / 2,
      this.dims.x / 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.needsRedraw = false;
  }

  update(engine: GameEngine, deltaTime: number) {
    this.velocity.add(this.acceleration);
    this.acceleration.scale(params.friction);
    this.velocity.scale(params.friction);
    this.acceleration.y += params.gravity * deltaTime;
    this.position.add(this.velocity);
  }
}
