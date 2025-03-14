import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";
import HotkeyButton from "./HotkeyButton";

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
      <div className="absolute bg-theme p-4 border-[4px] border-theme flex justify-center flex-col">
        <h3 className="text-2xl mb-2 text-theme-primary">GAME OVER !!!</h3>
        <HotkeyButton
          className="border-[2px] border-theme text-theme-primary p-2 bg-theme-accent hover:opacity-90"
          hotkeys={["Enter"]}
          onClick={handleNewGameClick}
        >
          Play Again
        </HotkeyButton>
      </div>
    </dialog>
  );
}
