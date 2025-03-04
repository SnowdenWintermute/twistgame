import { grid, gridRefiller, gridUpdater } from "./App";
import { evaluateAndUpdateGrid } from "./evaluate-and-update-grid";
import { Jewel } from "./jewel";

export function updateCanvas(context: CanvasRenderingContext2D) {
  const jewelsToUpdate: Jewel[] = [];
  if (gridUpdater.shouldUpdateOnNextFrame) {
    evaluateAndUpdateGrid();
    gridUpdater.shouldUpdateOnNextFrame = false;
  }

  jewelsToUpdate.push(...grid.getAllJewels());
  gridRefiller.replacements?.forEach((column) => {
    jewelsToUpdate.push(...column);
  });

  jewelsToUpdate.forEach((jewel) => {
    if (jewel.rotationAnimation) {
      const rotationAnimationIsComplete = jewel.rotationAnimation.update();
      if (rotationAnimationIsComplete) jewel.rotationAnimation = null;
    }
    if (jewel.fadeoutAnimation) {
      const fadeoutAnimationIsComplete = jewel.fadeoutAnimation?.update();
      if (fadeoutAnimationIsComplete) jewel.fadeoutAnimation = null;
    }
    if (jewel.fallingAnimation) {
      const fallingAnimationIsComplete = jewel.fallingAnimation?.update();
      if (fallingAnimationIsComplete) jewel.fallingAnimation = null;
    }
  });
  grid.drawSelf(context);
  gridRefiller.replacements?.forEach((column) => {
    column.forEach((jewel) => {
      jewel.drawSelf(context);
    });
  });
}
