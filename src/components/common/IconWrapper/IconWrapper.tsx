import cn from 'classnames';
import React, { FunctionComponent, useCallback } from 'react';

export enum IconSize {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
  xxxl = 'xxxl',
}

const getSizeStyles = (variant: IconSize) => {
  switch (variant) {
    case IconSize.xxs:
      return 'w-1.5 h-1.5 min-w-[6px] min-h-[6px]';
    case IconSize.xs:
      return 'w-2 h-2 min-w-[8px] min-h-[8px]';
    case IconSize.sm:
      return 'w-2.5 h-2.5 min-w-[10px] min-h-[10px]';
    case IconSize.md:
      return 'w-3 h-3 min-w-[12px] min-h-[12px]';
    case IconSize.lg:
      return 'w-3.5 h-3.5 min-w-[14px] min-h-[14px]';
    case IconSize.xl:
      return 'w-4 h-4 min-w-[16px] min-h-[16px]';
    case IconSize.xxl:
      return 'w-5 h-5 min-w-[20px] min-h-[20px]';
    case IconSize.xxxl:
      return 'w-6 h-6 min-w-[30px] min-h-[30px]';
    default:
      return 'w-3 h-3 min-w-[12px] min-h-[12px]';
  }
};

export interface IconWrapperProps {
  size?: IconSize;
  className?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const IconWrapper: FunctionComponent<IconWrapperProps> = ({
  className = '',
  size = IconSize.md,
  icon,
  onClick,
  ...props
}) => {
  const renderIcon = useCallback(() => {
    if (typeof icon === 'string') {
      return <img src={icon} className="w-full h-full" alt="" />;
    } else {
      const Icon = icon as React.ElementType;
      return <Icon className={'w-full h-full'} />;
    }
  }, [icon]);
  if (!icon) {
    return null;
  }
  return (
    <div
      className={cn(getSizeStyles(size), className)}
      onClick={onClick}
      {...props}
    >
      {renderIcon()}
    </div>
  );
};
