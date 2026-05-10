import React from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

interface SelectFieldProps {
  label: string;
  hint: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="form-input w-full text-left flex items-center justify-between gap-2 cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate text-gray-900">
            {selectedOption?.label || "Select..."}
          </span>
          <HiOutlineChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[240px] overflow-y-auto py-1"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  opt.value === value
                    ? "bg-red-50 text-red-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1.5">{hint}</p>
    </div>
  );
}
