import { JEWEL_TYPE_TIPS } from "../jewel/jewel-consts";
import { useGameStore } from "../stores/game-store";
import GearIcon from "../assets/settings-icon.svg?react";
import StyledCheckbox from "./StyledCheckbox";
import SettingsDialog from "./SettingsDialog";
import { getNextLevelRequiredPoints } from "../grid";

export default function ScoreDisplay() {
  const loading = useGameStore().loading;
  const numJewelsRemoved = useGameStore().numJewelsRemoved;
  const currentLevel = useGameStore().currentLevel;
  const jewelTypesToDescribe = useGameStore().jewelTypesToDescribe;
  const showTips = useGameStore((state) => state.gameOptions.showTips);
  const mutateGameState = useGameStore().mutateState;

  return (
    <div className="w-72 max-md:hidden border-[3px] border-theme mr-2 p-2 pt-4 relative flex flex-col justify-between">
      <SettingsDialog />
      <button
        className="absolute top-2 right-2 h-6"
        onClick={() =>
          mutateGameState((state) => {
            state.viewingSettings = !state.viewingSettings;
          })
        }
      >
        <GearIcon className="fill-theme h-full" />
      </button>
      <div>
        {!loading && (
          <>
            <h3 className="text-2xl text-center">Score</h3>
            <h3 className="text-2xl text-center">
              {numJewelsRemoved} /{" "}
              {getNextLevelRequiredPoints(numJewelsRemoved)}
            </h3>
            <h3 className="text-2xl text-center">Level</h3>
            <h3 className="text-2xl text-center">{currentLevel}</h3>
          </>
        )}
        {showTips && (
          <ul>
            {jewelTypesToDescribe.map((jewelType) => (
              <li key={jewelType}>{JEWEL_TYPE_TIPS[jewelType]}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-end">
        <StyledCheckbox
          title={"Hide tips"}
          isChecked={!showTips}
          value={!showTips}
          handleChange={() => {
            mutateGameState((state) => {
              state.gameOptions.showTips = !state.gameOptions.showTips;
              console.log("set show tips to", state.gameOptions.showTips);
              localStorage.setItem(
                "settings",
                JSON.stringify(state.gameOptions)
              );
            });
          }}
        />
        <button
          className="border border-theme p-2"
          onClick={() => {
            mutateGameState((state) => {
              state.showResetGameDialog = !state.showResetGameDialog;
            });
          }}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
