"use client";
import React from "react";
import clsx from "clsx";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface PageHeaderProps {
  title: string;
  jobCount: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

const sortOptions = [
  { value: "updated", label: "Last updated" },
  { value: "created", label: "Recently posted" },
  { value: "title", label: "Job title" },
  { value: "company", label: "Company" },
];

const PageHeader = ({ title, jobCount, sortBy, sortOrder, onSortChange }: PageHeaderProps) => {
  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) onSortChange(newSortBy, sortOrder === "asc" ? "desc" : "asc");
    else onSortChange(newSortBy, "desc");
  };

  const getSortIcon = (option: string) => {
    if (sortBy !== option) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="flex items-center justify-between mb-0 py-1.5 px-6 pb-4 bg-white border-b border-gray-200 max-w-container mx-auto tablet:flex-col tablet:items-start tablet:gap-3 tablet:py-2 tablet:px-4 tablet:pb-3 sm:gap-2 sm:py-1.5 sm:px-4 sm:pb-3">
      <div className="flex items-center gap-3 tablet:w-full tablet:justify-between sm:flex-col sm:items-start sm:gap-1.5">
        <h1 className="font-lato text-2xl md:text-4xl font-bold text-gray-900 m-0">{title}</h1>
        <span className="bg-gray-100 text-gray-500 py-0.5 px-2.5 rounded-full text-xs md:text-sm font-semibold">{jobCount}</span>
      </div>
      <div className="flex items-center gap-3 tablet:w-full tablet:justify-start tablet:gap-2 sm:flex-col sm:items-start sm:gap-1.5">
        <span className="text-gray-500 text-xs md:text-sm font-medium">Sort by:</span>
        <div className="flex items-center gap-1.5 tablet:flex-wrap tablet:gap-1">
          {sortOptions.map((option) => (
            <button key={option.value} className={clsx("flex items-center gap-2 bg-transparent border-none text-gray-500 text-xs md:text-sm font-medium py-1.5 px-2.5 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:text-gray-700", sortBy === option.value && "text-primary bg-red-50 font-semibold")} onClick={() => handleSortChange(option.value)}>
              {option.label}
              <span className={clsx("flex items-center text-xs opacity-70", sortBy === option.value && "opacity-100")}>{getSortIcon(option.value)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
