import { useEffect } from "react";
import "./App.css";
import { ImageManager } from "./image-manager";
import {
  JEWEL_COLOR_URLS,
  JEWEL_TYPE_INDICATOR_URLS,
  JEWEL_TYPE_TIPS,
} from "./jewel/jewel-consts";
import { TwistGame } from "./game";
import GameBoard from "./GameBoard";
import { enableMapSet } from "immer";
import { Theme, useGameStore } from "./stores/game-store";
import DebugDisplay from "./components/DebugDisplay";
import HorizontalDivider from "./Divider";

// for immer to be able to use map and set
enableMapSet();

export const gameSingletonHolder: { game: null | TwistGame } = { game: null };
export const imageManager = new ImageManager();

function App() {
  const mutateGameState = useGameStore().mutateState;
  const showDebug = useGameStore().showDebug;
  const numJewelsRemoved = useGameStore().numJewelsRemoved;
  const currentLevel = useGameStore().currentLevel;
  const theme = useGameStore().theme;
  const jewelTypesToDescribe = useGameStore().jewelTypesToDescribe;

  useEffect(() => {
    const localThemeSelection = localStorage.getItem("selectedTheme");
    if (localThemeSelection !== null)
      mutateGameState((state) => {
        console.log("setting theme to:", state.theme);
        state.theme = parseInt(localThemeSelection);
      });
  }, []);

  useEffect(() => {
    const jewelImageURLs = Object.values(JEWEL_COLOR_URLS);
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
      <div className={`h-screen text-theme bg-theme`}>
        <div className="p-4 flex flex-col items-center justify-center relative w-full">
          <HorizontalDivider extraStyles="h-[4px]" />
          <div>
            <h1 className="text-theme text-3xl font-bold pt-2 pb-2">
              twistgame (title TBD)
            </h1>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-theme">
              <button
                onClick={() => {
                  mutateGameState((state) => {
                    if (state.theme === Theme.Light) state.theme = Theme.Dark;
                    else state.theme = Theme.Light;
                    console.log("setting theme to ", state.theme.toString());
                    localStorage.setItem(
                      "selectedTheme",
                      state.theme.toString()
                    );
                  });
                }}
              >
                Theme: {theme === Theme.Dark ? "Dark" : "Light"}
              </button>
            </div>
          </div>
          <HorizontalDivider extraStyles={"h-[4px]"} />
        </div>
        <div className="flex justify-center">
          <div className="flex justify-center w-full max-w-[1080px] p-4 pt-0">
            <div className="w-72 border-[3px] border-theme mr-2 p-2 pt-4">
              <h3 className="text-2xl text-center">Score</h3>
              <h3 className="text-2xl text-center">{numJewelsRemoved}</h3>
              <h3 className="text-2xl text-center">Level</h3>
              <h3 className="text-2xl text-center">{currentLevel}</h3>
              <ul>
                {jewelTypesToDescribe.map((jewelType) => (
                  <li key={jewelType}>{JEWEL_TYPE_TIPS[jewelType]}</li>
                ))}
              </ul>
            </div>
            <GameBoard />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={() => {
              mutateGameState((state) => {
                state.showDebug = !state.showDebug;
              });
            }}
            className="border border-theme text-lg p-2"
          >
            {showDebug ? "hide" : "show"} debug
          </button>
        </div>

        {showDebug && <DebugDisplay />}
      </div>
    </div>
  );
}

export default App;
