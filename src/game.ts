import { GRID_CELL_DIMENSIONS, RENDER_INTERVAL } from "./app-consts";
import { GameEventManager } from "./game-event-manager";
import { Jewel } from "./jewel";
import { JewelAnimation } from "./jewel/animation";
import { getJewelPixelPosition, Grid } from "./grid";
import { MatchChecker } from "./match-checker";
import { GridRefiller } from "./grid-refiller";
import { chooseRandomFromArray, iterateNumericEnum } from "./utils";
import { JewelColor, JewelType } from "./jewel/jewel-consts";
import { useGameStore } from "./stores/game-store";
import { Point } from "./types";

export class TwistGame {
  lastRenderTimestamp: number = 0;
  lastAnimationFrameId: number = 0;
  grid = new Grid();
  matchChecker = new MatchChecker(this.grid);
  gridRefiller = new GridRefiller(this.grid);
  gameEventManager = new GameEventManager(this);
  gameLoopStopped: boolean = false;

  constructor(private context: CanvasRenderingContext2D) {
    this.removeMatchesFromGrid();
  }

  startGameLoop() {
    console.log("started game loop");
    this.gameLoopStopped = false;
    this.lastAnimationFrameId = requestAnimationFrame((timestamp) => {
      this.tick(timestamp);
    });
  }

  stopGameLoop() {
    console.log("stopped game loop");
    cancelAnimationFrame(this.lastAnimationFrameId);
    this.gameLoopStopped = true;
  }

  reset() {
    this.stopGameLoop();

    localStorage.removeItem("numJewelsRemoved");
    localStorage.removeItem("gameGrid");
    const { grid } = this;

    useGameStore.getState().mutateState((state) => {
      state.numJewelsRemoved = 0;
      state.isGameOver = false;
      state.currentLevel = 0;
      state.showResetGameDialog = false;
    });

    grid.getAllJewels().forEach((jewel) => {
      jewel.opacity = 0;
    });
    grid.numJewelsRemoved = 0;

    grid.rows = grid.makeGrid(
      grid.cellDimensions.height,
      grid.cellDimensions.width
    );
    this.removeMatchesFromGrid();

    useGameStore.getState().mutateState((state) => {
      state.isGameOver = false;
    });

    this.startGameLoop();
  }

  tick(timestamp: number) {
    if (this.gameLoopStopped) return;
    this.gameEventManager.process();

    if (timestamp - this.lastRenderTimestamp >= RENDER_INTERVAL)
      this.updateCanvas();

    this.lastAnimationFrameId = requestAnimationFrame((timestamp) => {
      this.tick(timestamp);
    });
  }

  updateCanvas() {
    const jewelsToUpdate: Jewel[] = this.grid.getAllJewels();

    this.gridRefiller.replacements?.forEach((column) => {
      jewelsToUpdate.push(...column);
    });

    jewelsToUpdate.forEach((jewel) => {
      const animationsToKeep: JewelAnimation[] = [];
      jewel.animations.forEach((animation) => {
        animation.update();

        if (animation.isComplete()) {
          animation.onComplete();
        } else {
          animationsToKeep.push(animation);
        }
      });
      jewel.animations = animationsToKeep;
    });

    this.grid.drawSelf(this.context);

    jewelsToUpdate.forEach((jewel) => {
      jewel.drawSelf(this.context);
    });
  }

  removeMatchesFromGrid() {
    let matches = this.matchChecker.checkForMatches();
    let numAttemptsToRemoveAllMatches = 0;
    const maxAttempts = 10;

    while (matches.length && numAttemptsToRemoveAllMatches < maxAttempts) {
      numAttemptsToRemoveAllMatches += 1;

      for (const match of matches) {
        match.jewelPositions.forEach((jewelPosition, i) => {
          if (i !== 1) return;
          const jewel = this.grid.getJewelAtPosition(jewelPosition);
          if (jewel === undefined) throw new Error("no jewel found");
          const matchColor = jewel.jewelColor;

          const validColors = iterateNumericEnum(JewelColor).filter(
            (jewelColor) =>
              jewelColor !== JewelColor.Rock && jewelColor !== matchColor
          );
          const selectedColor: JewelColor = chooseRandomFromArray(validColors);
          jewel.jewelColor = selectedColor;
        });
      }

      matches = this.matchChecker.checkForMatches();
    }
    if (numAttemptsToRemoveAllMatches === maxAttempts)
      console.warn("failed to remove matches from initial grid");
  }

  checkForGameOver() {
    this.grid.getAllJewels().forEach((jewel) => {
      if (jewel.jewelType !== JewelType.Counting) return;

      if (jewel.count <= 0) {
        useGameStore.getState().mutateState((state) => {
          state.isGameOver = true;
        });
        this.stopGameLoop();
      }
    });
  }

  save() {
    const asString = JSON.stringify(this.grid.rows);
    localStorage.setItem("gameGrid", asString);
    localStorage.setItem(
      "numJewelsRemoved",
      this.grid.numJewelsRemoved.toString()
    );
  }

  static load(context: CanvasRenderingContext2D) {
    const existingGameJson = localStorage.getItem("gameGrid");
    if (!existingGameJson) return;
    const parsed = JSON.parse(existingGameJson);
    for (
      let rowIndex = 0;
      rowIndex < GRID_CELL_DIMENSIONS.ROWS;
      rowIndex += 1
    ) {
      for (
        let colIndex = 0;
        colIndex < GRID_CELL_DIMENSIONS.ROWS;
        colIndex += 1
      ) {
        const jewel = parsed[rowIndex]![colIndex] as Jewel;
        if (jewel === undefined) throw new Error("no expected jewel");
        parsed[rowIndex]![colIndex] = new Jewel(
          jewel.jewelColor,
          jewel.jewelType,
          jewel.count,
          getJewelPixelPosition(rowIndex, colIndex)
        );
        jewel.animations = [];
      }
    }
    const game = new TwistGame(context);
    game.grid.rows = parsed;
    game.matchChecker.grid = game.grid;
    game.gridRefiller.grid = game.grid;
    const numJewelsRemoved = localStorage.getItem("numJewelsRemoved");
    const numJewelsRemovedAsNumber = numJewelsRemoved
      ? parseInt(numJewelsRemoved)
      : 0;
    game.grid.numJewelsRemoved = numJewelsRemovedAsNumber;
    useGameStore.getState().mutateState((state) => {
      state.numJewelsRemoved = numJewelsRemovedAsNumber;
      state.currentLevel = game.grid.getCurrentLevel();
    });
    return game;
  }
}
