import { immerable } from "immer";
import {
  FADEOUT_ANIMATION_DURATION,
  ROTATION_ANIMATION_DURATION,
  SPECIAL_JEWEL_PULSING_ANIMATION_DURATION,
  TIME_TO_TRANSLATE_ONE_PIXEL,
} from "./app-consts";
import { JewelColor, JewelIconSet, JewelType } from "./jewel/jewel-consts";
import { Milliseconds } from "./types";
import { iterateNumericEnum } from "./utils";

export class GameOptions {
  [immerable] = true;
  rotationAnimationDuration: Milliseconds = ROTATION_ANIMATION_DURATION;
  fadeoutAnimationDuration: Milliseconds = FADEOUT_ANIMATION_DURATION;
  alertPulsingAnimationDuration: Milliseconds =
    SPECIAL_JEWEL_PULSING_ANIMATION_DURATION;
  translationSpeed: Milliseconds = TIME_TO_TRANSLATE_ONE_PIXEL;
  allowedColors: JewelColor[] = iterateNumericEnum(JewelColor).filter(
    (jewelColor) => jewelColor !== JewelColor.Rock
  );
  allowedTypes: JewelType[] = iterateNumericEnum(JewelType).filter(
    (type) => ![JewelType.Normal, JewelType.MarkedLocked].includes(type)
  );
  showTips: boolean = true;

  selectedIconSet: JewelIconSet = JewelIconSet.Animals;
  unlockAllSets: boolean = false;
  constructor() {}
}
