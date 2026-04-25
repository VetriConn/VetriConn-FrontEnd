"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  deleteEmployerJob,
  getEmployerJobs,
  updateEmployerJob,
} from "@/lib/api";
import { useToaster } from "@/components/ui/Toaster";
import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePlusCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ManageJobsPage() {
  const { showToast } = useToaster();
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const {
    data: jobs = [],
    isLoading,
    mutate,
  } = useSWR("employer-jobs-manage", getEmployerJobs);

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return jobs.slice(startIndex, startIndex + itemsPerPage);
  }, [jobs, currentPage]);

  // Reset to page 1 when jobs change
  const totalJobs = jobs.length;
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalJobs, currentPage, totalPages]);

  const handleToggleStatus = async (
    jobId: string,
    nextStatus: "draft" | "published",
  ) => {
    setBusyJobId(jobId);
    try {
      await updateEmployerJob(jobId, { status: nextStatus });
      await mutate();
      showToast({
        type: "success",
        title:
          nextStatus === "published" ? "Job published" : "Job moved to draft",
        description: "Job status updated successfully",
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Update failed",
        description:
          err instanceof Error ? err.message : "Could not update job",
      });
    } finally {
      setBusyJobId(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    setBusyJobId(jobId);
    try {
      await deleteEmployerJob(jobId);
      await mutate();
      showToast({
        type: "success",
        title: "Job deleted",
        description: "The job posting was removed",
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Delete failed",
        description:
          err instanceof Error ? err.message : "Could not delete job",
      });
    } finally {
      setBusyJobId(null);
    }
  };

  return (
    <div className="max-w-200 mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Job Postings
          </h1>
          <Link
            href="/dashboard/employer/post-job"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all shadow-sm group min-h-[44px]"
          >
            <HiOutlinePlusCircle className="w-5 h-5 transition-transform group-hover:-rotate-45" />
            Post New Job
          </Link>
        </div>

        <div className="mb-6 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
          {jobs.length} job posting{jobs.length === 1 ? "" : "s"} created
        </div>

        {/* Job Cards */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-500">
            Loading postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineBriefcase className="w-7 h-7" />
            </div>
            <p className="text-sm text-gray-500">No postings yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:px-5 md:py-4 hover:shadow-sm transition-shadow"
                >
                  {/* Mobile & Desktop Layout */}
                  <div className="flex flex-col gap-3">
                    {/* Job Info - Clickable */}
                    <Link
                      href={
                        job.status === "published"
                          ? `/jobs/${job._id}`
                          : `/dashboard/employer/post-job?draft=${job._id}`
                      }
                      className="min-w-0 group"
                    >
                      <h3 className="text-base md:text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {job.role}
                        {job.status === "draft" && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <HiOutlineMapPin className="w-3.5 h-3.5" />
                          {job.location || "Remote"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HiOutlineCalendar className="w-3.5 h-3.5" />
                          Posted {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </Link>

                    {/* Stats & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {/* Application Count */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium self-start">
                        <HiOutlineUsers className="w-4 h-4" />
                        {job.application_count || 0} application
                        {(job.application_count || 0) === 1 ? "" : "s"}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.status === "published" && (
                          <Link
                            href={`/jobs/${job._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 min-h-[32px]"
                          >
                            <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">View as Candidate</span>
                            <span className="sm:hidden">View</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          disabled={busyJobId === job._id}
                          onClick={() =>
                            handleToggleStatus(
                              job._id,
                              job.status === "published" ? "draft" : "published",
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 min-h-[32px]"
                        >
                          {job.status === "published" ? (
                            <HiOutlineEyeSlash className="w-4 h-4" />
                          ) : (
                            <HiOutlineEye className="w-4 h-4" />
                          )}
                          {job.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          disabled={busyJobId === job._id}
                          onClick={() => handleDelete(job._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 min-h-[32px]"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, jobs.length)} of {jobs.length} jobs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
                  >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
  );
}
