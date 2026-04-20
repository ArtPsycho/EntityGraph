import React from "react";

interface DefaultLogoIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultLogoIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}:DefaultLogoIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 250 250"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M250 0H0V250H250V0ZM225 25H25V225H225V25Z" fill={color}/>
<rect x="109.15" y="225.658" width="231.7" height="25" transform="rotate(-60 109.15 225.658)" fill={color}/>
<rect x="24.6777" y="140" width="129.809" height="25" transform="rotate(45 24.6777 140)" fill={color}/>
</svg>
)