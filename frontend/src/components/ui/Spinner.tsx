interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<string, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

const Spinner = ({ size = "md" }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-black animate-spin`}
      />
    </div>
  );
};

export default Spinner;