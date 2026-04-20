import React from "react";

interface DefaultQuestionAnswerIconProps {
  color?: string;
}

export const DefaultQuestionAnswerIcon = ({
  color = 'var(--color-icon-primary)'
}: DefaultQuestionAnswerIconProps) => (
<svg
  width="32"
  height="32"
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
<path d="M20 5.33317V14.6665H6.89333L5.33333 16.2265V5.33317H20ZM21.3333 2.6665H4C3.26666 2.6665 2.66666 3.2665 2.66666 3.99984V22.6665L8 17.3332H21.3333C22.0667 17.3332 22.6667 16.7332 22.6667 15.9998V3.99984C22.6667 3.2665 22.0667 2.6665 21.3333 2.6665ZM28 7.99984H25.3333V19.9998H8V22.6665C8 23.3998 8.6 23.9998 9.33333 23.9998H24L29.3333 29.3332V9.33317C29.3333 8.59984 28.7333 7.99984 28 7.99984Z" fill={color}/>
</svg>
)

