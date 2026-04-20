import React from "react";

interface DefaultLeftArrowIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultLeftArrowIcon = ({
  color = 'var(--color-icon-white)',
  width,
  height,
}:DefaultLeftArrowIconProps) => (

<svg 
  width={width}
  height={height}
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M16 26.667L17.88 24.787L10.44 17.3337H26.6666V14.667L10.44 14.667L17.88 7.21366L16 5.33366L5.33329 16.0003L16 26.667Z" fill={color}/>
</svg>

)
