import { Jewel } from ".";
import { Milliseconds } from "../types";
import { lerp } from "../utils";
import { JewelAnimation } from "./animation";

export class FadeoutAnimation extends JewelAnimation {
  constructor(jewel: Jewel, onComplete: () => void, duration: Milliseconds) {
    super(jewel, onComplete, duration);
  }
  update() {
    const elapsed = Date.now() - this.timeStarted;
    const percentElapsed = elapsed / this.duration;
    const cappedPercentElapsed = Math.min(1, percentElapsed);
    const newOpacity = lerp(1, 0, cappedPercentElapsed);
    this.jewel.opacity = newOpacity;
  }
}
