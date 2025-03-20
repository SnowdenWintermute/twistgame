import { FormEvent } from "react";
import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";
import HotkeyButton from "./HotkeyButton";

export default function ResetGameDialog() {
  const showResetGameDialog = useGameStore().showResetGameDialog;
  const mutateGameState = useGameStore().mutateState;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { game } = gameSingletonHolder;

    if (game !== null) game.reset();
  }

  return (
    <dialog
      open={showResetGameDialog}
      className={
        showResetGameDialog
          ? "absolute top-0 left-0 z-10 w-full h-full bg-transparent flex justify-center items-center"
          : ""
      }
    >
      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-50" />
      <div className="absolute bg-theme p-4 border-[4px] border-theme flex justify-center flex-col">
        <h3 className="text-2xl mb-2 text-theme w-full text-center">
          Really reset the game?
        </h3>
        <form onSubmit={handleSubmit}>
          <HotkeyButton
            className="border-[2px] mb-2 border-theme text-theme-primary p-2 bg-theme-accent hover:opacity-90 w-full"
            buttonType="button"
            hotkeys={["Escape"]}
            onClick={() => {
              mutateGameState((state) => {
                state.showResetGameDialog = false;
              });
            }}
          >
            Cancel
          </HotkeyButton>
          <HotkeyButton
            className="border-[2px] border-theme text-theme-primary p-2 bg-theme-accent hover:opacity-90 w-full"
            hotkeys={["Enter"]}
            buttonType="submit"
            onClick={() => {}}
          >
            Play Again
          </HotkeyButton>
        </form>
      </div>
    </dialog>
  );
}
