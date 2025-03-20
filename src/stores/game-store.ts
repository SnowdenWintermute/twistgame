import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { immerable, produce } from "immer";
import { MutateState } from "./mutate-state";
import { GameEventType } from "../game-event-manager";
import { userOSIsSetToDarkMode } from "../utils";
import { JewelType } from "../jewel/jewel-consts";
import { GameOptions } from "../game-options";
import { plainToInstance } from "class-transformer";
import { HighScoreEntry } from "../high-score-manager";
import { Dimensions } from "../grid";

export enum Theme {
  Dark,
  Light,
}

export class GameState {
  [immerable] = true;
  loading: boolean = true;
  numJewels: number = 0;
  numJewelsRemoved: number = 0;
  isGameOver: boolean = false;
  currentlyProcessingEventType: null | GameEventType = null;
  showDebug: boolean = false;
  showAttributions: boolean = false;
  currentLevel: number = 0;
  theme: Theme = userOSIsSetToDarkMode() ? Theme.Dark : Theme.Light;
  jewelTypesToDescribe: JewelType[] = [];
  viewingSettings: boolean = false;
  gameOptions: GameOptions;
  highScores: HighScoreEntry[] = [];
  canvasSize: Dimensions = new Dimensions(0, 0);
  jewelDiameter: number = 0;
  imageLoadingNormalizedPercent: number = 0;
  showMobileMenu: boolean = false;
  showResetGameDialog: boolean = false;

  constructor(
    public mutateState: MutateState<GameState>,
    public get: () => GameState
  ) {
    const savedGameOptions = localStorage.getItem("settings");
    if (savedGameOptions) {
      const parsed = JSON.parse(savedGameOptions);
      const asClass = plainToInstance(GameOptions, parsed);
      this.gameOptions = asClass;
    } else {
      this.gameOptions = new GameOptions();
    }
  }
}

export const useGameStore = create<GameState>()(
  immer(
    devtools(
      (set, get) =>
        new GameState(
          (fn: (state: GameState) => void) => set(produce(fn)),
          get
        ),
      {
        enabled: true,
        name: "game store",
      }
    )
  )
);
