import React from "react";

interface DefaultRightArrowIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultRightArrowIcon = ({
  color = 'var(--color-icon-white)',
  width,
  height,
}:DefaultRightArrowIconProps) => (

<svg 
  width={width}
  height={height}
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M16 5.33301L14.12 7.21301L21.56 14.6663H5.33337V17.333H21.56L14.12 24.7863L16 26.6663L26.6667 15.9997L16 5.33301Z" fill={color}/>
</svg>
)