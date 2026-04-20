import React from "react"

interface DefaultPlayArrowIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultPlayArrowIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultPlayArrowIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 8.64L13.77 12L8.5 15.36V8.64ZM6.5 5V19L17.5 12L6.5 5Z" fill={color}/>
</svg>
)