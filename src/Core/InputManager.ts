export class InputManager {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  public isKeyDown(key: string): boolean {
    return this.keys[key] || false;
  }
}
