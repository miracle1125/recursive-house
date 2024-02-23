import React, {
  FunctionComponent,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  useMemo,
} from 'react';
import cn from 'classnames';
import { Portal } from 'react-portal';
import { IconSize, IconWrapper } from '../IconWrapper';
import ChevronDown from '@/assets/icons/chevron-down.svg';
import CloseIcon from '@/assets/icons/close.svg';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import isEqual from 'lodash/isEqual';
import { useClickOutside, usePortalPosition } from '@/hooks';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CheckIcon from '@/assets/icons/check.svg';

const INPUT_MIN_HEIGHT = 34;

export type ObjectValueType = {
  id?: string | number;
  disabled?: boolean;
  childOptions?: ObjectValueType[]; // Child options are the options that will show on hovering the parent one. Parent options are not selectable
  searchable?: boolean;
  [key: string]: any;
};

export type ValueType = number | string | ObjectValueType;

export type GroupOption<T> = {
  // Groups are the one that groups options into separated sections. Groups are not selectable, only sub-options
  id: string;
  isGroup: boolean; // must be true to enable Grouping
  options: T[];
  label: ReactNode | string;
  placeholder?: ReactNode | string;
};

export enum SelectVariant {
  regular = 'regular',
  inline = 'inline',
  custom = 'custom',
}

const SelectOption = <T extends ValueType>({
  option,
  value,
  subMenuItem,
  optionClassName,
  handleOptionClick,
  renderSelectOption,
  getOptionLabel,
  isGrouped,
}: {
  option: T;
  noOptionsText?: string | ReactNode;
  optionClassName?: string;
  subMenuItem?: T;
  handleOptionClick: (option: T, currentlySelected: boolean) => void;
  renderSelectOption?: (val: T, selected?: boolean) => ReactNode;
  getOptionLabel?: (opt: T) => string | ReactNode;
  value?: T;
  search?: string;
  menuWrapperClassName?: string;
  isGrouped?: boolean;
}) => {
  const selected =
    isEqual(option, value) ||
    (typeof option === 'object' &&
      typeof value === 'object' &&
      option?.id === value?.id) ||
    (typeof option === 'object' &&
      typeof value === 'object' &&
      !!option?.childOptions?.find(
        (childOption) =>
          typeof childOption === 'object' && childOption?.id === value?.id,
      ));

  const isSubMenuSelected =
    typeof subMenuItem === 'object' &&
    typeof option === 'object' &&
    subMenuItem?.id === option?.id;
  return (
    <div
      style={{ minHeight: `${INPUT_MIN_HEIGHT}px` }}
      className={cn(
        'relative select-none flex items-center justify-between px-3',
        {
          'hover:bg-action-hover cursor-pointer':
            typeof option === 'object' ? !option?.disabled : true,
          'text-content-tertiary':
            typeof option === 'object' && option?.disabled,
          'font-semibold': selected,
          '!pl-11': isGrouped,
        },
        optionClassName,
      )}
      onClick={(e) => {
        e.stopPropagation();
        const isEnabled = typeof option === 'object' ? !option?.disabled : true;
        if (isEnabled) handleOptionClick(option, isSubMenuSelected || selected);
      }}
    >
      {renderSelectOption ? (
        renderSelectOption(option, selected)
      ) : (
        <div className="flex gap-2 justify-between w-full items-center">
          <div className={cn('grow truncate', selected ? 'font-semibold' : '')}>
            {getOptionLabel ? getOptionLabel(option) : String(option)}
          </div>

          {selected && (
            <IconWrapper
              icon={CheckIcon}
              className="text-accent-main"
              size={IconSize.xl}
            />
          )}
        </div>
      )}
      {typeof option === 'object' && option?.childOptions && (
        <IconWrapper
          className="text-content-secondary"
          icon={ChevronRight}
          size={IconSize.sm}
        />
      )}
    </div>
  );
};

const MenuItemList = <T extends ValueType>({
  options,
  optionClassName,
  subMenuItem,
  handleOptionClick,
  renderSelectOption,
  getOptionLabel,
  noOptionsText,
  value,
  search,
  menuWrapperClassName,
}: {
  options: Array<T | GroupOption<T>>;
  noOptionsText?: string | ReactNode;
  optionClassName?: string;
  subMenuItem?: T;
  handleOptionClick: (option: T, currentlySelected: boolean) => void;
  renderSelectOption?: (val: T, selected?: boolean) => ReactNode;
  getOptionLabel?: (opt: T) => string | ReactNode;
  value?: T;
  search?: string;
  menuWrapperClassName?: string;
}) => {
  const filterredOptions = useMemo(() => {
    if (search) {
      return options.filter((option) => {
        if (typeof option === 'object') {
          if (option.isGroup) {
            return (option as GroupOption<T>).options.filter((subOption) => {
              if (typeof subOption === 'object') {
                return subOption.label
                  .toLowerCase()
                  .includes(search.toLowerCase());
              } else {
                return String(subOption)
                  .toLowerCase()
                  .includes(search.toLowerCase());
              }
            });
          } else {
            return (option as ObjectValueType).label
              .toLowerCase()
              .includes(search.toLowerCase());
          }
        }
        return String(option).toLowerCase().includes(search.toLowerCase());
      });
    }
    return options;
  }, [options, search]);

  return (
    <PerfectScrollbar
      options={{
        wheelPropagation: false,
        useBothWheelAxes: false,
        suppressScrollX: true,
      }}
      className={cn('max-h-56', menuWrapperClassName)}
    >
      {filterredOptions.length ? (
        filterredOptions.map((option, idx) => {
          if (typeof option === 'object' && option.isGroup) {
            return (
              <div key={option.id}>
                <div
                  style={{ minHeight: `${INPUT_MIN_HEIGHT}px` }}
                  className="px-3 flex items-center select-none"
                >
                  {option.label}
                </div>
                {option.options.length > 0 ? (
                  option.options.map((subOption: T) => (
                    <SelectOption
                      key={
                        typeof subOption === 'object'
                          ? subOption?.id ||
                            (subOption as ObjectValueType)?.value
                          : idx
                      }
                      option={subOption as T}
                      value={value}
                      optionClassName={optionClassName}
                      subMenuItem={subMenuItem}
                      handleOptionClick={handleOptionClick}
                      renderSelectOption={renderSelectOption}
                      getOptionLabel={getOptionLabel}
                      isGrouped
                    />
                  ))
                ) : (
                  <>
                    {option.placeholder && (
                      <div
                        style={{ minHeight: `${INPUT_MIN_HEIGHT}px` }}
                        className={cn(
                          'relative select-none flex items-center pl-11 pr-3 text-content-secondary',
                        )}
                      >
                        {option.placeholder}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          }

          return (
            <SelectOption
              key={
                typeof option === 'object'
                  ? option?.id || (option as ObjectValueType)?.value
                  : idx
              }
              option={option as T}
              value={value}
              optionClassName={optionClassName}
              subMenuItem={subMenuItem}
              handleOptionClick={handleOptionClick}
              renderSelectOption={renderSelectOption}
              getOptionLabel={getOptionLabel}
            />
          );
        })
      ) : (
        <>
          {noOptionsText && (
            <div
              style={{ minHeight: `${INPUT_MIN_HEIGHT}px` }}
              className={cn('relative select-none flex items-center px-3')}
            >
              {noOptionsText}
            </div>
          )}
        </>
      )}
    </PerfectScrollbar>
  );
};

export type SelectInputProps<T extends ValueType> = {
  className?: string;
  value?: T;
  options?: Array<T | GroupOption<T>>;
  placeholder?: string | ReactNode;
  onChange?: (val?: T) => void;
  renderSelectedValue?: (val: T) => ReactNode;
  renderSelectOption?: (val: T, selected?: boolean) => ReactNode;
  renderCustomSelectButton?: (
    value: T,
    handleToggle: (e: MouseEvent<HTMLDivElement>) => void,
    clearable: boolean,
  ) => ReactNode;
  getOptionLabel?: (opt: T) => string | ReactNode;
  clearable?: boolean;
  clearOnSelectCurrentValue?: boolean;
  variant?: SelectVariant;
  menuWidth?: number;
  menuMaxWidth?: number;
  menuMinWidth?: number;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  onToggle?: (openMenu: boolean) => void;
  noOptionsText?: string | ReactNode;
  usePortalMenu?: boolean;
  menuClassName?: string;
  menuWrapperClassName?: string;
  selectButtonClassName?: string;
  optionClassName?: string;
  defaultOpen?: boolean;
  toggleOnClear?: boolean;
};

export const SelectInput = <T extends ValueType>({
  className,
  options = [],
  value,
  onChange,
  renderSelectedValue = (val) => String(val),
  renderSelectOption,
  getOptionLabel,
  renderCustomSelectButton,
  menuWidth,
  menuMaxWidth,
  menuMinWidth,
  placeholder = '',
  clearable = false,
  clearOnSelectCurrentValue = true,
  variant = SelectVariant.regular,
  disabled = false,
  helperText = '',
  error,
  onToggle,
  noOptionsText,
  usePortalMenu = true,
  menuClassName,
  selectButtonClassName,
  defaultOpen = false,
  optionClassName,
  menuWrapperClassName,
  toggleOnClear,
}: SelectInputProps<T>): ReturnType<FunctionComponent> => {
  const [openMenu, setOpenMenu] = useState(defaultOpen);
  const [subMenuItem, setSubMenuItem] = useState<T | undefined>();
  const [childOptionSearch, setChildOptionSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { position } = usePortalPosition({
    openMenu,
    wrapperRef,
    popoverRef,
    isFixedMenuWidth: !!menuWidth,
  });

  useClickOutside({
    wrapperRef,
    popoverRef,
    openMenu,
    onClickOutside: () => {
      if (openMenu) {
        setChildOptionSearch('');
        setSubMenuItem(undefined);
        setOpenMenu(false);
        onToggle?.(false);
      }
    },
  });

  const handleOptionClick = (option: T, currentlySelected: boolean) => {
    if (typeof option === 'object' && option?.childOptions) {
      if (!subMenuItem || (subMenuItem && !currentlySelected)) {
        setSubMenuItem(option);
      } else if (subMenuItem && currentlySelected) {
        setSubMenuItem(undefined);
        setChildOptionSearch('');
      }
      return;
    }
    if (clearable && currentlySelected && clearOnSelectCurrentValue) {
      onChange?.(undefined);
    } else {
      if (!currentlySelected) {
        onChange?.(option);
      }
    }
    setSubMenuItem(undefined);
    setChildOptionSearch('');
    setOpenMenu(false);
    onToggle?.(false);
  };

  const handleClearValue = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onChange?.(undefined as any);
    if (toggleOnClear && !openMenu) {
      handleToggle();
    }
  };

  const handleToggle = useCallback(
    (e?: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      e?.stopPropagation();

      setOpenMenu((prev) => {
        onToggle?.(!prev);
        if (!prev === false) {
          setSubMenuItem(undefined);
          setChildOptionSearch('');
        }
        return !prev;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled],
  );

  useEffect(() => {
    if (openMenu && searchInputRef.current) {
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [openMenu]);

  const renderSelectButton = () => {
    if (variant === SelectVariant.custom) {
      return renderCustomSelectButton?.(value as T, handleToggle, clearable);
    }
    if (variant === SelectVariant.inline) {
      return (
        <div className="w-fit rounded-md" onClick={handleToggle}>
          <div
            className={cn(
              'relative rounded-md hover:bg-action-hover',
              'flex items-center font-medium text-content-primary gap-3 px-2 py-1',
              disabled ? 'cursor-default' : 'cursor-pointer',
              openMenu ? 'bg-action-hover' : '',
              selectButtonClassName,
            )}
          >
            {value ? (
              renderSelectedValue(value)
            ) : (
              <span className="font-normal text-content-secondary">
                {placeholder}
              </span>
            )}
            {clearable && value ? (
              <IconWrapper
                icon={CloseIcon}
                size={IconSize.sm}
                onClick={handleClearValue}
                className="text-content-secondary hover:text-content-primary"
              />
            ) : (
              <IconWrapper
                icon={ChevronDown}
                className="pointer-events-none text-content-secondary"
              />
            )}
            {helperText && (
              <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                  e.stopPropagation()
                }
                className={cn(
                  'absolute text-sm cursor-text left-0 top-[calc(100%+2px)]',
                  error ? 'text-error-main' : 'text-content-secondary',
                )}
              >
                {helperText}
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className={'w-full rounded-md shadow-sm'} onClick={handleToggle}>
        <div
          style={{ minHeight: `${INPUT_MIN_HEIGHT}px` }}
          className={cn(
            'relative w-full',
            disabled
              ? 'bg-surface-div cursor-default'
              : 'bg-surface-overlay cursor-pointer',
            'flex items-center px-3 pr-8 border',
            'text-content-primary rounded cursor-pointer',
            openMenu ? 'ring-[1.5px] ring-accent-main ' : '',
            'transition duration-300',
            error
              ? 'border-error-main !ring-error-main !ring-1 '
              : 'border-surface-div',
            selectButtonClassName,
          )}
        >
          {value ? (
            renderSelectedValue(value)
          ) : (
            <span className="text-content-secondary">{placeholder}</span>
          )}
          {clearable && value ? (
            <IconWrapper
              icon={CloseIcon}
              onClick={handleClearValue}
              className="absolute text-content-secondary right-3 top-[50%] translate-y-[-50%] hover:text-content-primary"
            />
          ) : (
            <IconWrapper
              icon={ChevronDown}
              className="pointer-events-none absolute text-content-secondary right-3 top-[50%] translate-y-[-50%]"
            />
          )}
          {helperText && (
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
              className={cn(
                'absolute text-sm cursor-text left-0 top-[calc(100%+2px)]',
                error ? 'text-error-main' : 'text-content-secondary',
              )}
            >
              {helperText}
            </div>
          )}
        </div>
      </div>
    );
  };

  const MenuWrapper = usePortalMenu ? Portal : React.Fragment;

  return (
    <div className={cn(className, 'relative')} ref={wrapperRef}>
      {renderSelectButton()}
      {openMenu && (
        <MenuWrapper>
          <div
            ref={popoverRef}
            style={{
              visibility: position?.left ? 'visible' : 'hidden',
              width: menuWidth || position?.width,
              left: position?.left || 0,
              top: position?.top || 0,
              ...(menuMaxWidth ? { maxWidth: `${menuMaxWidth}px` } : {}),
              ...(menuMinWidth ? { minWidth: `${menuMinWidth}px` } : {}),
            }}
            className={cn(
              menuClassName,
              'absolute py-1 w-full rounded-md z-40',
              'bg-surface-overlay shadow-md border border-surface-div text-content-primary',
            )}
          >
            <MenuItemList
              options={options}
              optionClassName={optionClassName}
              noOptionsText={noOptionsText}
              handleOptionClick={handleOptionClick}
              renderSelectOption={renderSelectOption}
              getOptionLabel={getOptionLabel}
              value={value}
              subMenuItem={subMenuItem}
              menuWrapperClassName={menuWrapperClassName}
            />
            {typeof subMenuItem === 'object' && subMenuItem?.childOptions && (
              <div
                className={cn(
                  menuClassName,
                  'absolute py-1 w-full rounded-md z-40 left-[calc(100%+10px)] top-0',
                  'bg-surface-overlay shadow-md border border-surface-div text-content-primary',
                )}
              >
                <MenuItemList
                  options={subMenuItem.childOptions as T[]}
                  optionClassName={optionClassName}
                  noOptionsText={noOptionsText}
                  handleOptionClick={handleOptionClick}
                  renderSelectOption={renderSelectOption}
                  getOptionLabel={getOptionLabel}
                  value={value}
                  subMenuItem={subMenuItem}
                  search={childOptionSearch}
                  menuWrapperClassName={menuWrapperClassName}
                />
              </div>
            )}
          </div>
        </MenuWrapper>
      )}
    </div>
  );
};
