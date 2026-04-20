import React from "react"

interface DefaultArrowMenuOpenIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultArrowMenuOpenIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultArrowMenuOpenIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z"/>
</svg>
)


