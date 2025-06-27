import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "default" | "outline" | "filled";
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option...",
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    //setIsEmpty(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    if (value === "any") return "Any";
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  // const getVariantStyles = () => {
  //   switch (variant) {
  //     case "outline":
  //       return cn(
  //         "border-2 bg-transparent transition-all duration-200 ease-in-out rounded-xl",
  //         isFocused || isOpen
  //           ? "border-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
  //           : "border-gray-300 hover:border-gray-400"
  //       );
  //     case "filled":
  //       return "border border-gray-200 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:border-blue-500 rounded-xl";
  //     default:
  //       return "border border-gray-300 bg-white hover:border-blue-400 focus-within:border-blue-500 rounded-xl";
  //   }
  // };

  const getVariantStyles = () => {
    // Material UI outline variant styling
    return "border-2 border-gray-300 bg-white hover:border-blue-500 focus-within:border-blue-500 focus-within:shadow-sm";
  };

  // const getLabelStyles = () => {
  //   const baseStyles =
  //     "absolute left-3 transition-all duration-200 ease-in-out pointer-events-none";

  //   if (isFocused || isOpen) {
  //     return cn(
  //       baseStyles,
  //       "text-xs font-medium -top-2 bg-white px-1 rounded-sm",
  //       isFocused || isOpen ? "text-blue-600" : "text-gray-600"
  //     );
  //   }

  //   return cn(baseStyles, "text-gray-500 top-3 text-sm");
  // };

  return (
    <div className="space-y-2 w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div
          className={cn(
            "min-h-[56px] w-full rounded-md px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between",
            getVariantStyles(),
            isOpen && "border-blue-500 shadow-md"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={cn(
              "text-base",
              !value ? "text-gray-500" : "text-gray-900"
            )}
          >
            {getDisplayValue()}
          </span>
          <ChevronDown
            size={20}
            className={cn(
              "text-gray-600 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {/* Any Option */}
            <div
              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
              onClick={() => handleSelect("any")}
            >
              <div
                className={cn(
                  "w-5 h-5 border-2 border-gray-400 rounded mr-3 flex items-center justify-center",
                  value === "any" && "bg-blue-500 border-blue-500"
                )}
              >
                {value === "any" && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm font-medium text-gray-700">Any</span>
            </div>

            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => handleSelect(option.value)}
              >
                <div
                  className={cn(
                    "w-5 h-5 border-2 border-gray-400 rounded mr-3 flex items-center justify-center",
                    value === option.value && "bg-blue-500 border-blue-500"
                  )}
                >
                  {value === option.value && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleSelect;
