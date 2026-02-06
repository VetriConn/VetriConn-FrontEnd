"use client";
import React from "react";
import {
  FaEdit,
  FaGraduationCap,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Education } from "@/types/api";

interface EducationCardProps {
  education: Education[];
  onEdit: () => void;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  education,
  onEdit,
}) => {
  const formatYearRange = (startYear?: string, endYear?: string) => {
    if (!startYear && !endYear) return "";
    if (!startYear) return endYear;
    if (!endYear) return `${startYear} - Present`;

    return `${startYear} - ${endYear}`;
  };

  const hasEducation = education && education.length > 0;

  return (
    <div
      id="education-card"
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          aria-label="Edit education"
        >
          <FaEdit className="text-sm" />
          Edit
        </button>
      </div>

      {hasEducation ? (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <FaGraduationCap className="text-purple-600 text-lg" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {edu.degree}
                </h3>
                <p className="text-base font-medium text-gray-700 mb-2">
                  {edu.institution}
                </p>

                {/* Field of study */}
                {edu.field_of_study && (
                  <p className="text-sm text-gray-600 mb-2">
                    {edu.field_of_study}
                  </p>
                )}

                {/* Year range and location */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  {(edu.start_year || edu.end_year) && (
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-xs" />
                      <span>
                        {formatYearRange(edu.start_year, edu.end_year)}
                      </span>
                    </div>
                  )}

                  {edu.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-xs" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FaGraduationCap className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500 text-sm mb-2">No education added yet</p>
          <p className="text-gray-400 text-xs">
            Click the Edit button to add your education history
          </p>
        </div>
      )}
    </div>
  );
};
