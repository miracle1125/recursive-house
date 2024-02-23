import cn from 'classnames';
import { Fragment, FunctionComponent } from 'react';
import { Portal } from 'react-portal';

export interface LoadingOverlayProps {
  className?: string;
  isAbsolute?: boolean;
  isTransparent?: boolean;
}

export const LoadingOverlay: FunctionComponent<LoadingOverlayProps> = ({
  className = '',
  isAbsolute,
  isTransparent,
  ...props
}) => {
  const Wrapper = isAbsolute ? Fragment : Portal;

  return (
    <Wrapper>
      <div
        className={cn(
          'top-0 left-0 w-full h-full z-[1000] flex justify-center items-center',
          className,
          isAbsolute ? 'absolute' : 'fixed',
          isTransparent ? 'bg-white bg-opacity-50' : 'bg-surface-base',
        )}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="w-[110px] h-[110px] rounded-full relative shadow-[rgba(0,0,0,0.1)_0px_10px_50px] pulse flex items-center justify-center">
            <img src="logo.png" alt="Logo" className="w-[75px] h-[75px]" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
