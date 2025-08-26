import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export const SearchInput: React.FC<{
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
  onSearch: (value: string) => void;
}> = ({
  placeholder = "Search...",
  className = "",
  debounceDelay = 500,
  onSearch,
}) => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [value, debounceDelay]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
      />
    </div>
  );
};