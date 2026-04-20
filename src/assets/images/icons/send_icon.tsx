import React from "react";

interface DefaultSendIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultSendIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultSendIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M4.68 8.04L14.6933 12.3333L4.66667 11L4.68 8.04ZM14.68 19.6667L4.66667 23.96V21L14.68 19.6667ZM2.01333 4L2 13.3333L22 16L2 18.6667L2.01333 28L30 16L2.01333 4Z" fill={color}/>
</svg>
)


