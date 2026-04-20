import React from "react";

interface DefaultMessageIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultMessageIcon = ({
  color = 'inherit',
  width,
  height,
}: DefaultMessageIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 40 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M33.3334 6.66663H6.66671C4.83337 6.66663 3.35004 8.16663 3.35004 9.99996L3.33337 30C3.33337 31.8333 4.83337 33.3333 6.66671 33.3333H33.3334C35.1667 33.3333 36.6667 31.8333 36.6667 30V9.99996C36.6667 8.16663 35.1667 6.66663 33.3334 6.66663ZM33.3334 30H6.66671V13.3333L20 21.6666L33.3334 13.3333V30ZM20 18.3333L6.66671 9.99996H33.3334L20 18.3333Z" fill={color}/>
</svg>
)
