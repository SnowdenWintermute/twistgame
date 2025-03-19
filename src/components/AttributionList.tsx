import XShape from "../assets/x-shape.svg?react";
import HorizontalDivider from "../Divider";
import { useGameStore } from "../stores/game-store";
import HotkeyButton from "./HotkeyButton";

const ARTISTS: Record<string, string> = {
  ["Digitalnomadicons"]: "https://www.svgrepo.com/author/digitalnomadicons/", //digitalnomad
  ["Bypeople"]: "https://www.svgrepo.com/author/ByPeople/", //animals
  ["Maddy Margulis"]: "https://www.svgrepo.com/author/Maddy%20Margulis/", //landscapes
  ["SVGRepo"]: "https://www.svgrepo.com/", // foods
  ["Romabedon"]: "https://www.svgrepo.com/author/Romabedon/", // summer vacation
  ["rrgraph"]: "https://www.svgrepo.com/author/rrgraph/", // abstract flowers
};

export default function AttributionList() {
  const mutateGameState = useGameStore().mutateState;
  return (
    <div className="text-theme bg-theme p-2">
      <HotkeyButton
        className="absolute top-2 z-30 right-2 h-6 border border-theme p-1"
        hotkeys={["Escape"]}
        onClick={() =>
          mutateGameState((state) => {
            state.showAttributions = !state.showAttributions;
          })
        }
      >
        <XShape className="fill-theme h-full" />
      </HotkeyButton>

      <h3 className="text-lg">Icons By:</h3>
      <ul>
        {Object.entries(ARTISTS).map(([name, website]) => (
          <li key={name} className="flex justify-between">
            <a className="" href={website}>
              {name}
            </a>
          </li>
        ))}
      </ul>
      <HorizontalDivider extraStyles="h-[1px] bg-theme my-2" />
      <h3 className="text-lg">Programming by Sandy and Mike</h3>
      <h3 className="text-lg">Expert consulting by Sandy</h3>
      <HorizontalDivider extraStyles="h-[1px] bg-theme my-2" />
      <p>
        Play more games at
        <span>
          {" "}
          <a href="https://mikesilverman.net" className="underline">
            https://mikesilverman.net
          </a>
        </span>
      </p>
    </div>
  );
}
