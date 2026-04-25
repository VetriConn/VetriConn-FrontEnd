"use client";
import React from "react";
import clsx from "clsx";

interface AccordionProps {
  className?: string;
  title: React.ReactNode;
  symbol?: React.ReactNode;
  content?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  className = "",
  title,
  symbol,
  content,
  open,
  onToggle,
  children,
}) => {
  return (
    <div
      className={clsx(
        "rounded-20 transition-shadow duration-200 overflow-hidden mobile:rounded-xl",
        className
      )}
    >
      <button
        className={clsx(
          "w-full bg-transparent border-none outline-none text-left flex items-center justify-between py-4 px-8 rounded-20 cursor-pointer text-xl transition-colors duration-150 hover:bg-black/5 mobile:py-3 mobile:px-5 mobile:text-base mobile:rounded-xl",
          open && "bg-black/5"
        )}
        onClick={onToggle}
        aria-expanded={open}
        type="button"
      >
        <span>{title}</span>
        <span className="text-base font-bold ml-6 leading-none flex items-center mobile:ml-4 mobile:text-sm">
          {symbol}
        </span>
      </button>
      <div
        className={clsx(
          open
            ? "block font-open-sans text-text-muted text-lg bg-black/5 px-8 pb-6 leading-relaxed animate-fadeIn mobile:text-sm mobile:px-5 mobile:pb-4"
            : "hidden"
        )}
      >
        {open && (
          <div>
            {content}
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
