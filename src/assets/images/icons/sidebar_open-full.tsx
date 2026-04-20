import React from "react";

interface DefaultOpenFullIconProps {
  color?: string;
}

export const DefaultOpenFullIcon = ({
  color = 'var(--color-icon-primary)',
}: DefaultOpenFullIconProps) => (
<svg 
  width="32" 
  height="32" 
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M14.6667 4H4L4 14.6667L8.38667 10.28L21.72 23.6133L17.3333 28H28V17.3333L23.6133 21.72L10.28 8.38667L14.6667 4Z" fill={color}/>
</svg>
)