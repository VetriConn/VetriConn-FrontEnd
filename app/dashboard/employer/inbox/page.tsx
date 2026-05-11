"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import useSWR from "swr";
import {
  getEmployerMessageThreads,
  getEmployerThreadMessages,
  sendEmployerAttachmentMessage,
  sendEmployerMessage,
} from "@/lib/api";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getInitials } from "@/lib/initials";
import { EMPLOYER_DEMO_CONVERSATIONS, EMPLOYER_DEMO_MESSAGES } from "@/lib/demo-data";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ConversationList } from "@/components/dashboard/inbox/ConversationList";
import { ChatHeader } from "@/components/dashboard/inbox/ChatHeader";
import { MessageList } from "@/components/dashboard/inbox/MessageList";
import { Conversation, Message } from "@/types/inbox";
import { ChatInput } from "@/components/dashboard/inbox/ChatInput";

export default function MessagesPage() {
  const { userProfile } = useUserProfile();
  // Use demo data instead of API for now
  const [useDemoData, setUseDemoData] = useState(true);

  const {
    data: apiThreads = [],
    isLoading: apiLoading,
    error: apiError,
    mutate: mutateThreads,
  } = useSWR(
    useDemoData ? null : "employer-message-threads",
    getEmployerMessageThreads,
  );

  const threads = useDemoData ? EMPLOYER_DEMO_CONVERSATIONS : apiThreads;
  const isLoading = useDemoData ? false : apiLoading;
  const error = useDemoData ? null : apiError;

  const [selectedId, setSelectedId] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [sendError, setSendError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resolvedSelectedId =
    selectedId || (threads.length > 0 ? threads[0].application_id : "");

  const {
    data: apiThreadData,
    isLoading: apiThreadLoading,
    mutate: mutateThread,
  } = useSWR(
    !useDemoData && resolvedSelectedId
      ? ["employer-thread-messages", resolvedSelectedId]
      : null,
    () => getEmployerThreadMessages(resolvedSelectedId),
  );

  const threadData = useDemoData
    ? { messages: EMPLOYER_DEMO_MESSAGES[resolvedSelectedId] || [] }
    : apiThreadData;
  const isThreadLoading = useDemoData ? false : apiThreadLoading;

  const conversations: Conversation[] = useMemo(() => {
    return threads.map((thread) => {
      const lastMessage =
        thread.last_message?.content?.trim() ||
        thread.additional_info?.trim() ||
        "No messages yet";

      return {
        id: thread.application_id,
        name: thread.applicant.full_name,
        subtitle: `Applicant — ${thread.job?.role || "Job Posting"}`,
        avatar: null, // we can use initials if we modify ConversationList or it uses it internally
        lastMessage,
        appliedAt: thread.last_message?.createdAt || thread.applied_at || "",
        email: thread.applicant.email,
        phone: thread.applicant.phone,
        selectedSkills: thread.selected_skills || [],
        additionalInfo: thread.additional_info || "",
      };
    });
  }, [threads]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }
    const query = searchQuery.toLowerCase();
    return conversations.filter((convo) => {
      return (
        convo.name.toLowerCase().includes(query) ||
        convo.subtitle.toLowerCase().includes(query) ||
        (convo as any).email.toLowerCase().includes(query) ||
        convo.lastMessage.toLowerCase().includes(query)
      );
    });
  }, [conversations, searchQuery]);

  const selectedConvo = conversations.find((c) => c.id === resolvedSelectedId) as any;

  const messages: Message[] = useMemo(() => {
    if (!selectedConvo) return [];

    const threadMessages = threadData?.messages || [];

    if (threadMessages.length > 0) {
      return threadMessages.map((msg: any) => ({
        id: msg._id,
        sender: msg.sender === "employer" ? "me" : "them",
        text: msg.content,
        attachmentUrl: msg.attachment_url,
        attachmentName: msg.attachment_name,
        timestamp: msg.createdAt,
      }));
    }

    const base: Message[] = [];
    if (selectedConvo.additionalInfo.trim()) {
      base.push({
        id: `${selectedConvo.id}-app`,
        sender: "them",
        text: selectedConvo.additionalInfo.trim(),
        attachmentUrl: undefined,
        attachmentName: undefined,
        timestamp: selectedConvo.appliedAt,
      });
    }
    if (selectedConvo.selectedSkills.length > 0) {
      base.push({
        id: `${selectedConvo.id}-skills`,
        sender: "them",
        text: `Top skills: ${selectedConvo.selectedSkills.join(", ")}`,
        attachmentUrl: undefined,
        attachmentName: undefined,
        timestamp: selectedConvo.appliedAt,
      });
    }

    return base;
  }, [selectedConvo, threadData]);

  const handleSend = async () => {
    if (!selectedConvo || !messageInput.trim() || isSending) return;
    setSendError("");
    setIsSending(true);

    try {
      if (useDemoData) {
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "employer" as const,
          content: messageInput.trim(),
          createdAt: new Date().toISOString(),
        };

        if (!EMPLOYER_DEMO_MESSAGES[selectedConvo.id]) {
          EMPLOYER_DEMO_MESSAGES[selectedConvo.id] = [];
        }
        EMPLOYER_DEMO_MESSAGES[selectedConvo.id].push(newMessage);

        const convoIndex = EMPLOYER_DEMO_CONVERSATIONS.findIndex(
          (c) => c.application_id === selectedConvo.id,
        );
        if (convoIndex !== -1) {
          EMPLOYER_DEMO_CONVERSATIONS[convoIndex].last_message = {
            content: messageInput.trim(),
            createdAt: new Date().toISOString(),
          };
        }

        setMessageInput("");
        setSelectedId(selectedConvo.id);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        await sendEmployerMessage(selectedConvo.id, messageInput.trim());
        setMessageInput("");
        await Promise.all([mutateThread(), mutateThreads()]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Unable to send your message. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachment = async (file: File) => {
    if (!selectedConvo || !file || isUploadingAttachment) return;

    setSendError("");
    setIsUploadingAttachment(true);
    try {
      if (useDemoData) {
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "employer" as const,
          content: messageInput.trim() || "Sent an attachment",
          createdAt: new Date().toISOString(),
          attachment_url: "#",
          attachment_name: file.name,
        };

        if (!EMPLOYER_DEMO_MESSAGES[selectedConvo.id]) {
          EMPLOYER_DEMO_MESSAGES[selectedConvo.id] = [];
        }
        EMPLOYER_DEMO_MESSAGES[selectedConvo.id].push(newMessage);

        setMessageInput("");
        setSelectedId(selectedConvo.id);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        await sendEmployerAttachmentMessage(
          selectedConvo.id,
          file,
          messageInput.trim() || undefined,
        );
        setMessageInput("");
        await Promise.all([mutateThread(), mutateThreads()]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setSendError(
        err instanceof Error
          ? err.message
          : "Unable to send attachment. Please try again.",
      );
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, messages]);

  return (
    <RoleGuard allowedRoles={["employer"]}>
      <div className="h-[calc(100vh-73px)] flex flex-col bg-gray-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col px-4 md:px-6 py-4 md:py-6">
          {/* Header */}
          <div className="mb-4 md:mb-6 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Messages
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Communicate with job applicants
              </p>
            </div>
            <button
              onClick={() => setUseDemoData(!useDemoData)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {useDemoData ? "Using Demo Data" : "Using Real Data"}
            </button>
          </div>

          {/* Error/Loading States */}
          {isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-500 mb-4 shrink-0">
              Loading conversations...
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-sm text-red-600 mb-4 shrink-0">
              Unable to load messages. Please refresh and try again.
            </div>
          )}

          {/* Main Chat Container */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex min-h-0">
            <ConversationList
              conversations={filteredConversations}
              selectedId={resolvedSelectedId}
              onSelect={setSelectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery("")}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30 h-full">
              {selectedConvo ? (
                <>
                  <ChatHeader
                    name={selectedConvo.name}
                    subtitle={selectedConvo.subtitle}
                    email={selectedConvo.email}
                    phone={selectedConvo.phone}
                  />

                  {isThreadLoading && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-sm text-gray-400">
                        Loading messages...
                      </p>
                    </div>
                  )}
                  {sendError && (
                    <div className="mx-4 md:mx-6 mt-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg shrink-0">
                      <p className="text-xs text-red-600">{sendError}</p>
                    </div>
                  )}

                  <MessageList
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    userName={userProfile?.full_name || "Employer"}
                    userAvatar={userProfile?.picture}
                    themName={selectedConvo.name}
                  />

                  <ChatInput
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    onSend={handleSend}
                    onAttachmentChange={handleAttachment}
                    isSending={isSending || isUploadingAttachment}
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
                    contact applicants.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
