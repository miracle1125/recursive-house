import { MenuPosition, TooltipPosition } from '@/components/common';
import { useState, useEffect, useCallback, RefObject } from 'react';

const POPOVER_SPACE = 6;

type PortalPositionProps = {
  openMenu: boolean;
  wrapperRef: RefObject<HTMLDivElement>;
  popoverRef: RefObject<HTMLDivElement>;
  isTooltip?: boolean;
  tooltipPosition?: TooltipPosition;
  menuPosition?: MenuPosition;
  isFixedMenuWidth?: boolean;
};

const usePortalPosition = ({
  openMenu,
  wrapperRef,
  popoverRef,
  isTooltip,
  tooltipPosition,
  isFixedMenuWidth,
  menuPosition,
}: PortalPositionProps) => {
  const [position, setPosition] = useState<{
    width: number;
    left: number;
    top: number;
    isAutoFlippedToBottom?: boolean;
    isFlippedRight?: boolean;
  } | null>(null);

  const handleSetPosition = useCallback(() => {
    if (wrapperRef.current && popoverRef.current && openMenu) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const menuRect = popoverRef.current?.getBoundingClientRect();

      const distanceFromTop = rect.top;
      const distanceFromBottom = window.innerHeight - rect.bottom;
      const distanceFromLeft = rect.left;
      const distanceFromRight = window.innerWidth - rect.right;

      if (isTooltip) {
        let isAutoFlippedToBottom = false;
        let xPosition = rect.left + rect.width / 2;
        let yPosition = rect.top;

        // Flipping to bottom position in case there is not enough space on top
        if (distanceFromTop < menuRect.height) {
          isAutoFlippedToBottom = true;
          yPosition = rect.bottom;
        }

        if (tooltipPosition === TooltipPosition.bottom) {
          xPosition = rect.left + rect.width / 2;
          yPosition = rect.bottom;

          // Flipping to top position in case there is not enough space at bottom
          if (distanceFromBottom < menuRect.height) {
            yPosition = rect.top - menuRect.height - POPOVER_SPACE;
          }
        } else if (tooltipPosition === TooltipPosition.left) {
          xPosition = rect.left;
          yPosition = rect.top - rect.height / 2;
        } else if (tooltipPosition === TooltipPosition.right) {
          xPosition = rect.right;
          yPosition = rect.top - rect.height / 2;
        }

        setPosition({
          width: wrapperRef.current.clientWidth,
          left: xPosition,
          top: yPosition + window.pageYOffset,
          isAutoFlippedToBottom,
        });
      } else {
        let isFlippedRight = false;
        let xPosition = rect.left;
        let yPosition =
          rect.top + rect.height + window.pageYOffset + POPOVER_SPACE;
        if (distanceFromBottom < menuRect.height) {
          yPosition = rect.top - menuRect.height - POPOVER_SPACE;
        }
        if (
          distanceFromRight < menuRect.width &&
          distanceFromLeft > distanceFromRight
        ) {
          isFlippedRight = true;
          xPosition =
            rect.right -
            (isFixedMenuWidth
              ? menuRect.width
              : wrapperRef.current.clientWidth);
        }

        if (menuPosition === MenuPosition.bottom) {
          xPosition = rect.left + rect.width / 2;
          yPosition = rect.bottom;

          // Flipping to top position in case there is not enough space at bottom
          if (distanceFromBottom < menuRect.height) {
            yPosition = rect.top - menuRect.height - POPOVER_SPACE;
          }
        } else if (menuPosition === MenuPosition.left) {
          xPosition = rect.left;
          yPosition = rect.top - rect.height / 2;
        } else if (menuPosition === MenuPosition.right) {
          xPosition = rect.right;
          yPosition =
            distanceFromBottom + rect.height < menuRect.height
              ? rect.bottom - menuRect.height
              : rect.top - rect.height;
        }

        setPosition({
          width: wrapperRef.current.clientWidth,
          left: xPosition,
          top: yPosition,
          isFlippedRight,
        });
      }
    }
  }, [
    wrapperRef,
    popoverRef,
    openMenu,
    isTooltip,
    tooltipPosition,
    isFixedMenuWidth,
    menuPosition,
  ]);

  const resetPosition = () => {
    setPosition(null);
  };

  useEffect(() => {
    if (openMenu) {
      handleSetPosition();
    } else {
      resetPosition();
    }
  }, [openMenu, handleSetPosition]);

  useEffect(() => {
    const handleResize = () => {
      handleSetPosition();
    };

    let observer: ResizeObserver;
    const popoverElem = popoverRef.current;

    if (popoverElem) {
      observer = new ResizeObserver(handleResize);
      observer.observe(popoverElem);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer && popoverElem) {
        observer.unobserve(popoverElem);
      }
    };
  }, [handleSetPosition, wrapperRef, popoverRef]);
  return { position, handleSetPosition, resetPosition };
};

export { usePortalPosition };
