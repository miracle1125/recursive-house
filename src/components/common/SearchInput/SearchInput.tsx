import React, {
  FunctionComponent,
  InputHTMLAttributes,
  useState,
  useCallback,
  useEffect,
  RefObject,
} from 'react';
import cn from 'classnames';
import { TextInput } from '../TextInput';
import debounce from 'lodash/debounce';
import { IconWrapper } from '../IconWrapper';
import SearchIcon from '@/assets/icons/search.svg';
import CloseIcon from '@/assets/icons/close.svg';

export type SearchInputProps = {
  className?: string;
  value?: string;
  handleSearch?: (value: string) => void;
  placeholder?: string;
  hideClear?: boolean;
  helperText?: string;
  error?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  hidePrefixIcon?: boolean;
  reformatSearchValue?: (value: string) => string;
  useDebounce?: boolean;
  onClear?: () => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const SearchInput: FunctionComponent<SearchInputProps> = ({
  className = '',
  value,
  handleSearch,
  placeholder,
  hideClear = false,
  helperText = '',
  error,
  inputRef,
  hidePrefixIcon,
  reformatSearchValue = (value: string) => value,
  useDebounce = true,
  onClear,
  ...props
}) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useDebounce) {
      setSearch(reformatSearchValue(e.target.value));
    } else {
      handleSearch?.(reformatSearchValue(e.target.value));
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      setSearch(value);
    }
  }, [value]);

  const handleClear = () => {
    if (useDebounce) {
      setSearch('');
    } else {
      handleSearch?.('');
    }
    onClear?.();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    debounce(async (val: string) => {
      if (handleSearch) handleSearch(val);
    }, 500),
    [],
  );

  useEffect(() => {
    if (useDebounce) {
      onSearch(search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, onSearch, useDebounce]);

  return (
    <div className={cn('w-full relative', className)}>
      <TextInput
        inputClassName={cn('peer', !hidePrefixIcon ? 'pl-10' : '')}
        placeholder={placeholder}
        value={search}
        onChange={handleSearchChange}
        helperText={helperText}
        error={error}
        inputRef={inputRef}
        {...props}
        defaultValue={''}
      />
      {!hidePrefixIcon && (
        <IconWrapper
          icon={SearchIcon}
          className={cn(
            'peer-focus:text-accent-main text-content-tertiary dark:text-content-tertiary-reverse',
            'absolute left-4 top-[50%] translate-y-[-50%]',
          )}
        />
      )}

      {search && !hideClear && (
        <IconWrapper
          icon={CloseIcon}
          onClick={handleClear}
          className={cn(
            'text-content-tertiary cursor-pointer dark:text-content-tertiary-reverse',
            'absolute right-4 top-[50%] translate-y-[-50%]',
          )}
        />
      )}
    </div>
  );
};
