"use client";
import React, { useRef, useState } from "react";
import clsx from "clsx";
import { useAttachments } from "@/hooks/useAttachments";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Attachment } from "@/types/api";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useToaster } from "@/components/ui/Toaster";
import { AttachmentCard } from "@/components/ui/AttachmentCard";
import { FilePreview } from "@/components/ui/FilePreview";

interface AttachmentsSectionProps {
  className?: string;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = () => {
  const {
    attachments,
    isLoading,
    error,
    isUploading,
    uploadProgress,
    uploadFiles,
    deleteAttachment,
    refreshAttachments,
  } = useAttachments();

  const { showToast } = useToaster();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deleteModalAttachment, setDeleteModalAttachment] = useState<Attachment | null>(null);

  const isValidFileType = (file: File): boolean => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    return allowedTypes.includes(file.type) || allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(isValidFileType);
    if (validFiles.length !== files.length) {
      console.warn("Some files were rejected. Only PDF, DOC, and DOCX files are allowed.");
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
      showToast({ type: "success", title: "Upload successful", description: `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} uploaded successfully` });
    } catch (error) {
      console.error("Upload failed:", error);
      showToast({ type: "error", title: "Upload failed", description: error instanceof Error ? error.message : "Failed to upload files" });
    }
  };

  const handleDeleteModal = (attachment: Attachment) => setDeleteModalAttachment(attachment);
  const closeDeleteModal = () => setDeleteModalAttachment(null);

  const handleDownloadAttachment = (attachment: Attachment) => {
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name || "attachment";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAttachment = async () => {
    if (!deleteModalAttachment) return;
    const attachmentId = deleteModalAttachment.id || deleteModalAttachment._id;
    if (!attachmentId) {
      console.error("No attachment ID found");
      return;
    }
    try {
      await deleteAttachment(attachmentId);
      closeDeleteModal();
      showToast({ type: "success", title: "Attachment deleted", description: "Attachment has been removed successfully" });
    } catch (error) {
      console.error("Delete failed:", error);
      showToast({ type: "error", title: "Delete failed", description: error instanceof Error ? error.message : "Failed to delete attachment" });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10 bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Attachments</h3>
          {attachments.length > 0 && (
            <button className="bg-transparent border-none text-gray-900 text-base flex items-center gap-1 cursor-pointer font-medium" disabled>
              Upload <span className="text-[1.2em] ml-1">+</span>
            </button>
          )}
        </div>
        <div className="flex gap-8 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm">
              <Skeleton width="120px" height="90px" />
              <Skeleton width="80%" height="16px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Attachments</h3>
        </div>
        <ErrorState title="Failed to load attachments" message={error} onRetry={() => refreshAttachments()} />
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white rounded-xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Attachments</h3>
      </div>

      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileInputChange} className="hidden" />

      <div className="flex gap-8 flex-wrap">
        {attachments.length === 0 && selectedFiles.length === 0 ? (
          <div
            className={clsx(
              "flex flex-col items-center justify-center py-12 px-8 w-full text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-100",
              isDragging && "border-primary bg-red-50"
            )}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={clsx("w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center mb-6 text-white text-2xl transition-all", isDragging && "bg-red-800 scale-110")}>
              <FaPlus />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">Add your resume, portfolio, or other documents</p>
            <p className="text-sm text-gray-500 max-w-[350px] leading-relaxed">Click to browse or drag and drop PDF, DOC, or DOCX files here</p>
          </div>
        ) : (
          <>
            {attachments.map((attachment: Attachment) => {
              const attachmentId = attachment.id || attachment._id || "";
              return <AttachmentCard key={attachmentId} attachment={attachment} onDelete={handleDeleteModal} onDownload={handleDownloadAttachment} />;
            })}

            <div
              className={clsx(
                "bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 flex flex-col items-center justify-center min-w-[180px] cursor-pointer transition-all hover:border-primary hover:bg-red-50",
                isDragging && "border-primary bg-red-50"
              )}
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-4 text-white">
                <FaPlus />
              </div>
              <p className="text-base text-gray-700 mt-2">Upload more</p>
            </div>
          </>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-[0.9375rem] font-semibold text-gray-500 m-0 mb-4">Files ready to upload:</h4>
          <div className="flex flex-col gap-3 items-start">
            {selectedFiles.map((file, index) => (
              <FilePreview key={`selected-${index}`} file={file} onRemove={() => removeSelectedFile(index)} disabled={isUploading} />
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="flex gap-4 mt-8">
          <button
            className="bg-primary text-white border-none rounded-md py-3 px-8 text-base font-semibold cursor-pointer transition-colors hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleFinalUpload}
            disabled={isUploading}
          >
            {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`}
          </button>
          <button className="bg-gray-100 text-gray-900 border-none rounded-md py-3 px-8 text-base font-medium cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed" onClick={() => setSelectedFiles([])} disabled={isUploading}>
            Cancel
          </button>
        </div>
      )}

      {isUploading && (
        <div className="w-full h-1 bg-gray-200 rounded-sm overflow-hidden mt-4">
          <div className="h-full bg-primary rounded-sm transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {deleteModalAttachment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDeleteModal}>
          <div className="bg-white rounded-xl max-w-[400px] w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 m-0">Delete Attachment</h3>
              <button className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded flex items-center justify-center transition-colors hover:text-gray-700" onClick={closeDeleteModal}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed m-0">Are you sure you want to delete &quot;{deleteModalAttachment.name}&quot;? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 p-6 pt-4 justify-end">
              <button className="bg-gray-100 text-gray-700 border-none rounded-md py-2 px-4 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-200" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="bg-primary text-white border-none rounded-md py-2 px-4 text-sm font-medium cursor-pointer transition-colors hover:bg-primary-hover" onClick={handleDeleteAttachment}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
