interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard = ({ label, value, icon, bgColor = "from-brand to-cyan-600" }: StatCardProps) => {
  return (
    <div 
      className="bg-white rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)] p-6 sm:p-8 transition-all duration-300 group animation-container gpu-accelerate hover:shadow-[0_8px_24px_rgba(61,5,12,0.10)]"
      style={{ contain: "layout style paint", transform: "translateZ(0)" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div 
            className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${bgColor} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform gpu-accelerate`}
            style={{ transform: "translateZ(0)", willChange: "transform, opacity", backfaceVisibility: "hidden" }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
