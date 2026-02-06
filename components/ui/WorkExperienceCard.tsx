"use client";
import React from "react";
import { FaEdit, FaBriefcase, FaCalendar } from "react-icons/fa";
import { WorkExperience } from "@/types/api";

interface WorkExperienceCardProps {
  experiences: WorkExperience[];
  onEdit: () => void;
}

export const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({
  experiences,
  onEdit,
}) => {
  const formatDate = (date?: string) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return date;
    }
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    const start = formatDate(startDate) || "Present";
    const end = formatDate(endDate) || "Present";

    if (!startDate && !endDate) return "";
    if (!startDate) return end;
    if (!endDate) return `${start} - Present`;

    return `${start} - ${end}`;
  };

  const hasExperiences = experiences && experiences.length > 0;

  return (
    <div
      id="work-experience-card"
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          aria-label="Edit work experience"
        >
          <FaEdit className="text-sm" />
          Edit
        </button>
      </div>

      {hasExperiences ? (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FaBriefcase className="text-blue-600 text-lg" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {exp.position}
                </h3>
                <p className="text-base font-medium text-gray-700 mb-2">
                  {exp.company}
                </p>

                {/* Date range */}
                {(exp.start_date || exp.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <FaCalendar className="text-xs" />
                    <span>{formatDateRange(exp.start_date, exp.end_date)}</span>
                  </div>
                )}

                {/* Description */}
                {exp.description && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FaBriefcase className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500 text-sm mb-2">
            No work experience added yet
          </p>
          <p className="text-gray-400 text-xs">
            Click the Edit button to add your work history
          </p>
        </div>
      )}
    </div>
  );
};
