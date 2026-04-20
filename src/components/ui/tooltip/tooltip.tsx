import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./tooltip.module.css";

interface TooltipProps {
  text?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  header?: React.ReactNode;
  content?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = 'top',
  offset = 8,
  content,
  header
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [actualPosition, setActualPosition] = useState(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;
      let newPosition = position;

      const tryPosition = (pos: string) => {
        switch (pos) {
          case 'top':
            top = containerRect.top - tooltipRect.height - offset;
            left = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
            break;
          case 'bottom':
            top = containerRect.bottom + offset;
            left = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
            break;
          case 'left':
            top = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
            left = containerRect.left - tooltipRect.width - offset;
            break;
          case 'right':
            top = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
            left = containerRect.right + offset;
            break;
        }
        return { top, left };
      };

      const isPositionValid = (pos: string) => {
        const { top, left } = tryPosition(pos);
        return (
          top >= 0 &&
          left >= 0 &&
          top + tooltipRect.height <= window.innerHeight &&
          left + tooltipRect.width <= window.innerWidth
        );
      };

      if (!isPositionValid(position)) {
        switch (position) {
          case 'right':
            if (isPositionValid('left')) {
              newPosition = 'left';
            } else if (isPositionValid('bottom')) {
              newPosition = 'bottom';
            } else if (isPositionValid('top')) {
              newPosition = 'top';
            }
            break;
          case 'left':
            if (isPositionValid('right')) {
              newPosition = 'right';
            } else if (isPositionValid('bottom')) {
              newPosition = 'bottom';
            } else if (isPositionValid('top')) {
              newPosition = 'top';
            }
            break;
          case 'bottom':
            if (isPositionValid('top')) {
              newPosition = 'top';
            } else if (isPositionValid('right')) {
              newPosition = 'right';
            } else if (isPositionValid('left')) {
              newPosition = 'left';
            }
            break;
          case 'top':
            if (isPositionValid('bottom')) {
              newPosition = 'bottom';
            } else if (isPositionValid('right')) {
              newPosition = 'right';
            } else if (isPositionValid('left')) {
              newPosition = 'left';
            }
            break;
        }
      }

      const { top: finalTop, left: finalLeft } = tryPosition(newPosition);
      setActualPosition(newPosition);

      let adjustedTop = finalTop;
      let adjustedLeft = finalLeft;

      if (adjustedTop < 0) adjustedTop = 5;
      if (adjustedTop + tooltipRect.height > window.innerHeight) {
        adjustedTop = window.innerHeight - tooltipRect.height - 5;
      }
      if (adjustedLeft < 0) adjustedLeft = 5;
      if (adjustedLeft + tooltipRect.width > window.innerWidth) {
        adjustedLeft = window.innerWidth - tooltipRect.width - 5;
      }

      setTooltipStyle({
        position: 'fixed',
        top: `${adjustedTop}px`,
        left: `${adjustedLeft}px`,
        zIndex: 1000
      });
    }
  }, [isHovered, position, offset, text]);

  // const getArrowStyle = (): React.CSSProperties => {
  //   if (!containerRef.current) return {};
  //
  //   const tooltipRect = tooltipRef.current?.getBoundingClientRect();
  //   if (!tooltipRect) return {};
  //
  //   const arrowStyle: React.CSSProperties = {
  //     position: 'absolute',
  //     width: 0,
  //     height: 0,
  //     borderStyle: 'solid'
  //   };
  //
  //   switch (actualPosition) {
  //     case 'top':
  //       arrowStyle.bottom = '-5px';
  //       arrowStyle.left = '50%';
  //       arrowStyle.transform = 'translateX(-50%)';
  //       arrowStyle.borderWidth = '5px 5px 0 5px';
  //       arrowStyle.borderColor = '#333 transparent transparent transparent';
  //       break;
  //     case 'bottom':
  //       arrowStyle.top = '-5px';
  //       arrowStyle.left = '50%';
  //       arrowStyle.transform = 'translateX(-50%)';
  //       arrowStyle.borderWidth = '0 5px 5px 5px';
  //       arrowStyle.borderColor = 'transparent transparent #333 transparent';
  //       break;
  //     case 'left':
  //       arrowStyle.right = '-5px';
  //       arrowStyle.top = '50%';
  //       arrowStyle.transform = 'translateY(-50%)';
  //       arrowStyle.borderWidth = '5px 0 5px 5px';
  //       arrowStyle.borderColor = 'transparent transparent transparent #333';
  //       break;
  //     case 'right':
  //       arrowStyle.left = '-5px';
  //       arrowStyle.top = '50%';
  //       arrowStyle.transform = 'translateY(-50%)';
  //       arrowStyle.borderWidth = '5px 5px 5px 0';
  //       arrowStyle.borderColor = 'transparent #333 transparent transparent';
  //       break;
  //   }
  //
  //   return arrowStyle;
  // };

  return (
    <>
      <div
        ref={containerRef}
        className={styles.tooltipContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>

      {isHovered && text && ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          style={tooltipStyle}
        >
          <div className={styles.tooltipHeader}>
            {header}
          </div>
          {/*<div style={getArrowStyle()} />*/}

          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;