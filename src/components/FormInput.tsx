import { HTMLInputTypeAttribute } from "react";

interface Props {
  title: string;
  id: string;
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: HTMLInputTypeAttribute;
}

export default function FormInput(props: Props) {
  return (
    <>
      <label htmlFor={props.id} className="text-theme">
        {props.title}
      </label>
      <input
        id={props.id}
        type={props.type}
        className="bg-theme border border-theme text-theme mt-0.5 mb-2 p-1 w-full"
        value={props.value}
        onChange={props.handleChange}
      ></input>
    </>
  );
}
