# Engine Demo

A TypeScript-based game engine demo project that showcases basic game engine functionality and UI controls using Tweakpane.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

## Class Reference

### Core Classes

#### GameEngine

The main engine class that manages the game loop, rendering, and game objects.

```typescript
class GameEngine {
  constructor(args: {
    canvas: HTMLCanvasElement;
    dimensions?: Vec2;
    dpr?: number;
  });

  // Properties
  canvas: HTMLCanvasElement;
  dims: Vec2;
  dpr: number;
  ctx: CanvasRenderingContext2D;
  gameObjects: GameObject[];
  inputManager: InputManager;

  // Methods
  addObject(obj: GameObject): void;
  removeObject(obj: GameObject): void;
  clearScene(): void;
  getObjectById(id: string): GameObject | undefined;
  getObjectsInArea(area: Rectangle): GameObject[];
  swapObjectIndices(obj1: GameObject, obj2: GameObject): boolean;
  update(deltaTime: number): void;
  draw(): void;

  // Game Loop Control
  playing: boolean; // Getter/Setter
}

// Planned Features
// - Camera functionality
// - Time management functions
// - Type-based object filtering
// - Debug mode
// - Event system
// - State management
```

#### InputManager

Handles keyboard and mouse input for the game engine.

```typescript
class InputManager {
  constructor(canvas: HTMLCanvasElement);

  // Properties
  mousePosition: Vec2;
  mouseButtons: Map<number, boolean>;
  keys: Map<string, boolean>;

  // Methods
  isKeyPressed(key: string): boolean;
  isMouseButtonPressed(button: number): boolean;
  getMousePosition(): Vec2;
  addKeyListener(key: string, callback: (pressed: boolean) => void): void;
  removeKeyListener(key: string, callback: (pressed: boolean) => void): void;
  addMouseButtonListener(
    button: number,
    callback: (pressed: boolean) => void
  ): void;
  removeMouseButtonListener(
    button: number,
    callback: (pressed: boolean) => void
  ): void;
  addMouseMoveListener(callback: (position: Vec2) => void): void;
  removeMouseMoveListener(callback: (position: Vec2) => void): void;
}
```

#### GameObject

Base class for all game objects. Provides common functionality for rendering and updating.

```typescript
class GameObject {
  constructor(props: {
    id: string;
    position: Vec2;
    dimensions: Vec2;
    anchorPoint?: AnchorPoint;
    dpr?: number;
    rotation?: number;
  });

  // Properties
  id: string;
  position: Vec2;
  dims: Vec2;
  anchorPoint: AnchorPoint;
  dpr: number;
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  needsRedraw: boolean;
  rotation: number;
  bounds: Rectangle;
  renderable: boolean;

  // Methods
  render(engine: GameEngine): void;
  drawObject(): void;
  update(engine: GameEngine, deltaTime: number): void;
}
```

#### Rectangle

Helper class for handling rectangular areas and collision detection.

```typescript
class Rectangle {
  constructor(x: number, y: number, width: number, height: number);

  // Properties
  x: number;
  y: number;
  width: number;
  height: number;

  // Methods
  static fromPositionAndDimensions(position: Vec2, dimensions: Vec2): Rectangle;
  intersects(other: Rectangle): boolean;
  containsPoint(point: Vec2): boolean;
}
```

### Game Objects

#### Player

Represents the player character.

```typescript
class Player extends GameObject {
  // Player-specific implementation
}
```

#### Ground

Represents the ground/terrain in the game.

```typescript
class Ground extends GameObject {
  // Ground-specific implementation
}
```

## Development Guide

### Creating a New Game Object

1. Create a new class that extends `GameObject`:

```typescript
import { GameObject, type GameObjectProps } from "../Core/GameObject";

export class MyGameObject extends GameObject {
  constructor(props: GameObjectProps) {
    super(props);
    // Initialize your object
  }

  drawObject() {
    // Implement your drawing logic
  }

  update(engine: GameEngine, deltaTime: number) {
    // Implement your update logic
  }
}
```

2. Add the object to the game engine:

```typescript
const myObject = new MyGameObject({
  id: "unique-id",
  position: new Vec2(x, y),
  dimensions: new Vec2(width, height),
});
engine.addObject(myObject);
```

### Game Loop

The game engine manages the main game loop automatically. To start/stop the game:

```typescript
// Start the game
engine.playing = true;

// Stop the game
engine.playing = false;
```

### Rendering

- Each game object has its own offscreen canvas for rendering
- Objects are only redrawn when `needsRedraw` is true
- The main canvas is cleared and redrawn every frame

### Input Handling

The `InputManager` class handles keyboard and mouse input:

```typescript
// Check if a key is pressed
if (engine.inputManager.isKeyPressed("Space")) {
  // Handle space key press
}

// Check mouse position
const mousePos = engine.inputManager.mousePosition;
```
