import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold tracking-[0.01em] border border-black/5 ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
