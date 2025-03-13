export default function HorizontalDivider(props: { height: number }) {
  return (
    <div
      className={`h-[${props.height}px] w-full bg-light-background dark:bg-dark-background`}
    />
  );
}
