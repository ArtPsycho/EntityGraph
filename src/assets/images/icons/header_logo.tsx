import React from "react";

interface DefaultHeaderLogoIconProps {
  color?: string;
}

export const DefaultHeaderLogoIcon = ({
  color = 'var(--color-icon-primary)',
}: DefaultHeaderLogoIconProps) => (
<svg 
  width="40" 
  height="32" 
  viewBox="0 0 40 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<rect y="31" width="40" height="1" fill={color}/>
<path fillRule="evenodd" clipRule="evenodd" d="M0 0H30V30H0V21.96H15V18.96H0V11.04H15V8.04H0V0Z" fill={color}/>
</svg>
);