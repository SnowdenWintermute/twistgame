import { useEffect } from "react";
import { GRID_PIXEL_DIMENSIONS } from "../app-consts";
import { SelectGrid } from "./SelectGrid";
import { useGameStore } from "../stores/game-store";
import { TwistGame } from "../game";
import { gameSingletonHolder } from "../App";
import NewGameDialog from "./NewGameDialog";

export default function GameBoard() {
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

  if (loading) return "loading";
  return (
    <div className="all-grids">
      <NewGameDialog />
      <canvas
        height={GRID_PIXEL_DIMENSIONS.HEIGHT}
        width={GRID_PIXEL_DIMENSIONS.WIDTH}
        className="canvas border-[2px] border-light-text bg-slate-200 dark:border-dark-text dark:bg-dark-background"
      ></canvas>
      <SelectGrid />
    </div>
  );
}
