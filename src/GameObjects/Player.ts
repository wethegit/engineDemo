import { GameEngine } from "../Core/GameEngine";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";

export interface IPlayer extends IGameObject {
  speed: number;
  directionX: number;
  cannonAngle: number;
}

export type PlayerProps = GameObjectProps & {
  speed: number;
};

export class Player extends GameObject implements IPlayer {
  speed: number;
  directionX: number;
  cannonAngle: number;

  constructor({ id, position, dimensions, dpr = 2, speed }: PlayerProps) {
    super({ id, position, dimensions, dpr });
    this.speed = speed;
    this.directionX = 1;
    this.cannonAngle = 0;
  }

  drawObject() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    const bodyWidth = this.dims.x * 0.6;
    const cannonLength = this.dims.x * 0.25;

    const bodyX = cannonLength;

    // body props
    const bodyHeight = this.dims.y * 0.2;
    const bodyY = this.dims.y - bodyHeight;
    // hull props
    const hullHeight = this.dims.y * 0.2;
    const hullY = bodyY - hullHeight;
    // turret props
    const turretWidth = bodyWidth * 0.4;
    const turretHeight = this.dims.y * 0.2;
    const turretX = bodyX + (bodyWidth - turretWidth) / 2;
    const turretY = hullY - turretHeight;
    // cannon props
    const cannonHeight = this.dims.y * 0.1;

    // Treads
    this.ctx.fillStyle = "#6B4423";
    this.ctx.rect(bodyX, bodyY, bodyWidth, bodyHeight);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(bodyX, bodyY + bodyHeight / 2, bodyHeight / 2, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(
      bodyX + bodyWidth,
      bodyY + bodyHeight / 2,
      bodyHeight / 2,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.stroke();

    // Body
    this.ctx.fillStyle = "darkolivegreen";
    this.ctx.beginPath();
    this.ctx.moveTo(bodyX + bodyWidth / 2 + turretWidth / 2, hullY);
    this.ctx.lineTo(bodyX + bodyWidth, hullY + hullHeight);
    this.ctx.lineTo(bodyX, hullY + hullHeight);
    this.ctx.lineTo(bodyX + bodyWidth / 2 - turretWidth / 2, hullY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Cannon
    this.ctx.save();
    const turretCenterX = turretX + turretWidth / 2;
    const turretCenterY = turretY + turretHeight / 2;
    this.ctx.translate(turretCenterX, turretCenterY);
    const baseAngle = 0;
    this.ctx.rotate(baseAngle + this.cannonAngle);
    this.ctx.fillStyle = "dimgray";
    // draw cannon relative to turret center
    this.ctx.fillRect(0, -cannonHeight / 2, cannonLength, cannonHeight);
    this.ctx.strokeRect(0, -cannonHeight / 2, cannonLength, cannonHeight);
    this.ctx.restore();

    // Turret
    this.ctx.fillStyle = "olivedrab";
    this.ctx.fillRect(turretX, turretY, turretWidth, turretHeight);
    this.ctx.strokeRect(turretX, turretY, turretWidth, turretHeight);

    this.needsRedraw = false;
  }

  update(engine: GameEngine, deltaTime: number) {
    if (engine.inputManager.isKeyDown("ArrowLeft")) {
      this.position.x += this.speed * -1 * deltaTime;
      this.needsRedraw = true;
    }
    if (engine.inputManager.isKeyDown("ArrowRight")) {
      this.position.x += this.speed * deltaTime;
      this.needsRedraw = true;
    }

    const right = this.position.x + this.dims.x > engine.dims.x;
    if (right) {
      this.position.x = engine.dims.x - this.dims.x;
    } else if (this.position.x < 0) {
      this.position.x = 0;
    }

    if (engine.inputManager.isKeyDown("ArrowUp")) {
      this.cannonAngle -= 0.05;
      this.needsRedraw = true;
    }
    if (engine.inputManager.isKeyDown("ArrowDown")) {
      this.cannonAngle += 0.05;
      this.needsRedraw = true;
    }

    // Clamp angle
    const maxAngle = 0.5;
    this.cannonAngle = Math.max(
      -Math.PI - maxAngle,
      Math.min(maxAngle, this.cannonAngle)
    );
  }
}
