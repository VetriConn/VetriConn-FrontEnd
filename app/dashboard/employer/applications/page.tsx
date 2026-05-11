"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  getEmployerApplications,
  updateEmployerApplicationStatus,
} from "@/lib/api";
import { useToaster } from "@/components/ui/Toaster";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";
import { formatDate } from "@/lib/date-utils";


function getJobLabel(
  job:
    | string
    | {
        _id: string;
        id: string;
        role: string;
        company_name: string;
        location?: string;
        company_logo?: string;
      },
) {
  if (typeof job === "string") return "Job posting";
  return `${job.role} • ${job.company_name}`;
}

function ApplicationStatusBadge({ status }: { status: string }) {
  if (status === "accepted") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
        Accepted
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
        Rejected
      </span>
    );
  }

  if (status === "reviewed") {
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
        Reviewed
      </span>
    );
  }

  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
      Pending
    </span>
  );
}

export default function ApplicationsPage() {
  const { showToast } = useToaster();
  const [busyApplicationId, setBusyApplicationId] = useState<string | null>(
    null,
  );
  const {
    data: applications = [],
    isLoading,
    mutate,
  } = useSWR("employer-applications", getEmployerApplications);

  const handleStatusChange = async (
    applicationId: string,
    status: "reviewed" | "accepted" | "rejected",
  ) => {
    setBusyApplicationId(applicationId);
    try {
      await updateEmployerApplicationStatus(applicationId, status);
      await mutate();
      showToast({
        type: "success",
        title: "Application updated",
        description: `Status changed to ${status}`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Update failed",
        description:
          err instanceof Error
            ? err.message
            : "Could not update application status",
      });
    } finally {
      setBusyApplicationId(null);
    }
  };

  return (
    <RoleGuard allowedRoles={["employer"]}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Applications & Applicants
          </h1>
          <p className="text-gray-500">
            Review and manage candidates who have applied to your job postings.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-gray-500 font-medium">
              Loading applications...
            </p>
          </div>
        ) : applications.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Applied For
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app: any) => (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-primary font-bold text-sm">
                            {app.user_id?.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {app.user_id?.full_name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.user_id?.email || "No email provided"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <HiOutlineBriefcase className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-700 truncate max-w-[200px]">
                            {getJobLabel(app.job_id)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                          {formatDate(app.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.resume_url && (
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-red-50 transition-colors"
                              title="Download Resume"
                            >
                              <HiOutlineDocumentArrowDown className="w-5 h-5" />
                            </a>
                          )}
                          <select
                            value={app.status}
                            disabled={busyApplicationId === app._id}
                            onChange={(e) =>
                              handleStatusChange(app._id, e.target.value as any)
                            }
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <HiOutlineUserGroup className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              When candidates apply to your job postings, they will appear here
              for you to review.
            </p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
