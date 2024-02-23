import React, { FunctionComponent } from 'react';
import cn from 'classnames';

export type ProgressBarLineData = {
  value: number;
  className?: string;
};

export interface ProgressBarProps {
  className?: string;
  progress: number;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  className,
  progress,
}) => {
  return (
    <div
      className={cn(
        className,
        'w-full relative flex overflow-hidden bg-surface-alt h-1',
      )}
    >
      <div
        className="absolute top-0 left-0 h-1 bg-success-main"
        style={{
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
};
