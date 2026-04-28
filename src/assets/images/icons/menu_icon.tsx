import React from "react";

interface DefaultMenuIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultMenuIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultMenuIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
</svg>
)