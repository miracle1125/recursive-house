import React, { ReactNode } from 'react';
import cn from 'classnames';

export type CardProps = {
  className?: string;
  children?: ReactNode;
};

export const Card = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        className,
        'shadow-base border border-surface-div rounded flex flex-col bg-surface-base p-3',
      )}
    >
      {children}
    </div>
  );
};
