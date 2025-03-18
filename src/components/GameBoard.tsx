import { useEffect, useRef, useState } from "react";
import { SelectGrid } from "./SelectGrid";
import { useGameStore } from "../stores/game-store";
import { TwistGame } from "../game";
import { gameSingletonHolder } from "../App";
import NewGameDialog from "./NewGameDialog";
import { GRID_CELL_DIMENSIONS, GRID_PIXEL_DIMENSIONS } from "../app-consts";
import { Dimensions, getJewelPixelPosition } from "../grid";
import LoadingSpinner from "./LoadingSpinner";
import CircularProgress from "./CircularProgress";

export default function GameBoard() {
  const loading = useGameStore().loading;
  const canvasSize = useGameStore().canvasSize;
  const imageLoadingNormalizedPercent =
    useGameStore().imageLoadingNormalizedPercent;
  const mutateState = useGameStore().mutateState;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percentLoadTest, setPercentLoadTest] = useState(0);
  const timeoutRef = useRef<number>(null);

  useEffect(() => {
    // function increaseTestPercent() {
    //   if (percentLoadTest >= 1) return;
    //   setPercentLoadTest(percentLoadTest + 0.001);
    // }
    timeoutRef.current = setTimeout(() => {
      setPercentLoadTest(percentLoadTest + 0.1);
    }, 200);

    // increaseTestPercent();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [percentLoadTest]);

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
    // context.translate(0, 100);

    let game = gameSingletonHolder.game;

    if (!game) {
      game = new TwistGame(context);
      gameSingletonHolder.game = game;
    }

    game.startGameLoop();

    return () => {
      game.stopGameLoop();
    };
  }, [loading]);

  return (
    <div className="all-grids">
      {loading ? (
        // loading
        <div
          className="flex items-center justify-center"
          style={{ height: canvasSize.height, width: canvasSize.width }}
        >
          <div className="h-10 w-10">
            <CircularProgress
              thickness={4}
              percentage={Math.floor(imageLoadingNormalizedPercent * 100)}
              // percentage={percentLoadTest * 100}
            />
          </div>
        </div>
      ) : (
        <>
          <NewGameDialog />
          <canvas
            height={canvasSize.height}
            width={canvasSize.width}
            style={{ height: canvasSize.height, width: canvasSize.width }}
            className="border-[2px] border-light-text bg-slate-200 dark:border-dark-text dark:bg-dark-background"
          ></canvas>
          <SelectGrid />
        </>
      )}
    </div>
  );
}
