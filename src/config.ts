import { Vec2 } from "wtc-math";
import { Pane } from "tweakpane";

export const params = {
  wind: new Vec2(0, 0),
  gravity: 1,
  friction: 0.975,
  "ground height": 100,
};

const pane = new Pane();
const globals = pane.addFolder({ title: "Globals" });
console.log(pane);
globals.addBinding(params, "wind", {
  x: { min: -5, max: 5 },
  y: { min: -5, max: 5 },
});
globals.addBinding(params, "gravity");
globals.addBinding(params, "ground height");
