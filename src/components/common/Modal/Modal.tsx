import {Dialog, Transition} from '@headlessui/react';
import cn from 'classnames';
import {Fragment, FunctionComponent, ReactNode} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import CloseIcon from '@/assets/icons/close.svg';

import {Button, ButtonVariant} from '../Button';
import {IconSize, IconWrapper} from '../IconWrapper';

export const SIDEBAR_WIDTH = 216;

export const MAX_MODAL_HEIGHT = 800;
const MIN_HEIGHT = 600;
export const MAX_MODAL_CONTENT_HEIGHT_NOT_FULLSCREEN = `calc(100vh - 80px)`;
const MAX_MODAL_CONTENT_HEIGHT_FULLSCREEN = `calc(100vh - 70px)`;
const CONTENT_FULL_SCREEN_HEIGHT = 'h-[calc(100%-166px)]';

export enum ModalPosition {
  top = 'top',
  center = 'center',
}

export enum ModalSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
  xxxl = 'xxxl',
  max = 'max',
}

const POSITION_STYLE_MAP = {
  [ModalPosition.top]: '',
  [ModalPosition.center]: 'min-h-full items-center',
};

const getSizeStyles = (variant: ModalSize) => {
  switch(variant) {
    case ModalSize.sm:
      return 'max-w-[448px]';
    case ModalSize.md:
      return 'max-w-[684px]';
    case ModalSize.lg:
      return 'max-w-[728px]';
    case ModalSize.xl:
      return 'max-w-[900px]';
    case ModalSize.xxl:
      return 'max-w-[1092px]';
    case ModalSize.xxxl:
      return 'max-w-[1400px]';
    case ModalSize.max:
      return 'max-w-[calc(100vw-60px)]';
    default:
      return 'max-w-[684px]';
  }
};

export interface ModalProps {
  size?: ModalSize;
  className?: string;
  open?: boolean;
  handleClose?: VoidFunction;
  handleSubmit?: VoidFunction;
  title?: string | ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  cancelButtonTitle?: string;
  submitButtonTitle?: string;
  children?: ReactNode;
  enableSidebar?: boolean;
  position?: ModalPosition;
  fullScreen?: boolean;
  loading?: boolean;
  submitting?: boolean;
  disableSubmitButton?: boolean;
  autoHeight?: boolean;
  contentClassName?: string;
  disableClose?: boolean;
  innerContentClassName?: string;
}

export const Modal: FunctionComponent<ModalProps> = ({
  handleClose,
  handleSubmit,
  open,
  className = '',
  showHeader = false,
  showFooter = false,
  cancelButtonTitle = 'Cancel',
  submitButtonTitle = 'Submit',
  title = '',
  size = ModalSize.md,
  children,
  enableSidebar = false,
  position = ModalPosition.center,
  fullScreen,
  submitting,
  disableSubmitButton,
  autoHeight,
  contentClassName,
  innerContentClassName,
  disableClose,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        onClose={!disableClose && handleClose ? (handleClose as any) : () => { }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-[#9ca3af1a]" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div
            className={cn(
              fullScreen ? 'w-full h-full' : 'p-4',
              'flex justify-center text-center',
              POSITION_STYLE_MAP[position],
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-[20px]"
              enterTo="opacity-100 translate-y-[0px]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-[0px]"
              leaveTo="opacity-0 translate-y-[20px]"
            >
              <Dialog.Panel
                className={cn(
                  fullScreen ? 'w-full h-full' : getSizeStyles(size),
                  'bg-surface-base border border-surface-div w-full overflow-hidden',
                  'transform  text-left align-middle shadow-xl transition-all flex flex-col',
                  fullScreen ? '' : 'rounded-lg',
                  className,
                )}
                style={{
                  height:
                    fullScreen || autoHeight ? 'unset' : 'calc(100vh - 60px)',
                  minHeight: autoHeight ? 'unset' : MIN_HEIGHT,
                }}
              >
                <div
                  className={cn(
                    fullScreen ? 'w-full h-full relative' : '',
                    'flex flex-col items-center h-full',
                  )}
                >
                  {/* Header when not fullscreen */}
                  {showHeader && !fullScreen && (
                    <Header
                      fullScreen={!!fullScreen}
                      title={title}
                      handleClose={handleClose}
                    />
                  )}
                  {/* Close icon for fullscreen */}
                  {showHeader && fullScreen && (
                    <IconWrapper
                      icon={CloseIcon}
                      className="!absolute right-8 top-8 z-[1]"
                      onClick={handleClose}
                      size={IconSize.lg}
                    />
                  )}
                  {enableSidebar ? (
                    <div
                      className={cn(
                        'w-full flex justify-center',
                        fullScreen ? CONTENT_FULL_SCREEN_HEIGHT : '',
                      )}
                    >
                      <div
                        className={cn(
                          fullScreen ? getSizeStyles(size) : '',
                          'w-full flex h-full',
                        )}
                      >
                        <PerfectScrollbar
                          options={{
                            wheelPropagation: false,
                            useBothWheelAxes: false,
                            suppressScrollX: true,
                          }}
                          style={{
                            maxHeight: fullScreen
                              ? MAX_MODAL_CONTENT_HEIGHT_FULLSCREEN
                              : MAX_MODAL_CONTENT_HEIGHT_NOT_FULLSCREEN,
                            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                          }}
                        >
                          {/* Header for fullscreen */}
                          {showHeader && fullScreen && (
                            <Header
                              fullScreen={!!fullScreen}
                              title={title}
                              handleClose={handleClose}
                            />
                          )}
                          {children}
                        </PerfectScrollbar>
                      </div>
                    </div>
                  ) : (
                    <PerfectScrollbar
                      options={{
                        wheelPropagation: false,
                        useBothWheelAxes: false,
                        suppressScrollX: true,
                      }}
                      className={cn('w-full h-full', contentClassName, {
                        'px-4': fullScreen,
                      })}
                    >
                      <div
                        className={cn(
                          fullScreen ? getSizeStyles(size) : '',
                          innerContentClassName,
                          'mx-auto flex flex-col',
                        )}
                      >
                        {/* Header for fullscreen */}
                        {showHeader && fullScreen && (
                          <Header
                            fullScreen={!!fullScreen}
                            title={title}
                            handleClose={handleClose}
                          />
                        )}
                        {children}
                      </div>
                    </PerfectScrollbar>
                  )}
                </div>
                {showFooter && (
                  <div
                    className={cn(
                      fullScreen ? 'absolute left-0 bottom-0 w-full' : '',
                      'h-fit border-t border-surface-div flex justify-center px-6 py-4',
                    )}
                  >
                    <div
                      className={cn(
                        fullScreen ? getSizeStyles(size) : '',
                        'flex gap-2 w-full justify-end',
                      )}
                    >
                      <Button
                        onClick={handleClose}
                        disabled={submitting}
                        variant={ButtonVariant.outlined}
                      >
                        {cancelButtonTitle}
                      </Button>
                      {handleSubmit && (
                        <Button
                          onClick={handleSubmit}
                          isLoading={submitting}
                          disabled={disableSubmitButton}
                        >
                          {submitButtonTitle}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Header = ({
  fullScreen,
  title,
  handleClose,
}: {
  fullScreen: boolean;
  title?: string | ReactNode;
  handleClose?: () => void;
}) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          fullScreen ? 'pt-12 pb-6' : 'px-6 py-4',
          'flex gap-2 w-full justify-between border-b border-surface-div items-center',
        )}
      >
        <h2>{title}</h2>
        {/* Close icon when not fullscreen */}
        {!fullScreen && (
          <IconWrapper
            icon={CloseIcon}
            className="cursor-pointer text-content-secondary"
            onClick={handleClose}
            size={IconSize.lg}
          />
        )}
      </div>
    </div>
  );
};
