import { useEffect } from "react";
import { SelectGrid } from "./SelectGrid";
import { useGameStore } from "../stores/game-store";
import { TwistGame } from "../game";
import { gameSingletonHolder } from "../App";
import NewGameDialog from "./NewGameDialog";
import { GRID_CELL_DIMENSIONS, GRID_PIXEL_DIMENSIONS } from "../app-consts";
import { Dimensions, getJewelPixelPosition } from "../grid";

export default function GameBoard() {
  const loading = useGameStore().loading;
  const canvasSize = useGameStore().canvasSize;
  const mutateState = useGameStore().mutateState;

  useEffect(() => {
    function updateCanvasSize() {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      const newDimensions = new Dimensions(minSize, minSize);

      if (minSize > GRID_PIXEL_DIMENSIONS.HEIGHT) {
        newDimensions.width = GRID_PIXEL_DIMENSIONS.WIDTH;
        newDimensions.height = GRID_PIXEL_DIMENSIONS.HEIGHT;
      }

      const newJewelDiameter = newDimensions.height / GRID_CELL_DIMENSIONS.ROWS;

      mutateState((state) => {
        state.canvasSize = newDimensions;
        state.jewelDiameter = newJewelDiameter;
      });

      const game = gameSingletonHolder.game;
      if (game) {
        game.grid.pixelDimensions.width = newDimensions.width;
        game.grid.pixelDimensions.height = newDimensions.height;
        game.grid.jewelDiameter = newJewelDiameter;
        game.grid.getColumns().forEach((column, columnIndex) => {
          column.forEach((jewel, rowIndex) => {
            jewel.pixelPosition = getJewelPixelPosition(rowIndex, columnIndex);
          });
        });
      }

      console.log("set new dimensions: ", newDimensions);
    }

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [mutateState]);

  useEffect(() => {
    if (loading) return;
    const canvas = document.querySelector("canvas");
    if (canvas === null) return;
    const context = canvas.getContext("2d");
    if (context === null) return;

    const game = new TwistGame(context);
    gameSingletonHolder.game = game;

    // context.translate(0, 100);

    game.startGameLoop();

    return () => {
      game.stopGameLoop();
    };
  }, [loading]);

  if (loading) return "loading";
  return (
    <div className="all-grids">
      <NewGameDialog />
      <canvas
        height={canvasSize.height}
        width={canvasSize.width}
        style={{ height: canvasSize.height, width: canvasSize.width }}
        className="border-[2px] border-light-text bg-slate-200 dark:border-dark-text dark:bg-dark-background"
      ></canvas>
      <SelectGrid />
    </div>
  );
}
