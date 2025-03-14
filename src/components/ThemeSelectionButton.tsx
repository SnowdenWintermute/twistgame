import { Theme, useGameStore } from "../stores/game-store";

export default function ThemeSelectionButton() {
  const mutateGameState = useGameStore().mutateState;
  const theme = useGameStore().theme;

  return (
    <button
      onClick={() => {
        mutateGameState((state) => {
          if (state.theme === Theme.Light) state.theme = Theme.Dark;
          else state.theme = Theme.Light;
          console.log("setting theme to ", state.theme.toString());
          localStorage.setItem("selectedTheme", state.theme.toString());
        });
      }}
    >
      Theme: {theme === Theme.Dark ? "Dark" : "Light"}
    </button>
  );
}
