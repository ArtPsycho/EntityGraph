import React from "react";

interface DefaultArrowDownwardIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultArrowDownwardIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultArrowDownwardIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/>
</svg>
)