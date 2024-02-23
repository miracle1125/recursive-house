import React, {
  FunctionComponent,
  ReactNode,
  ButtonHTMLAttributes,
} from 'react';
import cn from 'classnames';
import { IconSize, IconWrapper } from '../IconWrapper';
import { Loader } from '../Loader';

export enum ButtonVariant {
  primary = 'primary',
  outlined = 'outlined',
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case ButtonVariant.primary:
      return 'text-surface-base bg-accent-main hover:bg-accent-hover active:bg-accent-selected';
    case ButtonVariant.outlined:
      return 'text-content-primary active:bg-action-selected hover:bg-action-hover border border-surface-div';

    default:
      break;
  }
};
export type ButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  narrow?: boolean;
  prefixIconSize?: IconSize;
  prefixIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  suffixIconSize?: IconSize;
  suffixIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconClassname?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FunctionComponent<ButtonProps> = ({
  variant = ButtonVariant.primary,
  className = '',
  prefixIcon,
  prefixIconSize = IconSize.sm,
  suffixIcon,
  suffixIconSize = IconSize.sm,
  children,
  disabled = false,
  isLoading = false,
  iconClassname,
  type = 'button',
  ...props
}) => {
  return (
    <button
      className={cn(
        'group duration-250 flex items-center rounded-md',
        'py-1.5 px-3',
        getVariantStyles(variant),
        disabled || isLoading ? '!cursor-default opacity-80 ' : '',
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
      onClick={disabled || isLoading ? () => {} : props.onClick}
    >
      {isLoading && <Loader className="mr-2" />}
      {prefixIcon && (
        <IconWrapper
          icon={prefixIcon}
          size={prefixIconSize}
          className={cn('mr-2', iconClassname)}
        />
      )}
      {children}
      {suffixIcon && (
        <IconWrapper
          icon={suffixIcon}
          size={suffixIconSize}
          className={cn('ml-2', iconClassname)}
        />
      )}
    </button>
  );
};
