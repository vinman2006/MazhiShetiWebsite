import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 select-none";

    const variantStyles = {
      primary:
        "bg-brand-primary hover:bg-brand-dark text-white shadow-sm hover:shadow focus:ring-brand-primary",
      secondary:
        "bg-brand-light hover:bg-green-200 text-brand-dark focus:ring-brand-primary",
      outline:
        "border border-slate-300 hover:border-brand-primary bg-white text-slate-800 hover:bg-brand-cream focus:ring-brand-primary",
      ghost:
        "text-slate-700 hover:text-brand-primary hover:bg-slate-100 focus:ring-brand-primary",
      accent:
        "bg-brand-lime hover:bg-[#8ece28] text-brand-dark font-extrabold shadow-sm focus:ring-brand-lime",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-xs px-4 py-2.5 gap-2",
      lg: "text-sm px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
