# Engine Demo

A TypeScript-based game engine demo project that showcases basic game engine functionality and UI controls using Tweakpane.

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm (comes with Node.js)

## Project Structure

```
├── src/
│   ├── Core/           # Core engine components
│   ├── GameObjects/    # Game object implementations
│   ├── Helpers/        # Helper classes and utilities
│   ├── config.ts       # Configuration settings
│   ├── main.ts         # Main application entry point
│   └── style.scss      # Styling
├── public/             # Static assets
├── index.html          # Main HTML file
└── package.json        # Project dependencies and scripts
```

## Technologies Used

- TypeScript
- Vite (Build tool and development server)
- Tweakpane (UI controls)
- SASS (Styling)
- wtc-math (Maths library)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

## Development

The project uses Vite as the build tool and development server. The main entry point is `src/main.ts`, and the application is styled using SCSS.

## Dependencies

### Development Dependencies

- @tweakpane/core (~2.0.5)
- sass (~1.89.1)
- typescript (~5.8.3)
- vite (^6.3.5)

### Runtime Dependencies

- tweakpane (~4.0.5)
- wtc-math (~1.0.20)

## License

This project is private and not licensed for public use.

## Version

Current version: 0.0.0

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

#### Bullet

Represents a projectile in the game.

```typescript
class Bullet extends GameObject {
  constructor(props: {
    id: string;
    position: Vec2;
    velocity: Vec2;
    radius?: number;
  });

  // Properties
  physics: IElement;
  radius: number;
}
```

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
- High DPI displays are supported through the `dpr` parameter

### Physics

The engine uses a simple physics system:

- Gravity and wind forces can be applied to objects
- Collision detection is handled by individual game objects
- Physics calculations are performed in the update loop

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
