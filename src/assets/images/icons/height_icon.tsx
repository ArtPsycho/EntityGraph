import React from "react";

interface DefaultHeightIconProps {
  color?: string;
}

export const DefaultHeightIcon = ({
  color = 'var(--color-icon-primary)',
}:DefaultHeightIconProps) => (
<svg 
  width="32" 
  height="32" 
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M17.3332 9.32H21.3332L15.9998 4L10.6665 9.32H14.6665V22.68H10.6665L15.9998 28L21.3332 22.68H17.3332V9.32Z" fill={color}/>
</svg>
)