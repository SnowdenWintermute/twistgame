interface Props {
  type: "submit" | "button";
  title: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  extraStyles?: string;
}

export default function StyledButton(props: Props) {
  return (
    <button
      type={props.type}
      className={`border-[2px] border-theme text-theme-primary p-2 bg-theme-accent ${props.extraStyles} hover:opacity-90`}
      onClick={props.handleClick}
    >
      {props.title}
    </button>
  );
}
