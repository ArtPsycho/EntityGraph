import React from "react"

interface DefaultFormatHorizontalRuleIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultFormatHorizontalRuleIcon = ({
  color = 'var(--color-icon-primary',
  width,
  height,
}:DefaultFormatHorizontalRuleIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M20 11H4V13H20V11Z" fill={color}/>
</svg>
)