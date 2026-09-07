import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default Badge;