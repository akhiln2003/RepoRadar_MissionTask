import { X } from "lucide-react";

export const Alert: React.FC<{
  type: "error" | "success" | "info" | "warning";
  message: string;
  onClose?: () => void;
}> = ({ type, message, onClose }) => {
  const alertClasses = {
    error:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  };

  const iconClasses = {
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className={`mb-6 p-4 border rounded-lg ${alertClasses[type]}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`h-5 w-5 ${iconClasses[type]}`}>
            {type === "error" && "⚠"}
            {type === "success" && "✓"}
            {type === "info" && "ℹ"}
            {type === "warning" && "⚠"}
          </div>
          <p className="font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${iconClasses[type]}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};