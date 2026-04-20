import React from "react";

interface DefaultSuccessIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultSuccessIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultSuccessIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M8.80001 15.8998L4.60001 11.6998L3.20001 13.0998L8.80001 18.6998L20.8 6.6998L19.4 5.2998L8.80001 15.8998Z" fill={color}/>
</svg>
)


