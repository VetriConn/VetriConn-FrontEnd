# Employer Settings Page Implementation

## Overview

Created a separate settings page for employers at `/dashboard/employer/settings` that matches the UI/UX style of the job seeker settings page while providing employer-specific functionality.

## Changes Made

### 1. Extracted Shared Components

Created reusable settings components in `frontend/components/ui/settings/`:

- **Toggle.tsx** - Switch component for boolean settings
- **SectionCard.tsx** - Consistent card wrapper for settings sections
- **SelectField.tsx** - Dropdown select component with custom styling
- **index.ts** - Barrel export for easy imports

These components maintain the same visual style and behavior across both settings pages.

### 2. Created Employer Settings Page

**File:** `frontend/app/dashboard/employer/settings/page.tsx`

**Sections:**

1. **Account Information** (read-only)
   - Email address display
   - Link to company profile page

2. **Password & Security**
   - Change password functionality
   - Two-step verification toggle

3. **Company Preferences**
   - Company size selection
   - Industry selection
   - Hiring frequency selection

4. **Notifications**
   - Email notifications toggle
   - Application alerts toggle
   - Platform updates toggle

5. **Accessibility Preferences**
   - Text size selection (Normal, Large, Extra Large)
   - High contrast mode toggle

6. **Privacy & Data**
   - Company profile visibility settings
   - Data export functionality
   - Account deactivation

**Modals:**
- Change Password Modal (with password requirements validation)
- Deactivate Account Modal (with confirmation steps)

### 3. Updated Navigation

**File:** `frontend/components/ui/DashboardNavbar.tsx`

Updated settings links to route based on user role:

- **Employers:** `/dashboard/employer/settings`
- **Job Seekers:** `/dashboard/settings`

Changes made in:
- Desktop profile dropdown (line ~499)
- Mobile menu (line ~704)

## Key Differences from Job Seeker Settings

### Removed Sections:
- Job Preferences (job-seeking status, work type, location, experience level)
- Profile visibility to employers

### Added Sections:
- Company Preferences (company size, industry, hiring frequency)
- Company profile visibility (public, registered-only, private)

### Updated Copy:
- "Employer Settings" instead of "Account settings"
- "Company account preferences" instead of "account preferences"
- "Application Alerts" instead of "Job Alerts"
- "Platform Updates" instead of "Community Updates"
- Deactivation warning mentions "job postings" and "applicant data"

## UI/UX Consistency

Both settings pages share:
- Same layout structure (max-w-3xl container)
- Same section card styling (white bg, rounded-xl, border)
- Same form input styling (form-input class)
- Same toggle switch design
- Same modal styling and animations
- Same color scheme (primary red, gray scale)
- Same typography (Lato headings, Open Sans body)
- Same spacing patterns (p-6 sections, space-y-5 forms)
- Same accessibility features (touch targets, focus states)

## Testing Checklist

- [ ] Employer can access `/dashboard/employer/settings`
- [ ] Job seeker can access `/dashboard/settings`
- [ ] Settings link in navbar routes correctly based on role
- [ ] Change password modal works
- [ ] Password requirements validation works
- [ ] Toggle switches update state
- [ ] Select dropdowns work
- [ ] Text size changes apply
- [ ] High contrast mode toggles
- [ ] Data export downloads file
- [ ] Deactivate account modal shows warnings
- [ ] All touch targets meet 44px minimum
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Future Enhancements

Potential employer-specific settings to add:

1. **Billing & Subscription**
   - Payment method management
   - Subscription plan details
   - Invoice history

2. **Team Management**
   - Add/remove team members
   - Role permissions
   - Activity logs

3. **Job Posting Preferences**
   - Default job posting settings
   - Auto-approval settings
   - Application form customization

4. **Hiring Pipeline**
   - Custom application stages
   - Email templates
   - Automated responses

5. **Analytics Preferences**
   - Report frequency
   - Metrics to track
   - Export formats

## Related Files

- `frontend/app/dashboard/settings/page.tsx` - Job seeker settings
- `frontend/components/ui/DashboardNavbar.tsx` - Navigation routing
- `frontend/components/ui/settings/` - Shared components
- `frontend/hooks/useAccessibility.tsx` - Accessibility state management
- `frontend/lib/api/settings.ts` - Settings API calls

## Notes

- Both settings pages use the same API endpoints (`updateUserSettings`, `changePassword`, etc.)
- Settings are persisted to backend on change (fire-and-forget pattern)
- Password change requires current password for security
- Account deactivation requires password + typing "DEACTIVATE"
- Data export generates JSON file with timestamp
- All modals use z-[200] to appear above other UI elements
