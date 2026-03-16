/**
 * Jobs API Service
 * Job listing, search, applications, and saved jobs
 */

import { apiFetch, API_BASE_URL } from "./client";
import type { JobsResponse } from "@/types/api";

// Fetch jobs from database
export async function getJobs(options?: {
  page?: number;
  limit?: number;
  location?: string;
  search?: string;
}): Promise<JobsResponse[]> {
  const { page = 1, limit = 10, location, search } = options || {};

  // Build query parameters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (location) {
    queryParams.append("location", location);
  }

  if (search) {
    queryParams.append("search", search);
  }

  const data = await apiFetch<JobsResponse[] | { data?: JobsResponse[] }>(
    `${API_BASE_URL}/api/v1/jobs?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // Backend wraps jobs in { success, data, pagination } — extract the array
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

// Fetch single job by ID
export async function getJobById(jobId: string): Promise<JobsResponse> {
  return await apiFetch<JobsResponse>(`${API_BASE_URL}/api/v1/jobs/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Submit job application
export async function submitJobApplication(
  jobId: string,
  formData: FormData,
): Promise<{ message: string }> {
  return await apiFetch<{ message: string }>(
    `${API_BASE_URL}/api/v1/jobs/${jobId}/apply`,
    {
      method: "POST",
      body: formData,
    },
  );
}

// Save a job
export async function saveJob(jobId: string): Promise<{ message: string }> {
  return await apiFetch<{ message: string }>(
    `${API_BASE_URL}/api/v1/jobs/${jobId}/save`,
    {
      method: "POST",
    },
  );
}

// Unsave a job
export async function unsaveJob(jobId: string): Promise<{ message: string }> {
  return await apiFetch<{ message: string }>(
    `${API_BASE_URL}/api/v1/jobs/${jobId}/save`,
    {
      method: "DELETE",
    },
  );
}
