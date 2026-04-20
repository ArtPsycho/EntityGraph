import React from "react";

interface DefaultArrowDropDownIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultArrowDropDownIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultArrowDropDownIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M480-360 280-560h400L480-360Z"/>
</svg>
)