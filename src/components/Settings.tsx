import { FormEvent, useEffect, useState } from "react";
import { gameSingletonHolder } from "../App";
import { useGameStore } from "../stores/game-store";
import XShape from "../assets/x-shape.svg?react";
import HorizontalDivider from "../Divider";
import HotkeyButton from "./HotkeyButton";
import FormInput from "./FormInput";
import {
  ROTATION_ANIMATION_DURATION,
  TIME_TO_TRANSLATE_ONE_PIXEL,
} from "../app-consts";
import StyledButton from "./StyledButton";
import {
  enumAsBooleanRecord,
  iterateNumericEnum,
  iterateNumericEnumKeyedRecord,
} from "../utils";
import {
  JEWEL_COLOR_NAME_STRINGS,
  JEWEL_TYPE_STRINGS,
  JewelColor,
  JewelType,
} from "../jewel/jewel-consts";
import StyledCheckbox from "./StyledCheckbox";
import { GameOptions } from "../game-options";

export default function Settings() {
  const viewingSettings = useGameStore().viewingSettings;
  const mutateGameState = useGameStore().mutateState;
  const rotationAnimationDuration = useGameStore(
    (state) => state.gameOptions.rotationAnimationDuration
  );
  const translationSpeed = useGameStore(
    (state) => state.gameOptions.translationSpeed
  );
  const allowedColors = useGameStore(
    (state) => state.gameOptions.allowedColors
  );
  const allowedJewelTypes = useGameStore(
    (state) => state.gameOptions.allowedTypes
  );

  const [newRotationAnimationDuration, setNewRotationAnimationDuration] =
    useState(rotationAnimationDuration);
  const [newTranslationSpeed, setNewTranslationSpeed] =
    useState(translationSpeed);
  const [newAllowedColors, setNewAllowedColors] = useState(
    enumAsBooleanRecord(allowedColors)
  );
  const [newAllowedJewelTypes, setNewAllowedJewelTypes] = useState(
    enumAsBooleanRecord(allowedJewelTypes)
  );

  useEffect(() => {
    const { game } = gameSingletonHolder;
    if (!game) return;

    if (viewingSettings) game.stopGameLoop();
    else game.startGameLoop();

    return () => {
      game.startGameLoop();
    };
  }, [viewingSettings]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutateGameState((state) => {
      state.gameOptions.rotationAnimationDuration =
        newRotationAnimationDuration;
      state.gameOptions.translationSpeed = newTranslationSpeed;

      state.gameOptions.allowedColors = iterateNumericEnumKeyedRecord(
        newAllowedColors
      )
        .filter(([_, isAllowed]) => isAllowed)
        .map(([item, _]) => item);

      state.gameOptions.allowedTypes = iterateNumericEnumKeyedRecord(
        newAllowedJewelTypes
      )
        .filter(([_, isAllowed]) => isAllowed)
        .map(([item, _]) => item);

      state.viewingSettings = false;
      localStorage.setItem("settings", JSON.stringify(state.gameOptions));
    });
  }

  function resetToDefaults() {
    setNewRotationAnimationDuration(ROTATION_ANIMATION_DURATION);
    setNewTranslationSpeed(TIME_TO_TRANSLATE_ONE_PIXEL);
    setNewAllowedColors(enumAsBooleanRecord(new GameOptions().allowedColors));
    setNewAllowedJewelTypes(
      enumAsBooleanRecord(new GameOptions().allowedTypes)
    );

    mutateGameState((state) => {
      state.gameOptions = new GameOptions();
    });
    localStorage.removeItem("settings");
  }

  const colorOptions = iterateNumericEnum(JewelColor).filter(
    (color) => color !== JewelColor.Rock
  );

  const jewelTypeOptions = iterateNumericEnum(JewelType).filter(
    (item) =>
      ![
        JewelType.Normal,
        JewelType.MarkedLocked,
        JewelType.Fire,
        JewelType.Lightning,
      ].includes(item)
  );

  function handleColorCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
    const asInt = parseInt(e.target.value);
    const asColor = asInt as JewelColor;
    setNewAllowedColors({
      ...newAllowedColors,
      [asColor]: !newAllowedColors[asColor],
    });
  }

  function handleJewelTypeCheckboxClick(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const asInt = parseInt(e.target.value);
    const asJewelType = asInt as JewelType;
    setNewAllowedJewelTypes({
      ...newAllowedJewelTypes,
      [asJewelType]: !newAllowedJewelTypes[asJewelType],
    });
  }

  return (
    <dialog
      open={viewingSettings}
      className="absolute top-0 left-0 z-10 text-theme bg-theme border-theme p-4 w-full h-full max-h-full overflow-auto"
    >
      <HotkeyButton
        className="absolute top-2 right-2 h-6 border border-theme p-1"
        hotkeys={["Escape"]}
        disabled={!viewingSettings}
        onClick={() =>
          mutateGameState((state) => {
            state.viewingSettings = !state.viewingSettings;
          })
        }
      >
        <XShape className="fill-theme h-full" />
      </HotkeyButton>
      <h3 className="text-2xl text-center">Settings</h3>
      <HorizontalDivider extraStyles="h-[1px] mt-2 mb-2" />
      <form onSubmit={handleSubmit}>
        <FormInput
          id="orbit-speed"
          type="number"
          title="Orbit Animation Speed (Ms)"
          value={newRotationAnimationDuration}
          handleChange={(e) => {
            setNewRotationAnimationDuration(parseInt(e.target.value));
          }}
        />
        <FormInput
          id="translation-speed"
          type="number"
          title="Translation Speed (Ms)"
          value={newTranslationSpeed}
          handleChange={(e) => {
            setNewTranslationSpeed(parseInt(e.target.value));
          }}
        />
        <HorizontalDivider extraStyles="h-[1px] mt-2 mb-2" />
        <h4 className="text-theme mb-1">Allowed Refill Colors</h4>
        <div className="flex justify-between mb-1">
          <ul className="">
            {colorOptions.slice(0, colorOptions.length / 2 + 1).map((color) => (
              <StyledCheckbox
                key={color}
                title={JEWEL_COLOR_NAME_STRINGS[color]}
                value={color}
                isChecked={!!newAllowedColors[color]}
                handleChange={handleColorCheckboxClick}
              />
            ))}
          </ul>
          <ul className="">
            {colorOptions
              .slice(colorOptions.length / 2 + 1, colorOptions.length)
              .map((color) => (
                <StyledCheckbox
                  key={color}
                  title={JEWEL_COLOR_NAME_STRINGS[color]}
                  isChecked={!!newAllowedColors[color]}
                  value={color}
                  handleChange={handleColorCheckboxClick}
                />
              ))}
          </ul>
        </div>
        <h4 className="text-theme mb-1">Allowed Types</h4>
        <div className="flex justify-between mb-1">
          <ul className="">
            {jewelTypeOptions
              .slice(0, jewelTypeOptions.length / 2 + 1)
              .map((jewelType) => (
                <StyledCheckbox
                  key={jewelType}
                  title={JEWEL_TYPE_STRINGS[jewelType]}
                  value={jewelType}
                  isChecked={!!newAllowedJewelTypes[jewelType]}
                  handleChange={handleJewelTypeCheckboxClick}
                />
              ))}
          </ul>
          <ul className="">
            {jewelTypeOptions
              .slice(jewelTypeOptions.length / 2 + 1, jewelTypeOptions.length)
              .map((jewelType) => (
                <StyledCheckbox
                  key={jewelType}
                  title={JEWEL_TYPE_STRINGS[jewelType]}
                  isChecked={!!newAllowedJewelTypes[jewelType]}
                  value={jewelType}
                  handleChange={handleJewelTypeCheckboxClick}
                />
              ))}
          </ul>
        </div>

        <div className="flex justify-between">
          <StyledButton
            type="button"
            title="Reset"
            handleClick={resetToDefaults}
            extraStyles="w-1/2 mr-1"
          />

          <StyledButton type="submit" title="Apply" extraStyles="w-1/2 mr-l" />
        </div>
      </form>
    </dialog>
  );
}
