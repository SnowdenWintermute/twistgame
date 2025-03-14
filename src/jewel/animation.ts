import { Jewel } from ".";
import { Milliseconds } from "../types";

export abstract class JewelAnimation {
  timeStarted: Milliseconds = Date.now();

  constructor(
    protected jewel: Jewel,
    public onComplete: () => void,
    protected duration: Milliseconds
  ) {}
  abstract update(): void;
  isComplete() {
    const elapsed = Date.now() - this.timeStarted;
    return elapsed >= this.duration;
  }
}
