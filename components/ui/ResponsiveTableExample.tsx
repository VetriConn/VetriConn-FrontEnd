/**
 * ResponsiveTableExample Component
 * 
 * Demonstrates the responsive table-to-card transformation pattern
 * with a realistic example of an applications table.
 * 
 * This example shows:
 * - Desktop: Traditional table layout with 5+ columns
 * - Mobile: Card layout with key-value pairs
 * - Touch-friendly action buttons
 * - Status badges and formatted dates
 */

"use client";

import React, { useState } from "react";
import { ResponsiveTable, TableColumn } from "./ResponsiveTable";
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Application {
  id: string;
  position: string;
  company: string;
  location: string;
  status: "pending" | "reviewed" | "interview" | "accepted" | "rejected";
  appliedDate: string;
  salary: string;
}

// ─── Status Badge Component ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: Application["status"] }) {
  const config = {
    pending: {
      label: "Pending",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
    },
    reviewed: {
      label: "Reviewed",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    interview: {
      label: "Interview",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
    },
    accepted: {
      label: "Accepted",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
    rejected: {
      label: "Rejected",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
    },
  };

  const { label, bgColor, textColor, borderColor } = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor}`}
    >
      {label}
    </span>
  );
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Example Component ──────────────────────────────────────────────────────

export function ResponsiveTableExample() {
  const [isLoading] = useState(false);

  // Sample data
  const applications: Application[] = [
    {
      id: "1",
      position: "Senior Operations Manager",
      company: "Tech Solutions Inc.",
      location: "Toronto, ON",
      status: "interview",
      appliedDate: "2024-01-15",
      salary: "$80k - $100k",
    },
    {
      id: "2",
      position: "Project Coordinator",
      company: "Global Logistics",
      location: "Vancouver, BC",
      status: "reviewed",
      appliedDate: "2024-01-10",
      salary: "$60k - $75k",
    },
    {
      id: "3",
      position: "Business Analyst",
      company: "Financial Services Corp",
      location: "Calgary, AB",
      status: "pending",
      appliedDate: "2024-01-08",
      salary: "$70k - $85k",
    },
    {
      id: "4",
      position: "Customer Success Manager",
      company: "SaaS Startup",
      location: "Remote",
      status: "accepted",
      appliedDate: "2024-01-05",
      salary: "$65k - $80k",
    },
    {
      id: "5",
      position: "Operations Director",
      company: "Manufacturing Co.",
      location: "Montreal, QC",
      status: "rejected",
      appliedDate: "2024-01-01",
      salary: "$90k - $110k",
    },
  ];

  // Column definitions
  const columns: TableColumn<Application>[] = [
    {
      label: "Position",
      key: "position",
      className: "w-1/4 font-semibold",
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.position}</div>
          {/* On mobile, show company inline */}
          <div className="md:hidden flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
            {row.company}
          </div>
        </div>
      ),
    },
    {
      label: "Company",
      key: "company",
      className: "w-1/5",
      hideOnMobile: true, // Hidden because it's shown inline with position on mobile
    },
    {
      label: "Location",
      key: "location",
      className: "w-1/6",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <HiOutlineMapPin className="w-4 h-4 text-gray-400" />
          {row.location}
        </div>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      label: "Applied Date",
      key: "appliedDate",
      mobileLabel: "Applied",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <HiOutlineCalendarDays className="w-4 h-4 text-gray-400" />
          {formatDate(row.appliedDate)}
        </div>
      ),
    },
    {
      label: "Salary Range",
      key: "salary",
      mobileLabel: "Salary",
      className: "w-1/6",
    },
  ];

  // Action handlers
  const handleView = (id: string) => {
    console.log("View application:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete application:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Application Tracker
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            Example of responsive table-to-card transformation pattern
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg md:text-2xl font-semibold text-blue-900 mb-2">
            Responsive Pattern Demo
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              <strong>Desktop (≥768px):</strong> Traditional table with all
              columns visible
            </li>
            <li>
              <strong>Mobile (&lt;768px):</strong> Stacked cards with key-value
              pairs
            </li>
            <li>
              <strong>Touch targets:</strong> All buttons meet 44px minimum for
              accessibility
            </li>
            <li>
              <strong>Responsive padding:</strong> p-4 on cards, px-4 py-4 on
              table cells
            </li>
          </ul>
        </div>

        {/* Responsive Table */}
        <ResponsiveTable
          data={applications}
          columns={columns}
          keyExtractor={(row) => row.id}
          renderActions={(row) => (
            <>
              <button
                onClick={() => handleView(row.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium text-primary bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors min-h-[44px]"
              >
                <HiOutlineEye className="w-4 h-4" />
                <span className="hidden sm:inline">View</span>
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition-colors min-h-[44px]"
              >
                <HiOutlineTrash className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}
          emptyMessage="No applications found"
          isLoading={isLoading}
        />

        {/* Pattern Documentation */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">
            Implementation Pattern
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2">
                Desktop Table View
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Uses <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">hidden md:block</code> to show only on desktop
                </li>
                <li>Traditional table markup with thead and tbody</li>
                <li>Hover states for better interactivity</li>
                <li>Actions column aligned to the right</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2">
                Mobile Card View
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Uses <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">md:hidden space-y-4</code> to show only on mobile
                </li>
                <li>Each row transforms into a card with key-value pairs</li>
                <li>
                  Cards use <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">p-4</code> padding and{" "}
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">w-full</code> width
                </li>
                <li>Actions displayed at the bottom with full-width buttons</li>
                <li>Touch targets meet 44px minimum (min-h-[44px])</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
