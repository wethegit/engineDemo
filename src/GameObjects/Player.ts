import { Vec2 } from "wtc-math";
import { GameEngine } from "../Core/GameEngine";
import {
  GameObject,
  type GameObjectProps,
  type IGameObject,
} from "../Core/GameObject";
import { Bullet } from "./Bullet";
import { Trajectory } from "./Trajectory";

/**
 * Geometric properties of the tank, derived from its main dimensions.
 * @internal
 */
interface TankProperties {
  bodyWidth: number;
  cannonLength: number;
  cannonHeight: number;
  bodyX: number;
  bodyHeight: number;
  bodyY: number;
  hullHeight: number;
  hullY: number;
  turretWidth: number;
  turretHeight: number;
  turretX: number;
  turretY: number;
  turretCenterX: number;
  turretCenterY: number;
}

/**
 * Interface representing the Player game object.
 */
export interface IPlayer extends IGameObject {
  /** The movement speed of the player. */
  speed: number;
  /** The horizontal direction of the player. */
  directionX: number;
  /** The angle of the player's cannon. */
  cannonAngle: number;
  /** The power of the cannon shot. */
  cannonPower: number;
  /** The cooldown duration for firing in seconds. */
  fireCooldown: number;
  /** The timestamp of the last shot fired. */
  lastFired: number;
  /** The scale of the tank to the sprite. */
  scaleToSprite: number;
  /** A flag indicating that the tank properties need to be recalculated. */
  needsRecalc: boolean;
  /** The listeners of the player. */
  listeners: Trajectory[];
}

/**
 * Props for the Player game object.
 */
export type PlayerProps = GameObjectProps & {
  /** The movement speed of the player. */
  speed: number;
};

/**
 * Represents the player-controlled tank in the game.
 * @implements {IPlayer}
 */
export class Player extends GameObject implements IPlayer {
  /** @inheritdoc */
  speed: number;
  /** @inheritdoc */
  directionX: number;
  /** @inheritdoc */
  cannonAngle: number;
  /** @inheritdoc */
  cannonPower: number;
  /** @inheritdoc */
  fireCooldown: number;
  /** @inheritdoc */
  lastFired: number;
  /** @inheritdoc */
  scaleToSprite: number = 0.8;
  /** @inheritdoc */
  needsRecalc: boolean = false;
  /** @inheritdoc */
  listeners: Trajectory[] = [];
  /**
   * Pre-calculated geometric properties of the tank.
   * @private
   */
  _tankProperties: TankProperties;

  /**
   * Creates a new Player object.
   * @param id The unique identifier for the game object.
   * @param position The initial position of the player.
   * @param dimensions The dimensions of the player.
   * @param dpr The device pixel ratio.
   * @param speed The movement speed of the player.
   */
  constructor({ id, position, dimensions, dpr = 2, speed }: PlayerProps) {
    super({ id, position, dimensions, dpr });
    this.speed = speed;
    this.directionX = 1;
    this.cannonAngle = 0;
    this.cannonPower = 5;
    this.fireCooldown = 0.5; // seconds
    this.lastFired = -Infinity;
    this._tankProperties = this._calculateTankProperties();
    this.drawObject(); // Adding this here because this needs a redraw after super
  }

  /**
   * Calculates the detailed geometric properties of the tank based on its dimensions.
   * @private
   */
  private _calculateTankProperties(): TankProperties {
    const scale = this.scaleToSprite || 0.8;
    const bodyWidth = this.dims.x * 0.6 * scale;
    const cannonLength = this.dims.x * (this.cannonPower / 40) * scale;
    const cannonHeight = this.dims.y * 0.1 * scale;
    const bodyHeight = this.dims.y * 0.2 * scale;
    const hullHeight = this.dims.y * 0.2 * scale;
    const turretWidth = bodyWidth * 0.3;
    const turretHeight = this.dims.y * 0.15 * scale;

    // Y coordinates are negative, moving up from the bottom (y=0)
    const bodyY = -bodyHeight;
    const hullY = bodyY - hullHeight;
    const turretY = hullY - turretHeight;
    const turretCenterY = turretY + turretHeight / 2;

    // X coordinates are relative to the center (x=0)
    const bodyX = -bodyWidth / 2;
    const turretX = -turretWidth / 2;
    const turretCenterX = 0;

    return {
      bodyWidth,
      cannonLength,
      cannonHeight,
      bodyX,
      bodyHeight,
      bodyY,
      hullHeight,
      hullY,
      turretWidth,
      turretHeight,
      turretX,
      turretY,
      turretCenterX,
      turretCenterY,
    };
  }

  private _getBulletInitialState(): { startPos: Vec2; velocity: Vec2 } {
    const { cannonLength, turretCenterY } = this.tankProperties;

    const worldTurretCenterX = this.position.x + this.dims.x / 2;
    const worldTurretCenterY = this.position.y + this.dims.y + turretCenterY;

    const angle = this.cannonAngle;
    const startPos = new Vec2(
      worldTurretCenterX + cannonLength * Math.cos(angle),
      worldTurretCenterY + cannonLength * Math.sin(angle)
    );

    const velocity = new Vec2(
      this.cannonPower * Math.cos(angle),
      this.cannonPower * Math.sin(angle)
    );

    return { startPos, velocity };
  }

  /**
   * Draws the player's tank on the canvas.
   */
  drawObject() {
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);

    this.ctx.save();
    this.ctx.translate(this.dims.x / 2, this.dims.y);

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    const {
      bodyWidth,
      cannonLength,
      cannonHeight,
      bodyX,
      bodyHeight,
      bodyY,
      hullHeight,
      hullY,
      turretWidth,
      turretHeight,
      turretX,
      turretY,
      turretCenterY,
    } = this.tankProperties;

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
    this.ctx.moveTo(turretX + turretWidth, hullY);
    this.ctx.lineTo(bodyX + bodyWidth, hullY + hullHeight);
    this.ctx.lineTo(bodyX, hullY + hullHeight);
    this.ctx.lineTo(turretX, hullY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Cannon
    this.ctx.save();
    this.ctx.translate(0, turretCenterY);
    const baseAngle = 0;
    this.ctx.rotate(baseAngle + this.cannonAngle);
    this.ctx.translate(turretWidth / 4, 0);
    this.ctx.fillStyle = "dimgray";
    // draw cannon relative to turret center
    this.ctx.fillRect(0, -cannonHeight / 2, cannonLength, cannonHeight);
    this.ctx.strokeRect(0, -cannonHeight / 2, cannonLength, cannonHeight);
    this.ctx.restore();

    // Turret
    this.ctx.fillStyle = "olivedrab";
    this.ctx.fillRect(turretX, turretY, turretWidth, turretHeight);
    this.ctx.strokeRect(turretX, turretY, turretWidth, turretHeight);

    this.ctx.restore();

    this.needsRedraw = false;
  }

  /**
   * Updates the player's state based on input and game logic.
   * @param engine The game engine instance.
   * @param deltaTime The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {
    let emit = false;
    // Movement
    if (engine.inputManager.isKeyDown("a")) {
      this.position.x += this.speed * -1 * deltaTime;
      this.needsRedraw = true;
      emit = true;
    }
    if (engine.inputManager.isKeyDown("d")) {
      this.position.x += this.speed * deltaTime;
      this.needsRedraw = true;
      emit = true;
    }
    // Clamp position to screen bounds
    const right = this.position.x + this.dims.x > engine.dims.x;
    if (right) {
      this.position.x = engine.dims.x - this.dims.x;
    } else if (this.position.x < 0) {
      this.position.x = 0;
    }

    // Cannon angle
    if (engine.inputManager.isKeyDown("ArrowLeft")) {
      this.cannonAngle -= 0.05;
      this.needsRedraw = true;
      emit = true;
    }
    if (engine.inputManager.isKeyDown("ArrowRight")) {
      this.cannonAngle += 0.05;
      this.needsRedraw = true;
      emit = true;
    }
    // Clamp angle
    const maxAngle = 0.5;
    this.cannonAngle = Math.max(
      -Math.PI - maxAngle,
      Math.min(maxAngle, this.cannonAngle)
    );

    // Cannon strength
    if (engine.inputManager.isKeyDown("ArrowDown")) {
      this.power -= 0.1;
      emit = true;
    }
    if (engine.inputManager.isKeyDown("ArrowUp")) {
      this.power += 0.1;
      emit = true;
    }

    // Firing
    const now = performance.now() / 1000;
    if (
      engine.inputManager.isKeyDown(" ") &&
      now - this.lastFired > this.fireCooldown
    ) {
      this.lastFired = now;

      const { startPos, velocity } = this._getBulletInitialState();

      const bullet = new Bullet({
        id: `bullet-${performance.now()}`,
        position: startPos,
        velocity: velocity,
        dpr: this.dpr,
      });
      engine.addGameObject(bullet);
    }

    if (emit) {
      const { startPos, velocity } = this._getBulletInitialState();
      this.listeners.forEach((listener) => {
        listener.trigger(this, startPos, velocity);
      });
    }
  }

  addListener(listener: Trajectory) {
    this.listeners.push(listener);
  }

  set power(value: number) {
    this.cannonPower = Math.max(2, Math.min(20, value));
    this.needsRedraw = true;
    this.needsRecalc = true;
  }
  get power() {
    return this.cannonPower;
  }

  get tankProperties() {
    if (!this._tankProperties || this.needsRecalc) {
      this._tankProperties = this._calculateTankProperties();
      this.needsRecalc = false;
    }
    return this._tankProperties;
  }
}
