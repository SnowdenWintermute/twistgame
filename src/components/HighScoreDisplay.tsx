import { plainToInstance } from "class-transformer";
import { useEffect } from "react";
import { HighScoreManager } from "../high-score-manager";
import { useGameStore } from "../stores/game-store";
import cloneDeep from "lodash.clonedeep";
import HorizontalDivider from "../Divider";
import {
  JEWEL_COLOR_FILE_PATHS,
  JEWEL_ICON_SET_FOLDER_PATHS,
  JewelColor,
  JewelIconSet,
} from "../jewel/jewel-consts";
import { chooseRandomFromArray, iterateNumericEnum } from "../utils";

const randomFilePaths = iterateNumericEnum(JewelIconSet).map((iconSet, i) => {
  const randomFilePath = `${JEWEL_ICON_SET_FOLDER_PATHS[iconSet]}${JEWEL_COLOR_FILE_PATHS[chooseRandomFromArray(iterateNumericEnum(JewelColor))]}`;
  return randomFilePath;
});

export default function HighScoreDisplay() {
  const highScores = useGameStore().highScores;
  const allUnlocksAvailable = useGameStore().gameOptions.unlockAllSets;
  const sortedScores = cloneDeep(highScores).sort((a, b) => b.score - a.score);
  const mutateGameState = useGameStore().mutateState;

  useEffect(() => {
    const existingScoresManagerOption = localStorage.getItem("score-manager");
    if (existingScoresManagerOption) {
      const parsed = JSON.parse(existingScoresManagerOption);
      const scoreManager = plainToInstance(HighScoreManager, parsed);
      mutateGameState((state) => {
        state.highScores = scoreManager.scores;
      });
    }
  }, []);

  return (
    <div
      className="w-full border-2 border-theme p-2 flex "
      style={{ flex: "1 1 1px;" }}
    >
      <div className="w-1/2 max-w-1/2">
        <h3 className="text-xl text-theme">High Scores</h3>
        <HorizontalDivider extraStyles="h-[2px] bg-theme mb-2" />
        {highScores.length && (
          <table className="table-auto w-full border-collapse mb-4 ">
            <thead className="block min-h-0" style={{ flex: "1 1 1px;" }}>
              <tr className="border-b border-slate-400 font-bold">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody className="block min-h-0 overflow-y-auto">
              {sortedScores.map((entry) => (
                <tr
                  className="border-b border-slate-400"
                  key={entry.date}
                  style={{ flex: "1 1 1px;" }}
                >
                  <td className="px-4 py-2 max-w-[180px] whitespace-nowrap text-ellipsis overflow-hidden">
                    {entry.playerName}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!highScores.length && <div>None yet...</div>}
      </div>

      <div className="w-1/2">
        <h3 className="text-xl text-theme">Unlocked Themes</h3>
        <HorizontalDivider extraStyles="h-[2px] bg-theme mb-2" />
        <ul className="flex">
          {iterateNumericEnum(JewelIconSet).map((iconSet, i) => {
            const requiredTopScore = i * 200;
            const higestScoreOption = sortedScores[0];
            let requiredScoreMet = true;
            if (!higestScoreOption) requiredScoreMet = i === 0;
            else requiredScoreMet = higestScoreOption.score >= requiredTopScore;

            const isAvailable = allUnlocksAvailable || requiredScoreMet;

            return (
              <li className="relative mr-2 mb-2">
                <button
                  className="disabled:opacity-50"
                  disabled={!isAvailable}
                  onClick={() =>
                    mutateGameState((state) => {
                      state.gameOptions.selectedIconSet = iconSet;

                      localStorage.setItem(
                        "settings",
                        JSON.stringify(state.gameOptions)
                      );
                    })
                  }
                >
                  <img src={randomFilePaths[i]} className="h-10" />
                </button>

                {!isAvailable && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-theme">
                    {requiredTopScore}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
