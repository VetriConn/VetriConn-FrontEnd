"use client";
import React from "react";
import { FaEdit, FaFileAlt, FaCalendar, FaFile } from "react-icons/fa";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { UserDocument } from "@/types/api";

interface DocumentsCardProps {
  documents: UserDocument[];
  onEdit: () => void;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({
  documents,
  onEdit,
}) => {
  const formatDate = (date?: Date | string) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getFileIcon = (fileName?: string, fileType?: string) => {
    const name = (fileName || "").toLowerCase();
    const type = (fileType || "").toLowerCase();

    if (name.includes(".pdf") || type === "pdf") {
      return <BsFillFileEarmarkPdfFill className="text-red-600 text-lg" />;
    }
    if (name.includes(".doc") || type === "doc" || type === "docx") {
      return <IoDocumentText className="text-blue-600 text-lg" />;
    }
    return <FaFileAlt className="text-gray-600 text-lg" />;
  };

  const getFileTypeLabel = (fileName?: string, fileType?: string) => {
    const name = (fileName || "").toLowerCase();
    const type = (fileType || "").toLowerCase();

    if (name.includes(".pdf") || type === "pdf") return "PDF";
    if (name.includes(".docx") || type === "docx") return "DOCX";
    if (name.includes(".doc") || type === "doc") return "DOC";

    // Try to extract extension from filename
    const extension = name.split(".").pop()?.toUpperCase();
    return extension || "Document";
  };

  const hasDocuments = documents && documents.length > 0;

  return (
    <div
      id="documents-card"
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Documents</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          aria-label="Edit documents"
        >
          <FaEdit className="text-sm" />
          Edit
        </button>
      </div>

      {hasDocuments ? (
        <div className="space-y-6">
          {documents.map((doc, index) => (
            <div
              key={doc._id || index}
              className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                {getFileIcon(doc.name, doc.file_type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {doc.name}
                </h3>

                {/* File type */}
                <p className="text-sm text-gray-600 mb-2">
                  {getFileTypeLabel(doc.name, doc.file_type)}
                </p>

                {/* Upload date */}
                {doc.upload_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendar className="text-xs" />
                    <span>Uploaded {formatDate(doc.upload_date)}</span>
                  </div>
                )}

                {/* Description (if available) */}
                {doc.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">
                    {doc.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FaFile className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-500 text-sm mb-2">No documents added yet</p>
          <p className="text-gray-400 text-xs">
            Click the Edit button to upload your documents
          </p>
        </div>
      )}
    </div>
  );
};
