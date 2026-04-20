import React from "react";

interface DefaultOccupationIconProps {
  color?: string;
}

export const DefaultOccupationIcon = ({
  color = 'var(--color-icon-primary)',
}:DefaultOccupationIconProps) => (
<svg 
  width="32" 
  height="32" 
  viewBox="0 0 32 32" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M18.6665 8.66634V5.99967H13.3332V8.66634H18.6665ZM5.33317 11.333V25.9997H26.6665V11.333H5.33317ZM26.6665 8.66634C28.1465 8.66634 29.3332 9.85301 29.3332 11.333V25.9997C29.3332 27.4797 28.1465 28.6663 26.6665 28.6663H5.33317C3.85317 28.6663 2.6665 27.4797 2.6665 25.9997L2.67984 11.333C2.67984 9.85301 3.85317 8.66634 5.33317 8.66634H10.6665V5.99967C10.6665 4.51967 11.8532 3.33301 13.3332 3.33301H18.6665C20.1465 3.33301 21.3332 4.51967 21.3332 5.99967V8.66634H26.6665Z" fill={color}/>
</svg>
)
