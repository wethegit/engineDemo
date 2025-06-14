import { Vec2 } from "wtc-math";
/**
 * Manages keyboard and mouse input by tracking the state of keys and mouse events.
 * Keyboard events are handled at the window level to capture all keyboard input,
 * while mouse events are handled at the canvas level to track mouse position relative to the canvas.
 */
export class InputManager {
  /**
   * Stores the pressed state of each key.
   * `true` if the key is pressed, otherwise `false`.
   * @private
   */
  private _keys: { [key: string]: boolean } = {};

  /**
   * Stores the pressed state of mouse buttons.
   * @private
   */
  private _mouseButtons: { [button: number]: boolean } = {};

  /**
   * Current mouse position.
   * @private
   */
  private _mousePosition: Vec2 = new Vec2(0, 0);

  /**
   * Whether the mouse is currently being dragged.
   * @private
   */
  private _isDragging: boolean = false;

  /**
   * Initializes the InputManager and adds event listeners.
   * Keyboard events are attached to the window to capture all keyboard input.
   * Mouse events are attached to the canvas to track position relative to the canvas.
   * @param canvas The canvas element to track mouse events on
   */
  constructor(canvas: HTMLCanvasElement) {
    // Keyboard events
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    // Mouse events
    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    canvas.addEventListener("mouseleave", () => this.onMouseLeave());
  }

  /**
   * Handles the `keydown` event.
   * @param e The keyboard event.
   */
  private onKeyDown(e: KeyboardEvent): void {
    this._keys[e.key] = true;
  }

  /**
   * Handles the `keyup` event.
   * @param e The keyboard event.
   */
  private onKeyUp(e: KeyboardEvent): void {
    this._keys[e.key] = false;
  }

  /**
   * Handles the `mousedown` event.
   * @param e The mouse event.
   */
  private onMouseDown(e: MouseEvent): void {
    this._mouseButtons[e.button] = true;
    this._isDragging = true;
  }

  /**
   * Handles the `mouseup` event.
   * @param e The mouse event.
   */
  private onMouseUp(e: MouseEvent): void {
    this._mouseButtons[e.button] = false;
    this._isDragging = false;
  }

  /**
   * Handles the `mousemove` event.
   * @param e The mouse event.
   */
  private onMouseMove(e: MouseEvent): void {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    this._mousePosition.x = e.clientX - rect.left;
    this._mousePosition.y = e.clientY - rect.top;
  }

  /**
   * Handles the `mouseleave` event.
   */
  private onMouseLeave(): void {
    // Reset all mouse buttons when mouse leaves the window
    this._mouseButtons = {};
    this._isDragging = false;
  }

  /**
   * Checks if a specific key is currently pressed down.
   * @param key The key to check (e.g., 'w', 'ArrowUp').
   * @returns `true` if the key is pressed, otherwise `false`.
   */
  public isKeyDown(key: string): boolean {
    return this._keys[key] || false;
  }

  /**
   * Checks if a specific mouse button is currently pressed down.
   * @param button The mouse button to check (0 = left, 1 = middle, 2 = right).
   * @returns `true` if the button is pressed, otherwise `false`.
   */
  public isMouseButtonDown(button: number): boolean {
    return this._mouseButtons[button] || false;
  }

  /**
   * Gets the current mouse position.
   * @returns An object containing the x and y coordinates of the mouse.
   */
  get mousePosition(): Vec2 {
    return this._mousePosition;
  }

  /**
   * Checks if the mouse is currently being dragged.
   * @returns `true` if the mouse is being dragged, otherwise `false`.
   */
  public isDragging(): boolean {
    return this._isDragging;
  }
}
