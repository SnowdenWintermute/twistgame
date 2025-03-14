export enum JewelType {
  Normal,
  Fire,
  Lightning,
  Counting,
  Rock,
  Locked,
  MarkedLocked,
}
export enum JewelColor {
  Red,
  Blue,
  White,
  Purple,
  Green,
  Yellow,
  Orange,
  Rock,
}

export const JEWEL_COLOR_NAME_STRINGS: Record<JewelColor, string> = {
  [JewelColor.Red]: "Red",
  [JewelColor.Blue]: "Blue",
  [JewelColor.White]: "White",
  [JewelColor.Purple]: "Purple",
  [JewelColor.Green]: "Green",
  [JewelColor.Yellow]: "Yellow",
  [JewelColor.Orange]: "Orange",
  [JewelColor.Rock]: "Rock",
};

export const JEWEL_COLOR_FILE_PATHS: Record<JewelColor, string> = {
  [JewelColor.Red]: "/red.svg",
  [JewelColor.Blue]: "/blue.svg",
  [JewelColor.White]: "/white.svg",
  [JewelColor.Purple]: "/purple.svg",
  [JewelColor.Green]: "/green.svg",
  [JewelColor.Yellow]: "/yellow.svg",
  [JewelColor.Orange]: "/orange.svg",
  [JewelColor.Rock]: "/rock.svg",
};

export enum JewelIconSet {
  Animals,
  Fruits,
  Landscapes,
  Summer,
  DigitalNomad,
  Crypto,
  AbstractFlowers,
  ColorCircles,
}

export const JEWEL_ICON_SET_FOLDER_PATHS: Record<JewelIconSet, string> = {
  [JewelIconSet.Animals]: "/animals",
  [JewelIconSet.Landscapes]: "/landscapes",
  [JewelIconSet.Fruits]: "/fruits",
  [JewelIconSet.Summer]: "/summer",
  [JewelIconSet.Crypto]: "/crypto",
  [JewelIconSet.DigitalNomad]: "/digitalnomad",
  [JewelIconSet.AbstractFlowers]: "/abstractflowers",
  [JewelIconSet.ColorCircles]: "/colorcircles",
};

export const JEWEL_TYPE_INDICATOR_URLS: Partial<Record<JewelType, string>> = {
  [JewelType.Fire]: "/jewel-type-indicator/fire.svg",
  [JewelType.Lightning]: "/jewel-type-indicator/lightning.svg",
  [JewelType.MarkedLocked]: "/jewel-type-indicator/openlock.svg",
  [JewelType.Locked]: "/jewel-type-indicator/closedlock.svg",
};

export const JEWEL_TYPE_STRINGS: Record<JewelType, string> = {
  [JewelType.Normal]: "Normal",
  [JewelType.Fire]: "Fire",
  [JewelType.Lightning]: "Lightning",
  [JewelType.Counting]: "Counting",
  [JewelType.Rock]: "Unmatchable",
  [JewelType.Locked]: "Locked",
  [JewelType.MarkedLocked]: "MarkedLocked",
};

export const JEWEL_TYPE_TIPS: Record<JewelType, string> = {
  [JewelType.Normal]: "",
  [JewelType.Fire]: "",
  [JewelType.Lightning]: "",
  [JewelType.Counting]: "When a counting tile reaches zero, the game is over!",
  [JewelType.Rock]:
    "Some tiles cannot form matches. Remove them using lightning or fire tiles.",
  [JewelType.Locked]: "Locked tiles can not be rotated",
  [JewelType.MarkedLocked]: "",
};
