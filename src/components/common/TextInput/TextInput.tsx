import React, {
  FunctionComponent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useState,
} from 'react';
import cn from 'classnames';
import { focusStyle } from '@/styles/constants';

export type TextInputProps = {
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  description?: string | ReactNode;
  changeValueOnBlur?: boolean;
  defaultValue?: string; // Only effective when changeValueOnBlur is true
} & InputHTMLAttributes<HTMLInputElement>;

export const TextInput: FunctionComponent<TextInputProps> = ({
  className = '',
  inputClassName = '',
  labelClassName = '',
  label = '',
  helperText = '',
  helperTextClassName = '',
  error,
  inputRef,
  description,
  defaultValue = '',
  changeValueOnBlur,
  ...props
}) => {
  const [tempValue, setTempValue] = useState(defaultValue);

  const value = changeValueOnBlur ? tempValue : props.value;

  const finishEditing = (clearValue?: boolean) => {
    props.onChange?.({
      target: { value: clearValue ? '' : tempValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      finishEditing(true);
    }
    if (e.key === 'Enter') {
      finishEditing();
    }
  };
  return (
    <div className={cn('relative', className)}>
      {label && (
        <p
          className={cn('text-content-primary font-medium', labelClassName, {
            'mb-4': !description,
            'mb-2': !!description,
          })}
        >
          {label}
        </p>
      )}
      {description ? <div className="mb-2">{description}</div> : null}
      <input
        className={cn(
          'w-full bg-surface-overlay text-content-primary',
          'rounded-md border min-h-[34px] px-3 shadow-sm',
          focusStyle,
          error
            ? 'border-error-main !ring-error-main !ring-1 '
            : 'border-surface-div',
          '!ring-offset-0',
          'disabled:bg-surface-div',
          inputClassName,
        )}
        ref={inputRef}
        {...props}
        value={value}
        onChange={
          changeValueOnBlur
            ? (e) => {
                setTempValue(e.target.value);
              }
            : props.onChange
        }
        onBlur={changeValueOnBlur ? () => finishEditing() : props.onBlur}
        onKeyDown={changeValueOnBlur ? handleKeyDown : props.onKeyDown}
      />
      {helperText && (
        <div
          className={cn(
            'absolute text-sm left-0 top-[calc(100%+2px)]',
            error ? 'text-error-main' : 'text-content-secondary',
            helperTextClassName,
          )}
          data-error={true}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};
