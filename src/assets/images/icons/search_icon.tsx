import React from "react";

interface DefaultSearchIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultSearchIcon = ({
  color = 'inherit',
  width,
  height,
}: DefaultSearchIconProps) => (
<svg 
  width={width}
  height={height}
  viewBox="0 0 40 40" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M24.6 22.1167L34.15 31.6667L31.6667 34.15L22.1167 24.6C20.3333 25.8833 18.1833 26.6667 15.8333 26.6667C9.85 26.6667 5 21.8167 5 15.8333C5 9.85 9.85 5 15.8333 5C21.8167 5 26.6667 9.85 26.6667 15.8333C26.6667 18.1833 25.8833 20.3333 24.6 22.1167ZM15.8333 8.33333C11.6833 8.33333 8.33333 11.6833 8.33333 15.8333C8.33333 19.9833 11.6833 23.3333 15.8333 23.3333C19.9833 23.3333 23.3333 19.9833 23.3333 15.8333C23.3333 11.6833 19.9833 8.33333 15.8333 8.33333Z" fill={color}/>
</svg>
);
