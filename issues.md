# Frontend Issues & TODOs

## Known Issues

### 1. Applied Jobs - No Backend Support

- **Status:** Pending backend implementation
- **Description:** The `QuickActionsCard` has a "View applied jobs" action, but the backend has no `applied_jobs` field on the user model and no API endpoint to track job applications.
- **Current behavior:** Defaults to `0` and shows "No jobs applied for yet".
- **Action needed:** Add `applied_jobs: string[]` to the backend user schema, create API endpoints for applying/unapplying to jobs, then pass `appliedJobsCount` prop to `QuickActionsCard`.
- **Files involved:**
  - `components/ui/QuickActionsCard.tsx` (ready for prop)
  - `app/dashboard/profile/page.tsx` (needs to pass `appliedJobsCount` once available)
  - Backend: `schemas/user.ts`, `types/User.ts`, new controller needed
