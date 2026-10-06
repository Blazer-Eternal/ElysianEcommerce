import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

/* One radius and one shadow weight across every button in the app. */
const BUTTON_SHADOW = "shadow-[0_1px_3px_rgba(61,5,12,0.14)]";

const variantClasses: Record<string, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white border border-brand/30 text-brand hover:bg-brand/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-ink/25 text-ink hover:bg-ink/5 hover:border-ink/40",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none ${BUTTON_SHADOW} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
