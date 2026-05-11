"use client";

import React, { useState, useRef, useEffect } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DEMO_CONVERSATIONS, DEMO_MESSAGES } from "@/lib/demo-data";
import { ConversationList } from "@/components/dashboard/inbox/ConversationList";
import { ChatHeader } from "@/components/dashboard/inbox/ChatHeader";
import { MessageList } from "@/components/dashboard/inbox/MessageList";
import { Conversation, Message } from "@/types/inbox";
import { ChatInput } from "@/components/dashboard/inbox/ChatInput";

export default function InboxPage() {
  const { userProfile } = useUserProfile();
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    DEMO_CONVERSATIONS[0].id,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedThreadId]);

  // ─── Data Mapping ──────────────────────────────────────────────────────────

  const filteredConversations: Conversation[] = DEMO_CONVERSATIONS.filter(
    (c) =>
      c.employer.company_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      c.job.role.toLowerCase().includes(searchQuery.toLowerCase()),
  ).map((c) => ({
    id: c.id,
    name: c.employer.company_name,
    subtitle: c.job.role,
    appliedAt: c.last_message.createdAt,
    lastMessage: c.last_message.content,
    avatar: null, // Demo data doesn't have avatars
  }));

  const selectedConversation = DEMO_CONVERSATIONS.find(
    (c) => c.id === selectedThreadId,
  );

  const currentMessages: Message[] = selectedConversation
    ? (DEMO_MESSAGES[selectedConversation.application_id] || []).map((m) => ({
        id: m._id,
        sender: m.sender === "job_seeker" ? "me" : "them",
        text: m.content,
        timestamp: m.createdAt,
        attachmentUrl: m.attachment_url,
        attachmentName: m.attachment_name,
      }))
    : [];

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In a real app, this would call an API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleAttachment = (file: File) => {
    console.log("Uploading file:", file.name);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <RoleGuard allowedRoles={["job_seeker"]}>
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-140px)] flex bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Sidebar */}
        <ConversationList
          conversations={filteredConversations}
          selectedId={selectedThreadId}
          onSelect={setSelectedThreadId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 h-full">
          {selectedConversation ? (
            <>
              <ChatHeader
                name={selectedConversation.employer.company_name}
                subtitle={selectedConversation.job.role}
                email={selectedConversation.employer.email}
                phone={selectedConversation.employer.phone}
              />

              <MessageList
                messages={currentMessages}
                messagesEndRef={messagesEndRef}
                userName={userProfile?.full_name}
                userAvatar={userProfile?.picture}
                themName={selectedConversation.employer.company_name}
              />

              <ChatInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                onSend={handleSendMessage}
                onAttachmentChange={handleAttachment}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-gray-300">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Messages
              </h3>
              <p className="text-gray-500 max-w-xs">
                Select a conversation from the sidebar to view your messages and
                contact employers.
              </p>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
