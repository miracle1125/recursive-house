import { useEffect, RefObject } from 'react';

type ClickOutsideProps = {
  onClickOutside: VoidFunction;
  wrapperRef: RefObject<HTMLElement>;
  popoverRef?: RefObject<HTMLElement>;
  openMenu?: boolean;
  dependencies?: any[];
};

const useClickOutside = ({
  onClickOutside,
  wrapperRef,
  popoverRef,
  openMenu,
  dependencies = [],
}: ClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef?.current && !popoverRef?.current) {
        if (
          wrapperRef?.current &&
          !wrapperRef?.current.contains(event.target as Node)
        ) {
          onClickOutside();
        }
      } else {
        if (
          wrapperRef?.current &&
          !wrapperRef?.current.contains(event.target as Node) &&
          popoverRef?.current &&
          !popoverRef?.current.contains(event.target as Node)
        ) {
          onClickOutside();
        }
      }
    };

    const escapeKeyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickOutside();
      }
    };

    if (openMenu === true || openMenu === undefined) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', escapeKeyHandler);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', escapeKeyHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, popoverRef, openMenu]);

  return null;
};

export { useClickOutside };
