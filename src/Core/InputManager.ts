/**
 * Manages keyboard input by tracking the state of keys.
 */
export class InputManager {
  /**
   * Stores the pressed state of each key.
   * `true` if the key is pressed, otherwise `false`.
   * @private
   */
  private keys: { [key: string]: boolean } = {};

  /**
   * Initializes the InputManager and adds keyboard event listeners.
   */
  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  /**
   * Handles the `keydown` event.
   * @param e The keyboard event.
   */
  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  /**
   * Handles the `keyup` event.
   * @param e The keyboard event.
   */
  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  /**
   * Checks if a specific key is currently pressed down.
   * @param key The key to check (e.g., 'w', 'ArrowUp').
   * @returns `true` if the key is pressed, otherwise `false`.
   */
  public isKeyDown(key: string): boolean {
    return this.keys[key] || false;
  }
}
