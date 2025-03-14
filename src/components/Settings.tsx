import { useEffect } from "react";
import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";
import XShape from "../assets/x-shape.svg?react";
import HorizontalDivider from "../Divider";

export default function Settings() {
  const viewingSettings = useGameStore().viewingSettings;
  const mutateGameState = useGameStore().mutateState;

  useEffect(() => {
    const { game } = gameSingletonHolder;
    if (!game) return;

    if (viewingSettings) game.stopGameLoop();
    else game.startGameLoop();

    return () => {
      game.startGameLoop();
    };
  }, [viewingSettings]);

  return (
    <dialog
      open={viewingSettings}
      className="absolute top-0 left-0 z-10 text-theme bg-theme border-theme p-4 w-full h-full"
    >
      <button
        className="absolute top-2 right-2 h-6 border border-theme"
        onClick={() =>
          mutateGameState((state) => {
            state.viewingSettings = !state.viewingSettings;
          })
        }
      >
        <XShape className="fill-theme h-full" />
      </button>
      <h3 className="text-2xl text-center">Settings</h3>
      <HorizontalDivider extraStyles="h-1 mt-2 mb-2" />
    </dialog>
  );
}
