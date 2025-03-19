import { useEffect } from "react";
import "./App.css";
import { ImageManager } from "./image-manager";
import {
  JEWEL_COLOR_FILE_PATHS,
  JEWEL_ICON_SET_FOLDER_PATHS,
  JEWEL_TYPE_INDICATOR_URLS,
} from "./jewel/jewel-consts";
import { TwistGame } from "./game";
import GameBoard from "./components/GameBoard";
import { enableMapSet } from "immer";
import { Theme, useGameStore } from "./stores/game-store";
import DebugDisplay from "./components/DebugDisplay";
import ScoreDisplay from "./components/ScoreDisplay";
import HotkeyButton from "./components/HotkeyButton";
import HighScoreDisplay from "./components/HighScoreDisplay";
import AttributionList from "./components/AttributionList";
import Header from "./components/Header";

// for immer to be able to use map and set
enableMapSet();

export const gameSingletonHolder: { game: null | TwistGame } = { game: null };
export const imageManager = new ImageManager();

function App() {
  const mutateGameState = useGameStore().mutateState;
  const showDebug = useGameStore().showDebug;
  const showAttributions = useGameStore().showAttributions;
  const theme = useGameStore().theme;
  const selectedIconSet = useGameStore().gameOptions.selectedIconSet;

  useEffect(() => {
    const localThemeSelection = localStorage.getItem("selectedTheme");
    if (localThemeSelection !== null)
      mutateGameState((state) => {
        state.theme = parseInt(localThemeSelection);
      });
  }, []);

  useEffect(() => {
    const jewelImageURLs: string[] = [];

    // for (const iconSet of iterateNumericEnum(JewelIconSet)) {
    //   Object.values(JEWEL_COLOR_FILE_PATHS).forEach((filePath) => {
    //     const iconFolderPath = JEWEL_ICON_SET_FOLDER_PATHS[selectedIconSet];
    //     jewelImageURLs.push(iconFolderPath + filePath);
    //   });
    // }
    Object.values(JEWEL_COLOR_FILE_PATHS).forEach((filePath) => {
      const iconFolderPath = JEWEL_ICON_SET_FOLDER_PATHS[selectedIconSet];
      jewelImageURLs.push(iconFolderPath + filePath);
    });

    const indicatorURLs = Object.values(JEWEL_TYPE_INDICATOR_URLS);
    const allURLs = jewelImageURLs.concat(indicatorURLs);

    function handleProgress(normalizedPercent: number) {
      mutateGameState((state) => {
        state.imageLoadingNormalizedPercent = normalizedPercent;
      });
    }

    // mutateGameState((state) => {
    //   state.loading = true;
    // });

    gameSingletonHolder.game?.stopGameLoop();
    imageManager.loadImages(
      allURLs,
      () => {
        console.log("load images completed");
        mutateGameState((state) => {
          state.loading = false;
        });
        gameSingletonHolder.game?.startGameLoop();
      },
      handleProgress
    );
  }, [selectedIconSet]);

  return (
    <div className={theme === Theme.Dark ? "dark" : "light"}>
      <div
        className={`h-screen max-h-screen text-theme bg-theme overflow-auto`}
      >
        <div className="flex justify-center">
          <div className="flex justify-center flex-col w-full max-w-[830px] max-sm:max-w-[500px] p-4 pt-0 max-sm:px-0">
            <Header />
            <div className="flex justify-center mb-2">
              <ScoreDisplay />
              <GameBoard />
            </div>
            <div className="max-md:hidden">
              <HighScoreDisplay />
            </div>
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
        <div className="absolute z-30 top-0 left-0 border border-theme p-2 bg-theme max-w-screen max-h-screen overflow-auto">
          <AttributionList />
        </div>
      )}
    </div>
  );
}

export default App;
