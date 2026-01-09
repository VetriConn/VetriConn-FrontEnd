"use client";
import React, { useState, useEffect } from "react";
import { FaEllipsisV, FaTrash, FaDownload } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { Attachment } from "@/types/api";

interface AttachmentCardProps {
  attachment: Attachment;
  onDelete: (attachment: Attachment) => void;
  onDownload: (attachment: Attachment) => void;
}

export const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  onDelete,
  onDownload,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getFileIcon = (): React.ReactNode => {
    const filename = (attachment?.name || attachment.url?.split("/").pop() || "").toLowerCase();
    if (filename.includes(".pdf")) return <BsFillFileEarmarkPdfFill className="w-10 h-10 text-primary" />;
    return <IoDocumentText className="w-10 h-10 text-primary" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    const handleClickOutside = () => { if (isMenuOpen) setIsMenuOpen(false); };
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm transition-all duration-200 relative hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-center h-[90px] bg-red-50 rounded-lg mb-3">
        <div className="flex items-center justify-center w-full h-full py-2 px-6">{getFileIcon()}</div>
      </div>
      <div className="text-xs font-semibold text-gray-700 text-center mt-2 leading-tight break-words mb-2">{attachment.name}</div>
      <div className="flex items-center justify-between mt-2 w-full">
        <div className="text-[13px] text-gray-500 font-medium">
          {attachment.size || attachment.file_size ? formatFileSize(attachment.size || attachment.file_size || 0) : ""}
        </div>
        <div className="relative">
          <button className="bg-transparent border-none p-1 cursor-pointer text-gray-500 rounded transition-all duration-200 flex items-center justify-center hover:bg-gray-100 hover:text-gray-700" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} title="More options">
            <FaEllipsisV className="w-3.5 h-3.5" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px] py-2">
              <button className="w-full bg-transparent border-none py-3 px-4 text-left cursor-pointer flex items-center gap-2 text-sm text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-black [&:hover_svg]:text-primary" onClick={(e) => { e.stopPropagation(); onDownload(attachment); setIsMenuOpen(false); }}>
                <FaDownload className="text-gray-500 transition-colors duration-200" /> Download
              </button>
              <button className="w-full bg-transparent border-none py-3 px-4 text-left cursor-pointer flex items-center gap-2 text-sm text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-black [&:hover_svg]:text-primary" onClick={(e) => { e.stopPropagation(); onDelete(attachment); setIsMenuOpen(false); }}>
                <FaTrash className="text-gray-500 transition-colors duration-200" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
