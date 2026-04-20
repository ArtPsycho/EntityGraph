import React from "react";

interface DefaultHeaderThemeSwitcherArrowDownProps {
  color?: string;
}

export const DefaultHeaderThemeSwitcherArrowDown = ({
  color = 'var(--color-icon-primary)',
}: DefaultHeaderThemeSwitcherArrowDownProps) => (
<svg 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M7 10L12 15L17 10H7Z" fill={color}/>
</svg>

)

