import React, { FunctionComponent } from 'react';
import cn from 'classnames';
import { IconWrapper } from '../IconWrapper';
import LoaderIcon from '@/assets/icons/loader.svg';

export enum LoaderSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

const getSizeStyles = (variant: LoaderSize) => {
  switch (variant) {
    case LoaderSize.sm:
      return 'w-3 h-3';
    case LoaderSize.md:
      return 'w-4 h-4';
    case LoaderSize.lg:
      return 'w-5 h-5';
    case LoaderSize.xl:
      return 'w-6 h-6';
    case LoaderSize.xxl:
      return 'w-9 h-9';
    default:
      return 'w-4 h-4';
  }
};

export interface LoaderProps {
  className?: string;
  size?: LoaderSize;
}

export const Loader: FunctionComponent<LoaderProps> = ({
  className = '',
  size = LoaderSize.md,
  ...props
}) => {
  return (
    <div className={cn(getSizeStyles(size), className)} {...props}>
      <IconWrapper
        className={'w-full h-full animate-spin text-accent-main'}
        icon={LoaderIcon}
      />
    </div>
  );
};
