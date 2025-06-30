import * as React from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "../lib/utils";

// interface Option {
//   value: string;
//   label: string;
// }

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  variant?: "default" | "outline" | "filled";
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options...",
  variant = "outline",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSelectAll = () => {
    if (value.length === options.length) {
      // If all are selected, deselect all
      onChange([]);
    } else {
      // If not all are selected, select all
      onChange(options.map((option) => option));
    }
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedLabels = options
    .filter((option) => value.includes(option))
    .map((option) => option);
  const isAllSelected = value.length === options.length && options.length > 0;
  const hasValue = value.length > 0;

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return cn(
          "border-2 bg-transparent transition-all duration-200 ease-in-out rounded-sm",
          isFocused || isOpen
            ? "border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
            : "border-gray-300 hover:border-gray-400"
        );
      case "filled":
        return "border border-gray-200 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:border-blue-500 rounded-xl";
      default:
        return "border border-gray-300 bg-white hover:border-blue-400 focus-within:border-blue-500 rounded-xl";
    }
  };

  const getLabelStyles = () => {
    const baseStyles =
      "absolute left-3 transition-all duration-200 ease-in-out pointer-events-none";

    // if (isFocused || isOpen || hasValue) {
    return cn(
      baseStyles,
      "text-xs font-medium -top-2 bg-white px-1 rounded-sm",
      isFocused || isOpen ? "text-blue-600" : "text-gray-600"
    );

    return cn(baseStyles, "text-gray-500 top-3 text-sm");
  };

  return (
    <div className="space-y-1 w-full" ref={dropdownRef}>
      <div className="relative">
        <div
          className={cn(
            "min-h-[56px] w-full px-3 py-3 cursor-pointer relative",
            getVariantStyles()
          )}
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(!isOpen);
          }}
        >
          <label className={getLabelStyles()}>{label}</label>

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-transparent select-none">
                  {placeholder}
                </span>
              ) : (
                selectedLabels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm px-2.5 py-1 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors duration-150"
                  >
                    {label}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900 transition-colors duration-150"
                      onClick={(e) =>
                        removeValue(
                          options.find((opt) => opt === label) ?? "",
                          e
                        )
                      }
                    />
                  </span>
                ))
              )}
            </div>
            <ChevronDown
              size={20}
              className={cn(
                "text-gray-400 transition-transform duration-200 ease-in-out ml-2",
                isOpen && "rotate-180",
                (isFocused || isOpen) && "text-blue-600"
              )}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-64 overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Select All Option */}
            <div
              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
              onClick={handleSelectAll}
            >
              <div
                className={cn(
                  "w-5 h-5 border-2 rounded-lg mr-3 flex items-center justify-center transition-all duration-200",
                  isAllSelected
                    ? "bg-blue-600 border-blue-600 shadow-sm"
                    : "border-gray-300 hover:border-blue-400"
                )}
              >
                {isAllSelected && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Select All
              </span>
            </div>

            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleToggle(option)}
              >
                <div
                  className={cn(
                    "w-5 h-5 border-2 rounded-lg mr-3 flex items-center justify-center transition-all duration-200",
                    value.includes(option)
                      ? "bg-blue-600 border-blue-600 shadow-sm"
                      : "border-gray-300 hover:border-blue-400"
                  )}
                >
                  {value.includes(option) && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
