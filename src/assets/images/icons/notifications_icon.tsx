import React from "react";

interface DefaultNotificationsIconProps {
  color?: string;
  width?: string;
  height?: string;
}

export const DefaultNotificationsIcon = ({
  color = 'var(--color-icon-primary)',
  width,
  height,
}:DefaultNotificationsIconProps) => (
<svg
  width={width}
  height={height}
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M15.9999 29C17.4666 29 18.6666 27.8 18.6666 26.3333H13.3333C13.3333 27.8 14.5333 29 15.9999 29ZM23.9999 21V14.3333C23.9999 10.24 21.8266 6.81333 17.9999 5.90667V5C17.9999 3.89333 17.1066 3 15.9999 3C14.8933 3 13.9999 3.89333 13.9999 5V5.90667C10.1866 6.81333 7.99992 10.2267 7.99992 14.3333V21L5.33325 23.6667V25H26.6666V23.6667L23.9999 21ZM21.3333 22.3333H10.6666V14.3333C10.6666 11.0267 12.6799 8.33333 15.9999 8.33333C19.3199 8.33333 21.3333 11.0267 21.3333 14.3333V22.3333Z" fill={color} />
</svg>
)


