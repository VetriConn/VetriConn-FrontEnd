"use client";

import React, { useState, useCallback } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePatchProfile } from "@/hooks/usePatchProfile";
import { ProfileHeader } from "@/components/pages/profile/ProfileHeader";
import { ContactInfoCard } from "@/components/ui/ContactInfoCard";
import { WorkExperienceCard } from "@/components/ui/WorkExperienceCard";
import { EducationCard } from "@/components/ui/EducationCard";
import { DocumentsCard } from "@/components/ui/DocumentsCard";
import { ProfileCompletionCard } from "@/components/ui/ProfileCompletionCard";
import { QuickActionsCard } from "@/components/ui/QuickActionsCard";
import { EditDialog } from "@/components/ui/EditDialog";
import {
  ContactInfoEditForm,
  ContactInfoFormData,
} from "@/components/pages/profile/ContactInfoEditForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  UserProfile,
  WorkExperience,
  Education,
  UserDocument,
} from "@/types/api";

type EditSection =
  | "contact"
  | "experience"
  | "education"
  | "documents"
  | "photo"
  | null;

export default function ProfilePage() {
  const { userProfile, profileCompletion, isLoading, isError, mutateProfile } =
    useUserProfile();
  const { patchProfile, isLoading: isPatching } = usePatchProfile();

  const [editSection, setEditSection] = useState<EditSection>(null);

  // Contact info form data
  const [contactFormData, setContactFormData] = useState<ContactInfoFormData>({
    phone_number: "",
    city: "",
    country: "",
  });

  // Initialize form data when editing starts
  const handleEditContact = useCallback(() => {
    if (userProfile) {
      setContactFormData({
        phone_number: userProfile.phone_number || "",
        city: userProfile.city || "",
        country: userProfile.country || "",
      });
    }
    setEditSection("contact");
  }, [userProfile]);

  const handleEditExperience = useCallback(() => {
    setEditSection("experience");
  }, []);

  const handleEditEducation = useCallback(() => {
    setEditSection("education");
  }, []);

  const handleEditDocuments = useCallback(() => {
    setEditSection("documents");
  }, []);

  const handleEditPhoto = useCallback(() => {
    setEditSection("photo");
  }, []);

  const handleCloseDialog = useCallback(() => {
    setEditSection(null);
  }, []);

  // Handle contact info form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formElement = document.getElementById("contact-info-form");
    if (formElement && (formElement as any).validate) {
      const isValid = (formElement as any).validate();
      if (!isValid) return;
    }

    try {
      await patchProfile({
        phone_number: contactFormData.phone_number,
        city: contactFormData.city,
        country: contactFormData.country,
      });
      mutateProfile();
      setEditSection(null);
    } catch (error) {
      console.error("Failed to update contact info:", error);
    }
  };

  // Handle section click from profile completion card
  const handleSectionClick = useCallback(
    (section: string) => {
      // Map section names to edit handlers
      const sectionMap: Record<string, () => void> = {
        phone_number: handleEditContact,
        location: handleEditContact,
        work_experience: handleEditExperience,
        education: handleEditEducation,
      };

      const handler = sectionMap[section];
      if (handler) {
        handler();
      }
    },
    [handleEditContact, handleEditExperience, handleEditEducation],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Main content skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[180px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
              <Skeleton className="h-[150px] rounded-xl" />
            </div>
            {/* Sidebar skeleton */}
            <div className="space-y-6 hidden lg:block">
              <Skeleton className="h-[300px] rounded-xl" />
              <Skeleton className="h-[200px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-[1200px] mx-auto">
          <ErrorState
            title="Unable to load profile"
            message="There was an error loading your profile. Please try again."
            onRetry={() => mutateProfile()}
          />
        </div>
      </div>
    );
  }

  // Build the API user profile from our mapped profile
  const apiUserProfile: UserProfile = {
    full_name: userProfile.name || "",
    role: userProfile.role || "job_seeker",
    email: "", // Will be filled from raw data if available
    phone_number: userProfile.phone_number,
    city: userProfile.city,
    country: userProfile.country,
    location: userProfile.location,
    job_title: userProfile.job_title,
    bio: userProfile.bio || undefined,
  };

  // Get work experience, education, and documents from userProfile
  const workExperiences: WorkExperience[] = userProfile.work_experience || [];
  const educationList: Education[] = userProfile.education || [];
  const documents: UserDocument[] = userProfile.documents || [];
  const email = userProfile.email || "";

  // Format location for display
  const displayLocation =
    userProfile.city && userProfile.country
      ? `${userProfile.city}, ${userProfile.country}`
      : userProfile.location || "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main content */}
          <div className="space-y-6">
            {/* Profile Header */}
            <div id="profile-header">
              <ProfileHeader
                name={userProfile.name}
                avatar={userProfile.avatar}
                location={displayLocation}
                bio={userProfile.bio || undefined}
                completionPercentage={profileCompletion.percentage}
                onEditPhoto={handleEditPhoto}
              />
            </div>

            {/* Contact Info Card */}
            <ContactInfoCard
              phoneNumber={userProfile.phone_number}
              location={displayLocation}
              email={email}
              onEdit={handleEditContact}
            />

            {/* Work Experience Card */}
            <WorkExperienceCard
              experiences={workExperiences}
              onEdit={handleEditExperience}
            />

            {/* Education Card */}
            <EducationCard
              education={educationList}
              onEdit={handleEditEducation}
            />

            {/* Documents Card */}
            <DocumentsCard documents={documents} onEdit={handleEditDocuments} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <ProfileCompletionCard
              userProfile={apiUserProfile}
              onSectionClick={handleSectionClick}
            />

            {/* Quick Actions Card (hidden on mobile via its own CSS) */}
            <QuickActionsCard
              savedJobsCount={userProfile.saved_jobs?.length ?? 0}
            />
          </div>
        </div>
      </div>

      {/* Contact Info Edit Dialog */}
      <EditDialog
        isOpen={editSection === "contact"}
        title="Edit Contact Information"
        onClose={handleCloseDialog}
        onSubmit={handleContactSubmit}
        isSubmitting={isPatching}
      >
        <ContactInfoEditForm
          initialData={contactFormData}
          onDataChange={setContactFormData}
        />
      </EditDialog>

      {/* Work Experience Edit Dialog - placeholder for now */}
      <EditDialog
        isOpen={editSection === "experience"}
        title="Edit Work Experience"
        onClose={handleCloseDialog}
        onSubmit={(e) => {
          e.preventDefault();
          handleCloseDialog();
        }}
        isSubmitting={false}
      >
        <p className="text-gray-600 text-center py-8">
          Work experience editing coming soon...
        </p>
      </EditDialog>

      {/* Education Edit Dialog - placeholder for now */}
      <EditDialog
        isOpen={editSection === "education"}
        title="Edit Education"
        onClose={handleCloseDialog}
        onSubmit={(e) => {
          e.preventDefault();
          handleCloseDialog();
        }}
        isSubmitting={false}
      >
        <p className="text-gray-600 text-center py-8">
          Education editing coming soon...
        </p>
      </EditDialog>

      {/* Documents Edit Dialog - placeholder for now */}
      <EditDialog
        isOpen={editSection === "documents"}
        title="Manage Documents"
        onClose={handleCloseDialog}
        onSubmit={(e) => {
          e.preventDefault();
          handleCloseDialog();
        }}
        isSubmitting={false}
      >
        <p className="text-gray-600 text-center py-8">
          Document management coming soon...
        </p>
      </EditDialog>

      {/* Photo Edit Dialog - placeholder for now */}
      <EditDialog
        isOpen={editSection === "photo"}
        title="Edit Profile Photo"
        onClose={handleCloseDialog}
        onSubmit={(e) => {
          e.preventDefault();
          handleCloseDialog();
        }}
        isSubmitting={false}
      >
        <p className="text-gray-600 text-center py-8">
          Profile photo editing coming soon...
        </p>
      </EditDialog>
    </div>
  );
}
