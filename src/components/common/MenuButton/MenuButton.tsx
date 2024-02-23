import React, {
  ReactNode,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import cn from 'classnames';
import { useClickOutside, usePortalPosition } from '@/hooks';
import { Portal } from 'react-portal';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconWrapper } from '../IconWrapper';
import ChevronRight from '@/assets/icons/chevron-right.svg';

const DEFAULT_MENU_WIDTH = 160;

export interface MenuButtonRef {
  close: () => void;
  open: () => void;
}

export type MenuOption = {
  id: string | number;
  label?: string | ReactNode;
  onClick?: VoidFunction;
  disabled?: boolean;
  isDivider?: boolean;
  children?: MenuOption[];
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | string;
  hidden?: boolean;
  onToggle?: () => void;
  description?: string;
  isFlippedRight?: boolean;
  menuWidth?: number;
  active?: boolean;
  className?: string;
  toggleSubMenuOnClick?: boolean;
};

const MenuOptionComponent = (props: MenuOption) => {
  const {
    label,
    onClick,
    isDivider,
    disabled,
    children,
    icon,
    description,
    isFlippedRight,
    menuWidth,
    onToggle,
    active,
    className,
    toggleSubMenuOnClick,
  } = props;
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isSubMenuFlippedTop, setIsSubMenuFlippedTop] = useState(false);
  const hasSubMenu = children && children.length > 0;
  const subMenuRef = useRef<HTMLDivElement | null>(null);
  const mainMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const rect = mainMenuRef.current?.getBoundingClientRect();
      const isBottomEnoughSpace =
        (rect?.top || 0) + (subMenuRef.current?.offsetHeight || 0) <
        window.innerHeight;
      if (!isBottomEnoughSpace) {
        setIsSubMenuFlippedTop(true);
      }
    }, 10);
  }, [hasSubMenu]);

  if (isDivider)
    return <div className="border-b border-surface-div my-1"></div>;

  return (
    <div
      ref={mainMenuRef}
      className={cn(
        'group flex w-full items-center justify-between rounded-md p-2 relative',
        disabled ? 'cursor-default' : 'cursor-pointer',
        {
          'hover:bg-action-hover text-content-primary': !disabled,
          'text-content-secondary': disabled,
          '!bg-action-selected': active,
        },
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          if (hasSubMenu) {
            setShowSubMenu(!showSubMenu);
          } else {
            onClick?.();
          }
        }
      }}
      onMouseEnter={() => {
        if (!toggleSubMenuOnClick) {
          setShowSubMenu(true);
        }
      }}
      onMouseLeave={() => {
        if (!toggleSubMenuOnClick) {
          setShowSubMenu(false);
        }
      }}
    >
      <div className="flex gap-3 items-center w-full">
        {icon && <IconWrapper icon={icon} className="text-content-secondary" />}
        <div className="text-left flex-1 w-full">
          {label}
          {description && (
            <div className="text-content-secondary text-sm">{description}</div>
          )}
        </div>
      </div>
      {hasSubMenu && <IconWrapper icon={ChevronRight} />}
      {hasSubMenu && (
        <div
          className={cn(
            'absolute rounded-md',
            'p-1 w-full bg-surface-overlay shadow-md focus:outline-none',
            isSubMenuFlippedTop ? 'bottom-0' : 'top-0',
            showSubMenu ? 'visible' : 'invisible',
            isFlippedRight
              ? 'right-[calc(100%+10px)]'
              : 'left-[calc(100%+10px)]',
          )}
          ref={subMenuRef}
          style={{
            width: `${menuWidth || DEFAULT_MENU_WIDTH}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <PerfectScrollbar
            options={{
              wheelPropagation: false,
              useBothWheelAxes: false,
              suppressScrollX: true,
            }}
            className="max-h-52"
          >
            {children.map((opt) => (
              <MenuOptionComponent
                key={opt.id}
                {...opt}
                onClick={() => {
                  opt.onClick?.();
                  onToggle?.();
                }}
                menuWidth={menuWidth || DEFAULT_MENU_WIDTH}
              />
            ))}
          </PerfectScrollbar>
          {/* Virtual hover space between main menu and sub menu */}
          <div className="w-[10px] absolute left-full top-0 h-full bg-transparent"></div>
          <div className="w-[10px] absolute right-full top-0 h-full bg-transparent"></div>
        </div>
      )}
    </div>
  );
};

export interface MenuButtonProps {
  className?: string;
  children: ReactNode;
  options?: MenuOption[];
  menuWidth?: number;
  subMenuWidth?: number;
  menuClassName?: string;
  /**
   * @default true
   */
  onToggle?: (open: boolean) => void;
  title?: ReactNode;
  menuPosition?: MenuPosition;
  positionOffset?: { left?: number; top?: number };
}

export enum MenuPosition {
  auto = 'auto',
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}

export const MenuButton = forwardRef<
  MenuButtonRef | undefined,
  MenuButtonProps
>(function MeuButtonComponent(
  {
    title,
    className = '',
    children,
    options = [],
    menuWidth,
    onToggle,
    subMenuWidth,
    menuClassName,
    menuPosition,
    positionOffset,
    ...props
  }: MenuButtonProps,
  ref,
) {
  const [openMenu, setOpenMenu] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { position } = usePortalPosition({
    openMenu,
    wrapperRef,
    popoverRef,
    isFixedMenuWidth: true,
    menuPosition,
  });

  useImperativeHandle(
    ref,
    () => ({
      close: () => setOpenMenu(false),
      open: () => setOpenMenu(true),
    }),
    [],
  );

  useClickOutside({
    wrapperRef,
    popoverRef,
    onClickOutside: () => {
      setOpenMenu(false);
      onToggle?.(false);
    },
    openMenu,
  });

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenMenu((prev) => {
        onToggle?.(!prev);
        return !prev;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleItemClick = (item: MenuOption) => {
    item?.onClick?.();
    setOpenMenu(false);
    onToggle?.(false);
  };

  return (
    <div className={cn('relative', className)} {...props}>
      <div ref={wrapperRef} onClick={handleToggle}>
        {children}
      </div>

      {openMenu && (
        <Portal>
          <div
            ref={popoverRef}
            style={{
              width: `${menuWidth || DEFAULT_MENU_WIDTH}px`,
              visibility: position?.left ? 'visible' : 'hidden',
              left: (position?.left || 0) + (positionOffset?.left || 0),
              top: (position?.top || 0) + (positionOffset?.top || 0),
            }}
            className={cn(
              'absolute z-40 p-1',
              'rounded-md bg-surface-overlay shadow-md focus:outline-none min-w-[200px]',
              menuClassName,
            )}
          >
            {title && <div className="text-content-secondary p-2">{title}</div>}
            {options.map((item) => (
              <div key={item.id}>
                {item.hidden ? null : (
                  <MenuOptionComponent
                    {...item}
                    onClick={() => handleItemClick(item)}
                    onToggle={() => {
                      setOpenMenu(false);
                      onToggle?.(false);
                    }}
                    isFlippedRight={
                      item?.isFlippedRight || position?.isFlippedRight
                    }
                    menuWidth={subMenuWidth || menuWidth || DEFAULT_MENU_WIDTH}
                  />
                )}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
});
