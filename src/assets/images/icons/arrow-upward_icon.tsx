import React from "react";

interface DefaultArrowUpwardIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultArrowUpwardIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultArrowUpwardIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/>
</svg>
)