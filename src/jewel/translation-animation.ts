import { Jewel } from ".";
import { Point } from "../types";
import { Milliseconds } from "../types";
import { easeIn, lerp } from "../utils";
import { JewelAnimation } from "./animation";

export class TranslationAnimation extends JewelAnimation {
  constructor(
    private originalPosition: Point,
    private destinationPosition: Point,
    jewel: Jewel,
    onComplete: () => void,
    timeToTranslateOnePixel: Milliseconds
  ) {
    const distance = originalPosition.distance(destinationPosition);
    const duration = timeToTranslateOnePixel * distance;
    super(jewel, onComplete, duration);
  }
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);

    const newPosition = new Point(
      lerp(
        this.originalPosition.x,
        this.destinationPosition.x,
        easeIn(cappedPercentElapsed)
      ),
      lerp(
        this.originalPosition.y,
        this.destinationPosition.y,
        easeIn(cappedPercentElapsed)
      )
    );

    this.jewel.pixelPosition.x = newPosition.x;
    this.jewel.pixelPosition.y = newPosition.y;
  }
}
