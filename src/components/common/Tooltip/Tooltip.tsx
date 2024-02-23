import React, {
  ReactNode,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import { usePortalPosition } from '@/hooks';
import { Portal } from 'react-portal';

export enum TooltipPosition {
  auto = 'auto',
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}

export interface TooltipRef {
  close: () => void;
}
export interface TooltipProps {
  className?: string;
  title: string | ReactNode;
  position?: TooltipPosition;
  children?: ReactNode;
  noDelayOpenMenu?: boolean;
  onOpen?: () => void;
  positionOffset?: {
    top?: number;
    left?: number;
  };
  isInteractive?: boolean;
  titleClassName?: string;
  interactiveContainerClassName?: string;
  style?: React.CSSProperties;
}

const TOOLTIP_POSITION_STYLE = {
  [TooltipPosition.top]: '-translate-x-2/4 -translate-y-full flex-col-reverse',
  [TooltipPosition.bottom]: '-translate-x-2/4 flex-col',
  [TooltipPosition.left]: '-translate-x-full flex-row-reverse',
  [TooltipPosition.right]: '',
  [TooltipPosition.auto]: 'translate-x-2/4 -translate-y-full flex-col-reverse',
};

const TOOLTIP_VIRTUAL_SPACE_STYLE = {
  [TooltipPosition.top]: 'h-1.5',
  [TooltipPosition.bottom]: 'h-1.5',
  [TooltipPosition.left]: 'w-1.5',
  [TooltipPosition.right]: 'w-1.5',
  [TooltipPosition.auto]: 'h-1.5',
};

const TOOLTIP_POS_THRESHOLD = 50;
const DELAY_OPEN_MENU = 300;
const NON_DELAY_OPEN_MENU = 50;

export const Tooltip = forwardRef<TooltipRef, TooltipProps>(
  function TooltipComponent(
    {
      className = '',
      position = TooltipPosition.auto,
      title,
      children,
      positionOffset,
      noDelayOpenMenu,
      onOpen,
      isInteractive,
      titleClassName,
      interactiveContainerClassName,
      style,
    },
    ref,
  ) {
    const [openMenu, setOpenMenu] = useState(false);
    const [delayedOpenMenu, setDelayedOpenMenu] = useState(false);

    const [computedPosition, setComputedPosition] =
      useState<TooltipPosition>(position);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const { position: portalPosition } = usePortalPosition({
      openMenu: delayedOpenMenu,
      wrapperRef,
      popoverRef,
      isTooltip: true,
      tooltipPosition: computedPosition,
    });

    const delayedOpenMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const delayedClosedMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCloseMenu = useCallback(() => {
      if (delayedOpenMenuTimeoutRef.current) {
        clearTimeout(delayedOpenMenuTimeoutRef.current);
      }
      setOpenMenu(false);
      const delayedClosedMenuTimeout = setTimeout(() => {
        setDelayedOpenMenu(false);
      }, 300);

      delayedClosedMenuTimeoutRef.current = delayedClosedMenuTimeout;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        close: handleCloseMenu,
      }),
      [handleCloseMenu],
    );

    const handleMouseEnter = useCallback(() => {
      if (delayedClosedMenuTimeoutRef.current) {
        clearTimeout(delayedClosedMenuTimeoutRef.current);
      }
      setOpenMenu(true);
      const delayedOpenMenu = setTimeout(
        () => {
          setDelayedOpenMenu(true);
        },
        noDelayOpenMenu ? NON_DELAY_OPEN_MENU : DELAY_OPEN_MENU,
      );

      delayedOpenMenuTimeoutRef.current = delayedOpenMenu;

      if (wrapperRef.current && position === TooltipPosition.auto) {
        const rect = wrapperRef.current.getBoundingClientRect();

        const distanceFromTop = rect.top;
        const distanceFromBottom = window.innerHeight - rect.bottom;
        const distanceFromLeft = rect.left;
        const distanceFromRight = window.innerWidth - rect.right;

        if (distanceFromTop >= TOOLTIP_POS_THRESHOLD) {
          setComputedPosition(TooltipPosition.top);
        } else if (distanceFromBottom >= TOOLTIP_POS_THRESHOLD) {
          setComputedPosition(TooltipPosition.bottom);
        } else if (distanceFromRight >= TOOLTIP_POS_THRESHOLD) {
          setComputedPosition(TooltipPosition.right);
        } else if (distanceFromLeft >= TOOLTIP_POS_THRESHOLD) {
          setComputedPosition(TooltipPosition.left);
        } else {
          setComputedPosition(TooltipPosition.top);
        }
      }

      onOpen?.();
    }, [noDelayOpenMenu, onOpen, position]);

    const finalLeftPosition = portalPosition?.left
      ? Number(portalPosition?.left || 0) + Number(positionOffset?.left || 0)
      : 0;
    const finalTopPosition = portalPosition?.top
      ? Number(portalPosition?.top || 0) + Number(positionOffset?.top || 0)
      : 0;

    useEffect(() => {
      if (
        openMenu &&
        wrapperRef.current &&
        wrapperRef.current.matches(':hover') === false
      ) {
        setOpenMenu(false);
        setDelayedOpenMenu(false);
      }
    }, [openMenu]);

    const finalTooltipPosition =
      [TooltipPosition.top, TooltipPosition.auto].includes(position) &&
      portalPosition?.isAutoFlippedToBottom
        ? TooltipPosition.bottom
        : computedPosition;

    return (
      <div
        className={cn('relative text-content-primary', className)}
        ref={wrapperRef}
        onMouseEnter={() => {
          if (isInteractive) handleMouseEnter();
        }}
        onMouseLeave={() => {
          if (isInteractive) handleCloseMenu();
        }}
        onBlur={() => {
          if (isInteractive) handleCloseMenu();
        }}
        style={style}
      >
        <div
          className={interactiveContainerClassName}
          onMouseEnter={() => {
            if (!isInteractive) handleMouseEnter();
          }}
          onMouseLeave={() => {
            if (!isInteractive) handleCloseMenu();
          }}
          onBlur={() => {
            if (!isInteractive) handleCloseMenu();
          }}
        >
          {children}
        </div>
        {(openMenu || delayedOpenMenu) && (
          <Portal>
            <div
              ref={popoverRef}
              style={{
                visibility:
                  portalPosition?.top &&
                  portalPosition?.left &&
                  delayedOpenMenu &&
                  title
                    ? 'visible'
                    : 'hidden',
                left: finalLeftPosition,
                top: finalTopPosition,
              }}
              className={cn(
                'drop-shadow-sm w-fit z-40 h-fit fixed flex',
                TOOLTIP_POSITION_STYLE[finalTooltipPosition],
                'transition-opacity duration-100',
                openMenu && delayedOpenMenu ? 'opacity-100' : 'opacity-0',
              )}
            >
              <div
                className={cn(TOOLTIP_VIRTUAL_SPACE_STYLE[computedPosition])}
              ></div>
              <div
                className={cn(
                  `flex items-center bg-surface-overlay rounded text-content-primary`,
                  'border-[0.5px] border-solid border-surface-div',
                  'drop-shadow-sm py-2 px-3 w-fit h-fit',
                  titleClassName,
                )}
              >
                {title}
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  },
);
