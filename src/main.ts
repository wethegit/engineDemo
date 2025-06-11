import { Vec2 } from "wtc-math";

import { GameEngine } from "./Core/GameEngine";
import { Background, Ground, Player } from "./GameObjects";
import { params } from "./config";

const root = document.getElementById("root") as HTMLElement;

const gameCanvas = document.createElement("canvas");
const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 600;
const dpr = 2; //window.devicePixelRatio || 1;
root.appendChild(gameCanvas);

root.style.setProperty("--width", `${LOGICAL_WIDTH}px`);
root.style.setProperty("--height", `${LOGICAL_HEIGHT}px`);

// dpr should come from the engine, rather than needing to be added to each element.

const gameEngine = new GameEngine({
  canvas: gameCanvas,
  dimensions: new Vec2(LOGICAL_WIDTH, LOGICAL_HEIGHT),
  dpr,
});

if (gameEngine.canvas) {
  const background = new Background({
    id: "mainBackground",
    dimensions: new Vec2(LOGICAL_WIDTH, LOGICAL_HEIGHT),
    dpr,
  });
  const ground = new Ground({
    id: "Ground",
    dimensions: new Vec2(LOGICAL_WIDTH, LOGICAL_HEIGHT),
    dpr,
  });
  const player = new Player({
    id: "player1",
    position: new Vec2(50, LOGICAL_HEIGHT - params["ground height"] - 50),
    dimensions: new Vec2(50, 50),
    speed: 150,
    dpr,
  });

  gameEngine.addObject(background);
  gameEngine.addObject(ground);
  gameEngine.addObject(player);

  gameEngine.playing = true;
}
