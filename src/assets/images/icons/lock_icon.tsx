import React from "react";

interface DefaultLockIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultLockIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}:DefaultLockIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M24 11.3333H22.6667V8.66667C22.6667 4.98667 19.68 2 16 2C12.32 2 9.33334 4.98667 9.33334 8.66667V11.3333H8C6.53334 11.3333 5.33334 12.5333 5.33334 14V27.3333C5.33334 28.8 6.53334 30 8 30H24C25.4667 30 26.6667 28.8 26.6667 27.3333V14C26.6667 12.5333 25.4667 11.3333 24 11.3333ZM12 8.66667C12 6.45333 13.7867 4.66667 16 4.66667C18.2133 4.66667 20 6.45333 20 8.66667V11.3333H12V8.66667ZM24 27.3333H8V14H24V27.3333ZM16 23.3333C17.4667 23.3333 18.6667 22.1333 18.6667 20.6667C18.6667 19.2 17.4667 18 16 18C14.5333 18 13.3333 19.2 13.3333 20.6667C13.3333 22.1333 14.5333 23.3333 16 23.3333Z" fill={color}/>
</svg>
)