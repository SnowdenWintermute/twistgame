interface Props {
  title: string;
  value: any;
  isChecked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StyledCheckbox(props: Props) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          className="mr-1"
          checked={props.isChecked}
          value={props.value}
          onChange={props.handleChange}
        />
        {props.title}
      </label>
    </div>
  );
}
