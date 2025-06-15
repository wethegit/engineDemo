import { Vec2 } from "wtc-math";

import { GameEngine } from "./Core/GameEngine";
import { Background, Ground, Player, Trajectory } from "./GameObjects";
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
  const playerSize = 80;
  const player = new Player({
    id: "player1",
    position: new Vec2(
      50,
      LOGICAL_HEIGHT - params["ground height"] - playerSize / 2
    ),
    dimensions: new Vec2(playerSize, playerSize),
    speed: 150,
    dpr,
  });
  const trajectory = new Trajectory({
    id: "trajectory-player1",
    position: new Vec2(0, 0),
    dimensions: new Vec2(LOGICAL_WIDTH, LOGICAL_HEIGHT),
    dpr,
    playerObject: player,
  });

  gameEngine.addGameObject(background);
  gameEngine.addGameObject(ground);
  gameEngine.addGameObject(player);
  gameEngine.addGameObject(trajectory);

  gameEngine.playing = true;
}
