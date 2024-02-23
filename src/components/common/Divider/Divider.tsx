import React, { FunctionComponent } from 'react';
import cn from 'classnames';

export enum DividerVariant {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

const getVariantStyles = (variant: DividerVariant) => {
  switch (variant) {
    case DividerVariant.horizontal:
      return 'w-full h-0 border-b border-surface-div';
    case DividerVariant.vertical:
      return 'h-full w-0 border-l border-surface-div';
    default:
      return 'w-full h-0 border-b border-surface-div';
  }
};

export interface DividerProps {
  variant?: DividerVariant;
  className?: string;
}

export const Divider: FunctionComponent<DividerProps> = ({
  className = '',
  variant = DividerVariant.horizontal,
  ...props
}) => {
  return (
    <div className={cn(getVariantStyles(variant), className)} {...props} />
  );
};
