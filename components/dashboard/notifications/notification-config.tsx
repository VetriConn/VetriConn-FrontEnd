import React from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiOutlineEye,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserCircle,
  HiOutlineDocumentCheck,
  HiOutlineInformationCircle,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import { NotificationType } from "@/types/api";

export interface NotificationConfig {
  icon: React.ReactNode;
  dotColor?: string;
  bgColor?: string;
  iconColor?: string;
  borderColor?: string;
}

export const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  application_sent: {
    icon: <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />,
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50",
  },
  application_received: {
    icon: <HiOutlineUserPlus className="w-5 h-5 text-primary" />,
    iconColor: "text-primary",
    borderColor: "border-l-primary",
    bgColor: "bg-red-50",
    dotColor: "bg-primary",
  },
  job_match: {
    icon: <HiOutlineBriefcase className="w-5 h-5 text-blue-600" />,
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
  profile_viewed: {
    icon: <HiOutlineEye className="w-5 h-5 text-amber-600" />,
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50",
  },
  new_reply: {
    icon: <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-purple-600" />,
    dotColor: "bg-purple-500",
    bgColor: "bg-purple-50",
  },
  employer_message: {
    icon: <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-primary" />,
    dotColor: "bg-primary",
    bgColor: "bg-red-50",
  },
  profile_reminder: {
    icon: <HiOutlineUserCircle className="w-5 h-5 text-gray-600" />,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
  },
  application_reviewed: {
    icon: <HiOutlineDocumentCheck className="w-5 h-5 text-emerald-600" />,
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    iconColor: "text-green-500",
    borderColor: "border-l-green-500",
  },
  system: {
    icon: <HiOutlineInformationCircle className="w-5 h-5 text-gray-600" />,
    dotColor: "bg-gray-500",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-500",
    borderColor: "border-l-gray-400",
  },
};
