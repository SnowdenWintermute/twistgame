import { useGameStore } from "../stores/game-store";
import { GAME_EVENT_TYPE_STRINGS } from "../game-event-manager";
import { gameSingletonHolder } from "../App";
import StyledCheckbox from "./StyledCheckbox";

function DebugDisplay() {
  const numJewels = useGameStore().numJewels;
  const numJewelsRemoved = useGameStore().numJewelsRemoved;
  const isGameOver = useGameStore().isGameOver;
  const currentlyProcessingEventType =
    useGameStore().currentlyProcessingEventType;
  const allIconSetsEnabled = useGameStore().gameOptions.unlockAllSets;
  const mutateGameState = useGameStore().mutateState;

  return (
    <div>
      <div style={{ padding: "2px" }}>Num Jewels: {numJewels}</div>
      <div style={{ padding: "2px" }}>
        Current event processing:{" "}
        {currentlyProcessingEventType !== null
          ? GAME_EVENT_TYPE_STRINGS[currentlyProcessingEventType]
          : "null"}
      </div>
      <div style={{ padding: "2px" }} className="text-blue">
        score: {numJewelsRemoved}
      </div>
      <div style={{ padding: "2px" }}>
        level: {gameSingletonHolder.game?.grid.getCurrentLevel()}
      </div>
      <div style={{ padding: "2px" }}>
        isGameOver: {isGameOver ? "true" : "false"}
      </div>
      <button
        onClick={() => {
          localStorage.clear();
        }}
      >
        Clear local storage
      </button>

      <StyledCheckbox
        title={"enable all icon sets"}
        value={allIconSetsEnabled}
        isChecked={allIconSetsEnabled}
        handleChange={() => {
          mutateGameState((state) => {
            state.gameOptions.unlockAllSets = !state.gameOptions.unlockAllSets;
            localStorage.setItem("settings", JSON.stringify(state.gameOptions));
          });
        }}
      />
    </div>
  );
}

export default DebugDisplay;
