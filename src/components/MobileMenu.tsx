import { useGameStore } from "../stores/game-store";
import XShape from "../assets/x-shape.svg?react";
import HotkeyButton from "./HotkeyButton";
import Settings from "./Settings";
import HighScoreDisplay from "./HighScoreDisplay";
import HorizontalDivider from "../Divider";
import { LargeScreenButtons } from "./Header";

export default function MobileMenu() {
  const mutateGameState = useGameStore().mutateState;
  const showMobileMenu = useGameStore().showMobileMenu;

  return (
    <dialog
      open={showMobileMenu}
      className={
        showMobileMenu
          ? "absolute top-0 left-0 z-20 w-full h-full bg-theme text-theme border border-theme overflow-auto p-2"
          : ""
      }
    >
      <div className="flex">
        <LargeScreenButtons />
      </div>
      <HotkeyButton
        className="absolute top-2 right-2 h-6 border border-theme p-1"
        hotkeys={["Escape"]}
        onClick={() =>
          mutateGameState((state) => {
            state.showMobileMenu = false;
          })
        }
      >
        <XShape className="fill-theme h-full" />
      </HotkeyButton>
      <Settings />
      <HorizontalDivider extraStyles="h-[2px] my-2" />
      <HighScoreDisplay />
    </dialog>
  );
}
