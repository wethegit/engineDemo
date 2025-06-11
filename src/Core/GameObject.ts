import type { Vec2 } from "wtc-math";

import type { GameEngine } from "./GameEngine";

/**
 * Interface representing the basic properties of a game object.
 */
export interface IGameObject {
  /** A unique identifier for the game object. */
  id: string;
  /** The position of the game object in the game world. */
  position: Vec2;
  /** The dimensions of the game object. */
  dims: Vec2;
  /** The device pixel ratio, used for high-resolution rendering. */
  dpr: number;
  /** The offscreen canvas element for the game object. */
  c: HTMLCanvasElement;
  /** The 2D rendering context for the offscreen canvas. */
  ctx: CanvasRenderingContext2D;
  /** A flag indicating whether the game object needs to be redrawn. */
  needsRedraw: boolean;
  /** A flag indicating whether the game object is currently renderable. */
  renderable: boolean;
}

/**
 * Type definition for the properties required to create a GameObject.
 */
export type GameObjectProps = {
  /** A unique identifier for the game object. */
  id: string;
  /** The initial position of the game object. */
  position: Vec2;
  /** The dimensions of the game object. */
  dimensions: Vec2;
  /** The device pixel ratio, used for rendering on high-resolution displays. Defaults to 2. */
  dpr?: number;
};

/**
 * The base class for all objects in the game.
 * Provides common functionality such as rendering and updating.
 * @implements {IGameObject}
 */
export class GameObject implements IGameObject {
  /** @inheritdoc */
  id: string;
  /** @inheritdoc */
  position: Vec2;
  /** @inheritdoc */
  dims: Vec2;
  /** @inheritdoc */
  dpr: number;
  /** @inheritdoc */
  c: HTMLCanvasElement;
  /** @inheritdoc */
  ctx: CanvasRenderingContext2D;

  /**
   * Creates a new GameObject instance.
   * @param {GameObjectProps} props - The properties for the game object.
   */
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

  /**
   * Renders the game object to the main canvas.
   * @param {GameEngine} engine - The game engine instance.
   */
  render(engine: GameEngine) {
    if (this.renderable) {
      this.draw();
      const pos = this.position.scaleNew(engine.dpr);
      engine.ctx.drawImage(this.c, pos.x, pos.y);
    }
  }

  /**
   * Draws the object's representation on its offscreen canvas.
   * This method should be implemented by subclasses.
   */
  drawObject() {
    console.warn(
      `GameObject ${this.id} should implements the drawObject function. This is a fallback.`
    );
    this.ctx.clearRect(0, 0, this.dims.x, this.dims.y);
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(0, 0, this.dims.x, this.dims.y);
    this.needsRedraw = false;
  }

  /**
   * A wrapper for drawObject that only redraws when necessary.
   */
  draw() {
    if (this.needsRedraw) this.drawObject();
  }

  /**
   * Updates the game object's state.
   * This method is intended to be overridden by subclasses.
   * @param {GameEngine} engine - The game engine instance.
   * @param {number} deltaTime - The time elapsed since the last frame.
   */
  update(engine: GameEngine, deltaTime: number) {
    // Do nothing, this should be overridden;
  }

  /**
   * Determines if the object is currently renderable.
   * This can be used for culling objects that are off-screen.
   * @returns {boolean} True if the object should be rendered, false otherwise.
   */
  get renderable() {
    return true;
  }

  #needsRedraw = true;
  /**
   * Sets the needsRedraw flag.
   * @param {boolean} needsRedraw - Whether the object needs to be redrawn.
   */
  set needsRedraw(needsRedraw) {
    this.#needsRedraw = needsRedraw === true;
  }
  /**
   * Gets the needsRedraw flag.
   * @returns {boolean} True if the object needs to be redrawn, false otherwise.
   */
  get needsRedraw() {
    return this.#needsRedraw;
  }
}
