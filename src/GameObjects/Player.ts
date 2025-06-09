import { GameEngine } from "../Core/GameEngine";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";

export interface IPlayer extends IGameObject {
  speed: number;
  directionX: number;
}

export type PlayerProps = GameObjectProps & {
  speed: number;
};

export class Player extends GameObject implements IPlayer {
  speed: number;
  directionX: number;

  constructor({ id, position, dimensions, dpr = 2, speed }: PlayerProps) {
    super({ id, position, dimensions, dpr });
    this.speed = speed;
    this.directionX = 1;
  }

  drawObject() {
    console.log("drawing player");
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.rect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "red";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.stroke();
    this.needsRedraw = false;
  }

  update(engine: GameEngine, deltaTime: number) {
    this.position.x += this.speed * this.directionX * deltaTime;
    const right = this.position.x + this.dims.x > engine.dims.x;
    if (right) {
      this.directionX *= -1;
      this.position.x = engine.dims.x - this.dims.x;
    } else if (this.position.x < 0) {
      this.directionX *= -1;
      this.position.x = 0;
    }
  }
}
