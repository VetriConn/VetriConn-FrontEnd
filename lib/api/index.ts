/**
 * API Module Barrel Export
 * Re-exports all API functions for backward compatibility with `@/lib/api` imports
 */

// Auth
export {
  loginUser,
  logoutUser,
  registerUser,
  uploadResume,
  resendVerificationEmail,
  requestPasswordReset,
  resetPasswordWithToken,
} from "./auth";
export type { ApiResponse, RegisterResponse } from "./auth";

// Profile
export {
  getUserProfile,
  patchUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "./profile";

// Jobs
export {
  getJobs,
  getJobById,
  submitJobApplication,
  getMyApplications,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getRecommendedJobs,
} from "./jobs";

// Contact
export { sendContactMessage } from "./contact";

// Settings & Account
export {
  changePassword,
  requestDataExport,
  deactivateAccount,
  updateUserSettings,
} from "./settings";

// Notifications
export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
} from "./notifications";

// Employer
export {
  getEmployerJobs,
  getEmployerJobById,
  getEmployerApplications,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
  updateEmployerApplicationStatus,
  uploadEmployerCompanyAsset,
  getEmployerMessageThreads,
  getEmployerThreadMessages,
  sendEmployerMessage,
  sendEmployerAttachmentMessage,
} from "./employer";

// Job Seeker Messaging (placeholder functions - to be implemented)
export const getJobSeekerMessageThreads = async () => {
  // TODO: Implement API call to GET /api/v1/job-seeker/message-threads
  return [];
};

export const getJobSeekerThreadMessages = async (applicationId: string) => {
  // TODO: Implement API call to GET /api/v1/job-seeker/threads/:applicationId/messages
  return { messages: [] };
};

export const sendJobSeekerMessage = async (applicationId: string, content: string) => {
  // TODO: Implement API call to POST /api/v1/job-seeker/messages
  return {
    _id: `msg-${Date.now()}`,
    sender: "job_seeker" as const,
    content,
    createdAt: new Date().toISOString(),
  };
};

export const sendJobSeekerAttachmentMessage = async (
  applicationId: string,
  file: File,
  content?: string
) => {
  // TODO: Implement API call to POST /api/v1/job-seeker/messages/attachment
  return {
    _id: `msg-${Date.now()}`,
    sender: "job_seeker" as const,
    content: content || "Sent an attachment",
    createdAt: new Date().toISOString(),
    attachment_url: "#",
    attachment_name: file.name,
  };
};
