import React from "react"

interface DefaultArrowMenuCloseIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultArrowMenuCloseIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultArrowMenuCloseIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M440-280v-400L240-480l200 200Zm80 160h80v-720h-80v720Z"/>
</svg>
)