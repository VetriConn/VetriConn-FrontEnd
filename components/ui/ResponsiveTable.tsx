/**
 * ResponsiveTable Component
 * 
 * A reusable pattern for transforming complex tables into mobile-friendly card layouts.
 * 
 * Desktop (md and up): Displays as a traditional table
 * Mobile: Transforms into stacked cards with key-value pairs
 * 
 * Requirements: 4.2, 4.3, 4.4, 4.5
 */

import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  /** Column header label */
  label: string;
  /** Accessor key for the data */
  key: keyof T | string;
  /** Custom render function for the cell */
  render?: (row: T) => React.ReactNode;
  /** Hide this column on mobile cards (useful for redundant data) */
  hideOnMobile?: boolean;
  /** Custom label for mobile card view (defaults to column label) */
  mobileLabel?: string;
  /** Column width class (e.g., "w-1/4") */
  className?: string;
}

export interface ResponsiveTableProps<T> {
  /** Array of data rows */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Unique key extractor for each row */
  keyExtractor: (row: T, index: number) => string;
  /** Optional actions to display on each row/card */
  renderActions?: (row: T) => React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className for the container */
  className?: string;
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function getNestedValue<T>(obj: T, path: string): any {
  return path.split(".").reduce((acc: any, part) => acc?.[part], obj);
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  renderActions,
  emptyMessage = "No data available",
  isLoading = false,
  className = "",
}: ResponsiveTableProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
        <div className="p-12 text-center text-sm text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
        <div className="p-12 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table View - hidden on mobile */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${index}`}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.className || ""}`}
                >
                  {column.label}
                </th>
              ))}
              {renderActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row, rowIndex)}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`px-4 py-4 text-sm text-gray-900 ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(row)
                      : getNestedValue(row, column.key as string)}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - hidden on desktop */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={keyExtractor(row, rowIndex)}
            className="bg-white border border-gray-200 rounded-lg p-4 w-full"
          >
            {/* Card content - key-value pairs */}
            <div className="space-y-3">
              {columns
                .filter((column) => !column.hideOnMobile)
                .map((column, colIndex) => {
                  const value = column.render
                    ? column.render(row)
                    : getNestedValue(row, column.key as string);

                  // Skip empty values
                  if (value === null || value === undefined || value === "") {
                    return null;
                  }

                  return (
                    <div key={`card-field-${rowIndex}-${colIndex}`}>
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {column.mobileLabel || column.label}
                      </div>
                      <div className="text-sm text-gray-900">{value}</div>
                    </div>
                  );
                })}
            </div>

            {/* Actions */}
            {renderActions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  {renderActions(row)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Example Usage ──────────────────────────────────────────────────────────

/**
 * Example usage:
 * 
 * ```tsx
 * interface Application {
 *   id: string;
 *   position: string;
 *   company: string;
 *   location: string;
 *   status: string;
 *   appliedDate: string;
 * }
 * 
 * const columns: TableColumn<Application>[] = [
 *   {
 *     label: "Position",
 *     key: "position",
 *     className: "w-1/4",
 *   },
 *   {
 *     label: "Company",
 *     key: "company",
 *     className: "w-1/4",
 *   },
 *   {
 *     label: "Location",
 *     key: "location",
 *     className: "w-1/6",
 *   },
 *   {
 *     label: "Status",
 *     key: "status",
 *     render: (row) => <StatusBadge status={row.status} />,
 *   },
 *   {
 *     label: "Applied Date",
 *     key: "appliedDate",
 *     mobileLabel: "Applied",
 *     render: (row) => formatDate(row.appliedDate),
 *   },
 * ];
 * 
 * <ResponsiveTable
 *   data={applications}
 *   columns={columns}
 *   keyExtractor={(row) => row.id}
 *   renderActions={(row) => (
 *     <>
 *       <button onClick={() => handleView(row.id)}>View</button>
 *       <button onClick={() => handleDelete(row.id)}>Delete</button>
 *     </>
 *   )}
 *   emptyMessage="No applications found"
 *   isLoading={isLoading}
 * />
 * ```
 */
