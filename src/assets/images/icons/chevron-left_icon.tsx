import React from "react"

interface DefaultChevronLeftIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultChevronLeftIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultChevronLeftIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M15.705 7.41L14.295 6L8.29504 12L14.295 18L15.705 16.59L11.125 12L15.705 7.41Z" fill={color}/>
</svg>
)