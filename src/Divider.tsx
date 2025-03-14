export default function HorizontalDivider(props: { extraStyles?: string }) {
  return (
    <div
      className={`${props.extraStyles} w-full bg-light-text dark:bg-dark-text`}
    />
  );
}
