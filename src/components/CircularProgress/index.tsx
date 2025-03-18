import { useEffect, useRef, useState } from "react";

type Props = {
  thickness: number;
  percentage: number;
  rotateAnimation?: boolean;
};

export default function CircularProgress({
  thickness = 20,
  percentage,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [height, setHeight] = useState(1);

  useEffect(() => {
    if (svgRef.current?.clientHeight) setHeight(svgRef.current.clientHeight);
  }, [svgRef]);

  const radius = height / 2;
  const dashArray = 2 * Math.PI * radius;
  const percentHidden = 100 - percentage;
  const strokeDashoffset = (dashArray / 100) * percentHidden;
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`0 0 ${height} ${height}`}
      strokeDasharray={dashArray}
      strokeDashoffset={strokeDashoffset}
      strokeWidth={thickness}
      className={`h-full fill-none stroke-theme rounded-[50%]`}
    >
      <circle cx={radius} cy={radius} r={radius} />
    </svg>
  );
}
