import { useEffect } from "react";
import "./App.css";
import { ImageManager } from "./image-manager";
import {
  JEWEL_COLOR_FILE_PATHS,
  JEWEL_ICON_SET_FOLDER_PATHS,
  JEWEL_TYPE_INDICATOR_URLS,
  JewelIconSet,
} from "./jewel/jewel-consts";
import { TwistGame } from "./game";
import GameBoard from "./components/GameBoard";
import { enableMapSet } from "immer";
import { Theme, useGameStore } from "./stores/game-store";
import DebugDisplay from "./components/DebugDisplay";
import HorizontalDivider from "./Divider";
import ScoreDisplay from "./components/ScoreDisplay";
import ThemeSelectionButton from "./components/ThemeSelectionButton";
import HotkeyButton from "./components/HotkeyButton";
import HighScoreDisplay from "./components/HighScoreDisplay";
import { iterateNumericEnum } from "./utils";
import AttributionList from "./components/AttributionList";

// for immer to be able to use map and set
enableMapSet();

export const gameSingletonHolder: { game: null | TwistGame } = { game: null };
export const imageManager = new ImageManager();

function App() {
  const mutateGameState = useGameStore().mutateState;
  const showDebug = useGameStore().showDebug;
  const showAttributions = useGameStore().showAttributions;
  const theme = useGameStore().theme;

  useEffect(() => {
    const localThemeSelection = localStorage.getItem("selectedTheme");
    if (localThemeSelection !== null)
      mutateGameState((state) => {
        console.log("setting theme to:", state.theme);
        state.theme = parseInt(localThemeSelection);
      });
  }, []);

  useEffect(() => {
    const jewelImageURLs: string[] = [];

    for (const iconSet of iterateNumericEnum(JewelIconSet)) {
      Object.values(JEWEL_COLOR_FILE_PATHS).forEach((filePath) => {
        const iconFolderPath = JEWEL_ICON_SET_FOLDER_PATHS[iconSet];
        jewelImageURLs.push(iconFolderPath + filePath);
      });
    }

    const indicatorURLs = Object.values(JEWEL_TYPE_INDICATOR_URLS);
    const allURLs = jewelImageURLs.concat(indicatorURLs);
    imageManager.loadImages(allURLs, () => {
      mutateGameState((state) => {
        state.loading = false;
      });
    });
  }, []);

  return (
    <div className={theme === Theme.Dark ? "dark" : "light"}>
      <div
        className={`h-screen max-h-screen text-theme bg-theme overflow-auto`}
      >
        <div className="p-4 flex flex-col items-center justify-center relative w-full">
          <HorizontalDivider extraStyles="h-[4px]" />
          <div>
            <HotkeyButton
              onClick={() => {
                mutateGameState((state) => {
                  state.showAttributions = !state.showAttributions;
                });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              {showDebug ? "hide" : "show"} attributions
            </HotkeyButton>
            <h1 className="text-theme text-3xl font-bold pt-2 pb-2">
              twistgame (title TBD)
            </h1>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-theme flex">
              <ThemeSelectionButton />
            </div>
          </div>
          <HorizontalDivider extraStyles={"h-[4px]"} />
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center flex-col w-full max-w-[830px] p-4 pt-0">
            <div className="flex justify-center mb-2">
              <ScoreDisplay />
              <GameBoard />
            </div>
            <HighScoreDisplay />
          </div>
        </div>
        <div className="hidden">
          <HotkeyButton
            onClick={() => {
              mutateGameState((state) => {
                state.showDebug = !state.showDebug;
              });
            }}
            className="border border-theme text-lg p-2"
            hotkeys={["KeyP"]}
          >
            {showDebug ? "hide" : "show"} debug
          </HotkeyButton>
        </div>

        {showDebug && <DebugDisplay />}
      </div>
      {showAttributions && (
        <div className="absolute top-0 left-0 border border-theme p-2 bg-theme">
          <AttributionList />
        </div>
      )}
    </div>
  );
}

export default App;
