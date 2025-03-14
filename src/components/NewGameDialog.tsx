import { FormEvent, useState } from "react";
import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";
import FormInput from "./FormInput";
import HotkeyButton from "./HotkeyButton";
import HorizontalDivider from "../Divider";
import { plainToInstance } from "class-transformer";
import { HighScoreManager } from "../high-score-manager";

export default function NewGameDialog() {
  const mutateGameState = useGameStore().mutateState;
  const isGameOver = useGameStore().isGameOver;
  const [playerName, setPlayerName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { game } = gameSingletonHolder;
    const existingScoresManagerOption = localStorage.getItem("score-manager");
    let scoreManager: HighScoreManager;
    if (existingScoresManagerOption) {
      const parsed = JSON.parse(existingScoresManagerOption);
      scoreManager = plainToInstance(HighScoreManager, parsed);
    } else {
      scoreManager = new HighScoreManager();
    }
    scoreManager.updateList(
      playerName,
      useGameStore.getState().numJewelsRemoved
    );

    localStorage.setItem("score-manager", JSON.stringify(scoreManager));

    mutateGameState((state) => {
      state.highScores = scoreManager.scores;
    });

    if (game !== null) game.reset();
  }

  return (
    <dialog
      open={isGameOver}
      className={
        isGameOver
          ? "absolute top-0 left-0 z-10 w-full h-full bg-transparent flex justify-center items-center"
          : ""
      }
    >
      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-50" />
      <div className="absolute bg-theme p-4 border-[4px] border-theme flex justify-center flex-col">
        <h3 className="text-2xl mb-2 text-theme w-full text-center">
          GAME OVER !!!
        </h3>
        <form onSubmit={handleSubmit}>
          <FormInput
            title={"Enter your name to save your high score"}
            id={"player-name"}
            value={playerName}
            handleChange={(e) => setPlayerName(e.target.value)}
            type={"text"}
          />
          <HorizontalDivider extraStyles="h-[1px] mb-3 mt-1" />
          <HotkeyButton
            className="border-[2px] border-theme text-theme-primary p-2 bg-theme-accent hover:opacity-90 w-full"
            hotkeys={["Enter"]}
            buttonType="submit"
            onClick={() => {}}
          >
            Play Again
          </HotkeyButton>
        </form>
      </div>
    </dialog>
  );
}
