import React from "react"

interface DefaultChevronRightIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultChevronRightIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultChevronRightIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M9.70504 6L8.29504 7.41L12.875 12L8.29504 16.59L9.70504 18L15.705 12L9.70504 6Z" fill={color}/>
</svg>
)
