import { Theme, useGameStore } from "../stores/game-store";
import CrescentMoon from "../assets/crescent-moon.svg?react";
import Sun from "../assets/sun.svg?react";

export default function ThemeSelectionButton() {
  const mutateGameState = useGameStore().mutateState;
  const theme = useGameStore().theme;

  return (
    <button
      className="flex h-10 w-10 justify-center p-1"
      onClick={() => {
        mutateGameState((state) => {
          if (state.theme === Theme.Light) state.theme = Theme.Dark;
          else state.theme = Theme.Light;
          localStorage.setItem("selectedTheme", state.theme.toString());
        });
      }}
    >
      {theme === Theme.Dark ? (
        <Sun className="fill-theme h-full" aria-label="Select light theme" />
      ) : (
        <CrescentMoon
          className="fill-theme h-full"
          aria-label="Select dark theme"
        />
      )}
    </button>
  );
}
