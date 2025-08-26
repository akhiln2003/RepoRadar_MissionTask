export const Button: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
}> = ({
  children,
  className = "",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300 focus:ring-gray-500",
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};
