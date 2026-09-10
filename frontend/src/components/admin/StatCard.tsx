interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  bgColor?: string;
}

const StatCard = ({ label, value, icon, bgColor = "from-[#0e7c85] to-cyan-600" }: StatCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${bgColor} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
