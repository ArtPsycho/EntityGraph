import React from "react"

interface DefaultDeleteIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultDeleteIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultDeleteIconProps) => (
<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  width={width}
  height={height}
  strokeWidth="1"
  transform="rotate(0) matrix(1 0 0 1 0 0)">
<path d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z" fill={color}/>
</svg>
)
