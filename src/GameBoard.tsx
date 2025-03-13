import { useEffect } from "react";
import { GRID_PIXEL_DIMENSIONS } from "./app-consts";
import { SelectGrid } from "./SelectGrid";
import { useGameStore } from "./stores/game-store";
import { TwistGame } from "./game";
import { gameSingletonHolder } from "./App";

export default function GameBoard() {
  const isGameOver = useGameStore().isGameOver;
  const loading = useGameStore().loading;

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

  function handleNewGameClick() {
    const { game } = gameSingletonHolder;
    if (game !== null) game.reset();
  }

  if (loading) return "loading";
  return (
    <div className="all-grids">
      <dialog
        open={isGameOver}
        className={
          isGameOver
            ? "absolute top-0 left-0 z-10 w-full h-full bg-transparent flex justify-center items-center"
            : ""
        }
      >
        <div className="absolute top-0 left-0 h-full w-full bg-black opacity-50" />
        <div className="absolute bg-light-background dark:bg-dark-background p-4 border-[4px] border-light-text dark:border-dark-text flex justify-center flex-col">
          <h3 className="text-2xl mb-2">GAME OVER !!!</h3>
          <button
            className="border-[2px] text-light-text dark:text-dark-text p-2 bg-teal-800 hover:bg-teal-700"
            onClick={handleNewGameClick}
          >
            Play Again
          </button>
        </div>
      </dialog>
      <canvas
        height={GRID_PIXEL_DIMENSIONS.HEIGHT}
        width={GRID_PIXEL_DIMENSIONS.WIDTH}
        className="canvas border-[2px] border-light-text bg-slate-200 dark:border-dark-text dark:bg-dark-background"
      ></canvas>
      <SelectGrid />
    </div>
  );
}
