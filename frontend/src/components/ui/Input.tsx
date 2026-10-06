import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = "", ...rest }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-ink/80 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-ink placeholder:text-ink/55 shadow-[0_1px_2px_rgba(61,5,12,0.05)] transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/25"
            : "border-[#e3d8c6] focus:border-brand focus:ring-brand/30"
        } ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
