import { Vec2 } from "wtc-math";

import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";
import { Rectangle } from "../Helpers/Rectangle";

/** TODO:
 * - Add Camera functionality.
 * - Add some time management functions.
 * - Add a way to get objects by type.
 * - Add debug mode.
 * - Add event system
 * - Add state management.
 */

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

/**
 * The core of the game engine.
 * Manages the game loop, rendering, and game objects.
 * @implements {IGameEngine}
 */
export class GameEngine implements IGameEngine {
  /** The HTML canvas element to render to. */
  canvas: HTMLCanvasElement;
  /** The logical dimensions of the canvas. */
  dims!: Vec2;
  /** The device pixel ratio for high-resolution displays. */
  dpr!: number;
  /** The 2D rendering context for the canvas. */
  ctx: CanvasRenderingContext2D;
  /** A list of all game objects in the scene. */
  gameObjects!: GameObject[];
  /** The timestamp of the last frame. */
  lastTime: number = 0;
  /** The time elapsed since the last frame in seconds. */
  deltaTime: number = 0;
  /** The ID of the current animation frame request. */
  animationFrameId: number | null = null;
  /** The input manager for handling keyboard and mouse events. */
  inputManager: InputManager;

  /**
   * Creates a new GameEngine instance.
   * @param {GameEngineArguments} args - The arguments for the game engine.
   */
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
    this.ctx.scale(dpr, dpr);

    this.gameObjects = [];
    this.inputManager = new InputManager(canvas);
  }

  /**
   * Adds a game object to the scene.
   * @param {GameObject} obj - The game object to add.
   */
  addObject(obj: GameObject) {
    if (obj instanceof GameObject) {
      this.gameObjects.push(obj);
    }
  }

  /**
   * Removes a game object from the scene.
   * @param {GameObject} obj - The game object to remove.
   */
  removeObject(obj: GameObject) {
    this.gameObjects = this.gameObjects.filter((o) => o !== obj);
  }

  /**
   * Clears all game objects from the scene.
   */
  clearScene() {
    this.gameObjects = [];
  }

  /**
   * Finds a game object by its ID.
   * @param {string} id - The ID of the game object to find.
   * @returns {GameObject | undefined} The found game object or undefined if not found.
   */
  getObjectById(id: string): GameObject | undefined {
    return this.gameObjects.find((obj) => obj.id === id);
  }

  /**
   * Gets all game objects within a specific area.
   * @param {Rectangle} area - The area to check for objects.
   * @returns {GameObject[]} Array of game objects within the specified area.
   */
  getObjectsInArea(area: Rectangle): GameObject[] {
    return this.gameObjects.filter((obj) => {
      const bounds = obj.bounds;
      return area.intersects(bounds);
    });
  }

  /**
   * Swaps the index positions of two game objects in the scene.
   * @param {GameObject} obj1 - The first game object.
   * @param {GameObject} obj2 - The second game object.
   * @returns {boolean} True if the swap was successful, false if either object wasn't found.
   */
  swapObjectIndices(obj1: GameObject, obj2: GameObject): boolean {
    const index1 = this.gameObjects.indexOf(obj1);
    const index2 = this.gameObjects.indexOf(obj2);

    if (index1 === -1 || index2 === -1) return false;

    [this.gameObjects[index1], this.gameObjects[index2]] = [
      this.gameObjects[index2],
      this.gameObjects[index1],
    ];

    return true;
  }

  /**
   * Updates all game objects in the scene.
   * @param {number} deltaTime - The time elapsed since the last frame in seconds.
   */
  update(deltaTime: number) {
    this.gameObjects.forEach((obj) => obj.update(this, deltaTime));
  }

  /**
   * Draws all game objects in the scene.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.gameObjects.forEach((obj) => {
      obj.render(this);
    });
  }

  /**
   * The main game loop.
   * Updates and draws the scene on each frame.
   * @param {number} d - The current timestamp.
   */
  gameLoop = (d: number) => {
    if (!this.playing) return;

    this.deltaTime = (d - this.lastTime) / 1000;
    this.lastTime = d;

    this.update(this.deltaTime);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  #playing = false;
  /**
   * Gets/Sets playing - Starts or stops the game loop.
   * @param {boolean} p - Whether the game should be playing.
   */
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
