import { Jewel } from ".";
import { imageManager } from "../App";
import { SPECIAL_JEWEL_PULSING_ANIMATION_DURATION } from "../app-consts";
import { useGameStore } from "../stores/game-store";
import { Point } from "../types";
import {
  JEWEL_COLOR_FILE_PATHS,
  JEWEL_ICON_SET_FOLDER_PATHS,
  JEWEL_TYPE_INDICATOR_URLS,
  JEWEL_TYPE_STRINGS,
  JewelIconSet,
  JewelType,
} from "./jewel-consts";

export function drawSelf(this: Jewel, context: CanvasRenderingContext2D) {
  // if (
  //   this.animations.length === 0 &&
  //   this.jewelType !== JewelType.Counting &&
  //   this.jewelType !== JewelType.MarkedLocked
  // )
  //   return;
  const animatedSymbolScaling = getPulsingAnimationScaledValue(this.jewelType);
  drawJewelImage(context, this);
  drawSpecialJewelSymbol(context, this, animatedSymbolScaling);
  context.globalAlpha = 1;
  drawJewelCount(context, this, animatedSymbolScaling);
  if (this.isExploding) drawExplosionEffect(context, this.pixelPosition);
  if (this.isBeingZapped) drawZapEffect(context, this.pixelPosition);
  // FOR TESTING
  if (useGameStore.getState().showDebug) {
    drawJewelIdTag(context, this);
    drawJewelDebugText(context, this);
    drawJewelMatchIndicator(context, this);
  }
}

function getPulsingAnimationScaledValue(jewelType: JewelType) {
  const time =
    (Date.now() % SPECIAL_JEWEL_PULSING_ANIMATION_DURATION) /
    SPECIAL_JEWEL_PULSING_ANIMATION_DURATION;
  let scalingFactor = 1;

  if (
    jewelType === JewelType.Counting ||
    jewelType === JewelType.MarkedLocked
  ) {
    scalingFactor = (Math.sin(time * 2 * Math.PI) + 1) / 2;
  }

  return 0.75 + scalingFactor * 0.5;
}

const ICON_SETS_THAT_NEED_PADDING = [
  JewelIconSet.Fruits,
  JewelIconSet.Summer,
  JewelIconSet.Landscapes,
  JewelIconSet.DigitalNomad,
  JewelIconSet.ColorCircles,
  JewelIconSet.AbstractFlowers,
];

function drawJewelImage(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  const jewelDiameter = useGameStore.getState().jewelDiameter;
  const selectedIconSet = useGameStore.getState().gameOptions.selectedIconSet;
  const extraPadding = ICON_SETS_THAT_NEED_PADDING.includes(
    useGameStore.getState().gameOptions.selectedIconSet
  )
    ? jewelDiameter / 10
    : 0;

  const iconFolderPath = JEWEL_ICON_SET_FOLDER_PATHS[selectedIconSet];
  const imagePath = iconFolderPath + JEWEL_COLOR_FILE_PATHS[jewel.jewelColor];
  const image = imageManager.cachedImages[imagePath];

  if (!(image instanceof Image)) {
    console.log("no image");
  }

  if (image instanceof Image) {
    const aspectRatio = image.width / image.height;
    const desiredHeight = jewelDiameter - extraPadding;
    const desiredWidth = jewelDiameter * aspectRatio;
    context.globalAlpha = jewel.opacity;
    context.drawImage(
      image,
      x - desiredWidth / 2,
      y - desiredHeight / 2,
      desiredWidth,
      desiredHeight
    );
  }
}

function drawSpecialJewelSymbol(
  context: CanvasRenderingContext2D,
  jewel: Jewel,
  animatedSymbolScaling: number
) {
  const specialJewelsTypesWithSymbols = [
    JewelType.Fire,
    JewelType.MarkedLocked,
    JewelType.Locked,
    JewelType.Lightning,
  ];

  if (!specialJewelsTypesWithSymbols.includes(jewel.jewelType)) return;

  const { x, y } = jewel.pixelPosition;

  const imagePath = JEWEL_TYPE_INDICATOR_URLS[jewel.jewelType];
  if (imagePath === undefined)
    throw new Error("fire indicator image path not found");
  const image = imageManager.cachedImages[imagePath];
  if (image instanceof Image) {
    const aspectRatio = image.width / image.height;

    const desiredHeight =
      (useGameStore.getState().jewelDiameter / 2) * animatedSymbolScaling;
    const desiredWidth = desiredHeight * aspectRatio;
    context.beginPath();
    context.arc(
      x,
      y,
      useGameStore.getState().jewelDiameter / 4,
      0,
      Math.PI * 2
    );
    context.fillStyle = "black";
    context.fill();
    context.drawImage(
      image,
      x - desiredWidth / 2,
      y - desiredHeight / 2,
      desiredWidth,
      desiredHeight
    );
  } else {
    context.fillRect(x, y, 10, 10);
  }
}

function drawJewelCount(
  context: CanvasRenderingContext2D,
  jewel: Jewel,
  animatedSymbolScaling: number
) {
  if (jewel.jewelType !== JewelType.Counting) return;

  const { x, y } = jewel.pixelPosition;
  context.beginPath();
  context.arc(x, y, useGameStore.getState().jewelDiameter / 4, 0, Math.PI * 2);
  context.fillStyle = `rgba(0,0,0,${jewel.opacity})`;
  context.fill();
  context.fillStyle = `rgba(255,255,255,${jewel.opacity})`;
  if (jewel.count < 10) context.fillStyle = "yellow";
  if (jewel.count < 3) context.fillStyle = "red";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 20 * animatedSymbolScaling;
  context.font = `${fontSize}px sans`;
  context.fillText(
    jewel.count.toString(),
    jewel.pixelPosition.x,
    jewel.pixelPosition.y
  );
}

function drawExplosionEffect(context: CanvasRenderingContext2D, center: Point) {
  drawCircleAtPoint(context, center, "orange");
}

function drawZapEffect(context: CanvasRenderingContext2D, center: Point) {
  drawCircleAtPoint(context, center, "dodgerblue");
}

// function drawJewelColorCircle(
//   context: CanvasRenderingContext2D,
//   center: Point,
//   color: JewelColor
// ) {
//   const { x, y } = center;
//   context.beginPath();
//   context.arc(x, y, JEWEL_DIAMETER / 2, 0, 2 * Math.PI);
//   const colorRgba = hexToRgba(JEWEL_COLOR_URLS[color], 1);
//   context.fillStyle = colorRgba;
//   context.fill();
// }

function drawSelectionCircle(context: CanvasRenderingContext2D, jewel: Jewel) {
  if (jewel.isSelected === false) return;
  drawCircleAtPoint(context, jewel.pixelPosition, "white");
}

function drawJewelIdTag(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  context.beginPath();

  const idTagPosition = new Point(
    x + useGameStore.getState().jewelDiameter / 4,
    y + useGameStore.getState().jewelDiameter / 4
  );

  const { x: idX, y: idY } = idTagPosition;
  context.arc(
    idX,
    idY,
    useGameStore.getState().jewelDiameter / 8,
    0,
    Math.PI * 2
  );
  context.fillStyle = `rgba(0,0,0,1)`;
  context.fill();
  context.fillStyle = `rgba(255,255,255,1)`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 10;
  context.font = `${fontSize}px sans`;
  context.fillText(jewel.id.toString(), idTagPosition.x, idTagPosition.y);
}

function drawJewelDebugText(context: CanvasRenderingContext2D, jewel: Jewel) {
  const { x, y } = jewel.pixelPosition;
  context.fillStyle = `rgba(255,255,255,1)`;
  context.fillStyle = `rgba(0,0,0,1)`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fontSize = 10;
  context.font = `${fontSize}px sans`;
  context.fillText(
    JEWEL_TYPE_STRINGS[jewel.jewelType] + " " + jewel.opacity,
    x,
    y
  );
}

function drawJewelMatchIndicator(
  context: CanvasRenderingContext2D,
  jewel: Jewel
) {
  if (!jewel.isPartOfMatch) return;
  if (!jewel.matchColorOption) return;
  drawCircleAtPoint(context, jewel.pixelPosition, jewel.matchColorOption);
}

function drawCircleAtPoint(
  context: CanvasRenderingContext2D,
  center: Point,
  color: string
) {
  const { x, y } = center;
  context.beginPath();
  context.arc(x, y, useGameStore.getState().jewelDiameter / 2, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.lineWidth = 5;
  context.stroke();
}
