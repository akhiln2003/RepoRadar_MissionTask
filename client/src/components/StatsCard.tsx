export const StatsCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}> = ({ icon, label, value, color = "text-gray-500" }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className={color}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
        {value.toLocaleString()}
      </span>
    </div>
  </div>
);
