"use client";

import { HiOutlineUserGroup } from "react-icons/hi2";

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Applications &amp; Applicants
          </h1>
          <p className="text-gray-500">
            Review and manage applications from job seekers.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineUserGroup className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Applications Yet
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Once you post a job, applications from candidates will appear here.
            You&apos;ll be able to review profiles, shortlist candidates, and
            manage your hiring pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
