import React from "react";

interface DefaultFAQIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultFAQIcon = ({
  color = 'inherit',
  width,
  height,
}: DefaultFAQIconProps) => (
<svg 
  width={width}
  height={height}
  viewBox="0 0 40 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path d="M18.3334 11.6668H21.6667V15.0002H18.3334V11.6668ZM18.3334 18.3335H21.6667V28.3335H18.3334V18.3335ZM20 3.3335C10.8 3.3335 3.33337 10.8002 3.33337 20.0002C3.33337 29.2002 10.8 36.6668 20 36.6668C29.2 36.6668 36.6667 29.2002 36.6667 20.0002C36.6667 10.8002 29.2 3.3335 20 3.3335ZM20 33.3335C12.65 33.3335 6.66671 27.3502 6.66671 20.0002C6.66671 12.6502 12.65 6.66683 20 6.66683C27.35 6.66683 33.3334 12.6502 33.3334 20.0002C33.3334 27.3502 27.35 33.3335 20 33.3335Z" fill={color} />
</svg>
);

