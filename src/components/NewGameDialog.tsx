import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";

export default function NewGameDialog() {
  const isGameOver = useGameStore().isGameOver;

  function handleNewGameClick() {
    const { game } = gameSingletonHolder;
    if (game !== null) game.reset();
  }

  return (
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
  );
}
