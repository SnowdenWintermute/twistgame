import HotkeyButton from "./HotkeyButton";
import { useGameStore } from "../stores/game-store";
import HorizontalDivider from "../Divider";
import ThemeSelectionButton from "./ThemeSelectionButton";
import AttributionIcon from "../assets/quotes.svg?react";
import HamburgerIcon from "../assets/hamburger-menu.svg?react";
import { getNextLevelRequiredPoints } from "../grid";

export default function Header() {
  return (
    <div className="py-4 flex flex-col items-center justify-center relative w-full">
      <HorizontalDivider extraStyles="h-[4px] max-sm:hidden" />
      <div className="flex justify-between items-center w-full px-4">
        <h1 className="text-theme text-3xl font-bold pt-2 pb-2 max-sm:hidden">
          Four Body Problem
        </h1>
        <div className="md:hidden">
          <MobileScoreView />
        </div>

        <div className="flex max-md:hidden">
          <LargeScreenButtons />
        </div>
        <SmallScreenButton />
      </div>
      <HorizontalDivider extraStyles="h-[4px] max-sm:hidden" />
    </div>
  );
}

export function LargeScreenButtons() {
  const mutateGameState = useGameStore().mutateState;
  return (
    <>
      <HotkeyButton
        onClick={() => {
          mutateGameState((state) => {
            state.showAttributions = !state.showAttributions;
          });
        }}
        className="mr-2"
      >
        <div className="h-8">
          <AttributionIcon className="fill-theme h-full" />
        </div>
      </HotkeyButton>
      <div className="">
        <ThemeSelectionButton />
      </div>
    </>
  );
}

function SmallScreenButton() {
  const mutateGameState = useGameStore().mutateState;

  function handleClick() {
    mutateGameState((state) => {
      state.showMobileMenu = !state.showMobileMenu;
    });
  }

  return (
    <div className="flex md:hidden">
      <button className="h-8" onClick={handleClick}>
        <HamburgerIcon className="h-full fill-theme" />
      </button>
    </div>
  );
}

function MobileScoreView() {
  const numJewelsRemoved = useGameStore().numJewelsRemoved;
  const currentLevel = useGameStore().currentLevel;
  return (
    <div className="flex text-lg">
      <div className="mr-2">
        Score: {numJewelsRemoved}/{getNextLevelRequiredPoints(numJewelsRemoved)}
      </div>
      <div>Level: {currentLevel}</div>
    </div>
  );
}
