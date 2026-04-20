import React from "react";

interface DefaultFileExportIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultFileExportIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}: DefaultFileExportIconProps) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  height={height}
  viewBox="0 -960 960 960"
  width={width}
  fill={color}>
<path d="M480-480ZM202-65l-56-57 118-118h-90v-80h226v226h-80v-89L202-65Zm278-15v-80h240v-440H520v-200H240v400h-80v-400q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H480Z"/>
</svg>
)