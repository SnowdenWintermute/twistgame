import { useGameStore } from "../stores/game-store";
import HotkeyButton from "./HotkeyButton";
import Settings from "./Settings";
import XShape from "../assets//x-shape.svg?react";

export default function SettingsDialog() {
  const viewingSettings = useGameStore().viewingSettings;
  const mutateGameState = useGameStore().mutateState;

  return (
    <dialog
      open={viewingSettings}
      className="absolute top-0 left-0 z-10 text-theme bg-theme border-theme p-4 w-full h-full max-h-full overflow-auto"
    >
      <HotkeyButton
        className="absolute top-2 right-2 h-6 border border-theme p-1"
        hotkeys={["Escape"]}
        disabled={!viewingSettings}
        onClick={() =>
          mutateGameState((state) => {
            state.viewingSettings = !state.viewingSettings;
          })
        }
      >
        <XShape className="fill-theme h-full" />
      </HotkeyButton>
      <Settings />
    </dialog>
  );
}
