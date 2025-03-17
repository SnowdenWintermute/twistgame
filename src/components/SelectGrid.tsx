import { useEffect, useRef, useState } from "react";
import { gameSingletonHolder } from "../App";
import "../App.css";
import {
  DISABLED_FLASH_TIMEOUT_DURATION,
  SELECT_GRID_SIZE,
} from "../app-consts";
import { QuartetRotationGameEvent } from "../game-event-manager/jewel-rotation";
import { JewelQuartet } from "../jewel-quartet";
import SelectCircle from "../assets/selection-circle.svg?react";
import { Point } from "../types";
import { useGameStore } from "../stores/game-store";
import { JewelType } from "../jewel/jewel-consts";

interface SelectBoxProps {
  x: number;
  y: number;
}
export function SelectBox(selectBoxProps: SelectBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [flashingDisabled, setFlashingDisabled] = useState(false);
  const flashingDisabledTimeoutRef = useRef<number>(null);
  const mutateGameState = useGameStore().mutateState;
  const jewelDiameter = useGameStore().jewelDiameter;

  const quartet = new JewelQuartet(
    new Point(selectBoxProps.x, selectBoxProps.y)
  );

  useEffect(() => {
    return () => {
      if (flashingDisabledTimeoutRef.current) {
        clearTimeout(flashingDisabledTimeoutRef.current);
      }
    };
  }, []);

  function handleMouseLeave() {
    if (!gameSingletonHolder.game) return console.log("no game");
    const { grid } = gameSingletonHolder.game;
    setIsHovered(false);
    grid.deselectAllJewels();

    mutateGameState((state) => {
      state.jewelTypesToDescribe = [];
    });
  }

  function handleMouseEnter() {
    if (!gameSingletonHolder.game) return;
    const { grid } = gameSingletonHolder.game;
    quartet.selectJewels(grid);
    setIsHovered(true);
    const jewels = quartet.getJewels(grid);
    const typesDescribed: JewelType[] = [];
    for (const jewel of jewels) {
      if (typesDescribed.includes(jewel.jewelType)) continue;
      typesDescribed.push(jewel.jewelType);
    }
    mutateGameState((state) => {
      state.jewelTypesToDescribe = typesDescribed;
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!gameSingletonHolder.game) return;
    const { grid, gameEventManager } = gameSingletonHolder.game;
    if (e.button !== 0) return;
    const clickIsForbidden =
      useGameStore.getState().isGameOver ||
      gameEventManager.isProcessing() ||
      !quartet.isRotatable(grid);

    if (clickIsForbidden) {
      if (flashingDisabledTimeoutRef.current)
        clearTimeout(flashingDisabledTimeoutRef.current);
      setFlashingDisabled(true);
      flashingDisabledTimeoutRef.current = setTimeout(() => {
        setFlashingDisabled(false);
      }, DISABLED_FLASH_TIMEOUT_DURATION);
      return;
    }

    gameEventManager.addEvent(
      new QuartetRotationGameEvent(quartet, gameSingletonHolder.game)
    );
  }

  return (
    <button
      className="relative"
      style={{
        height: jewelDiameter,
        width: jewelDiameter,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {isHovered && (
        <div>
          <div className="selection-circle-container">
            <SelectCircle
              className={`selection-circle-svg ${flashingDisabled ? "fill-red-500" : "fill-grey-200 dark:fill-white"}`}
            />
          </div>
          <div className="selection-circle-container">
            <SelectCircle
              className="selection-circle-svg"
              style={{ zIndex: 10 }}
            />
          </div>
        </div>
      )}
    </button>
  );
}

export function SelectGrid() {
  const jewelDiameter = useGameStore().jewelDiameter;

  const rows = [];
  for (let i = 0; i < SELECT_GRID_SIZE.COLUMNS; i = i + 1) {
    const column = [];
    for (let j = 0; j < SELECT_GRID_SIZE.ROWS; j = j + 1) {
      column.push(<SelectBox x={j} y={i} key={i + j} />);
    }
    rows.push(
      <div className="flex " key={i}>
        {column}
      </div>
    );
  }
  return (
    <div
      className="absolute flex flex-col"
      style={{ top: jewelDiameter / 2, left: jewelDiameter / 2 }}
    >
      {rows}
    </div>
  );
}
