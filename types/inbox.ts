export interface Conversation {
  id: string;
  name: string;
  subtitle: string;
  avatar?: string | null;
  lastMessage: string;
  appliedAt: string;
  unreadCount?: number;
  jobRole?: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentName?: string;
}
