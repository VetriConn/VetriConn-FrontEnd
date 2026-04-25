"use client";

import { ChangeEvent, useMemo, useRef, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  getJobSeekerMessageThreads,
  getJobSeekerThreadMessages,
  sendJobSeekerAttachmentMessage,
  sendJobSeekerMessage,
} from "@/lib/api";
import { getInitials } from "@/lib/initials";
import { 
  HiOutlinePaperAirplane, 
  HiOutlinePaperClip,
  HiOutlineInbox,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import type { JobSeekerThreadMessage } from "@/types/api";
import { Avatar } from "@/components/ui/Avatar";
import { useUserProfile } from "@/hooks/useUserProfile";

function formatTimestamp(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function formatMessageTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    employer: {
      company_name: "TechCorp Inc.",
      contact_name: "Jennifer Smith",
      email: "jennifer.smith@techcorp.com",
      phone: "(555) 987-6543",
    },
    job: { role: "Software Developer" },
    application_id: "app-1",
    applied_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content: "We'd love to schedule an interview with you. Are you available next Tuesday?",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "conv-2",
    employer: {
      company_name: "DataViz Solutions",
      contact_name: "Robert Johnson",
      email: "r.johnson@dataviz.com",
      phone: "(555) 876-5432",
    },
    job: { role: "Data Analyst" },
    application_id: "app-2",
    applied_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content: "Thank you for your application. We're reviewing candidates and will get back to you soon.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "conv-3",
    employer: {
      company_name: "StartupXYZ",
      contact_name: "Maria Garcia",
      email: "maria@startupxyz.com",
      phone: "(555) 765-4321",
    },
    job: { role: "Frontend Developer" },
    application_id: "app-3",
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_message: {
      content: "Your portfolio looks impressive! Let's set up a call.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

const DEMO_MESSAGES: Record<string, Array<{
  _id: string;
  sender: "job_seeker" | "employer";
  content: string;
  createdAt: string;
  attachment_url?: string;
  attachment_name?: string;
}>> = {
  "app-1": [
    {
      _id: "msg-1-1",
      sender: "job_seeker",
      content: "Thank you for considering my application. I'm very excited about this opportunity!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-2",
      sender: "employer",
      content: "Hi! We were impressed with your background. Your experience with React and TypeScript is exactly what we're looking for.",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-3",
      sender: "job_seeker",
      content: "That's great to hear! I'd love to learn more about the role and the team.",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-4",
      sender: "employer",
      content: "We'd love to schedule an interview with you. Are you available next Tuesday?",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  "app-2": [
    {
      _id: "msg-2-1",
      sender: "job_seeker",
      content: "Hello! I'm very interested in the Data Analyst position. I have 4 years of experience with Python and SQL.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-2",
      sender: "employer",
      content: "Thank you for your application. We're reviewing candidates and will get back to you soon.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-3": [
    {
      _id: "msg-3-1",
      sender: "job_seeker",
      content: "Hi! I'm reaching out about the Frontend Developer role. I've attached my portfolio for your review.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      attachment_url: "#",
      attachment_name: "Portfolio_2024.pdf",
    },
    {
      _id: "msg-3-2",
      sender: "employer",
      content: "Your portfolio looks impressive! Let's set up a call.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function InboxPage() {
  // Get user profile for avatar
  const { userProfile } = useUserProfile();
  
  // Use demo data instead of API for now
  const [useDemoData, setUseDemoData] = useState(true);
  
  const {
    data: apiThreads = [],
    isLoading: apiLoading,
    error: apiError,
    mutate: mutateThreads,
  } = useSWR(
    useDemoData ? null : "job-seeker-message-threads",
    getJobSeekerMessageThreads
  );

  const threads = useDemoData ? DEMO_CONVERSATIONS : apiThreads;
  const isLoading = useDemoData ? false : apiLoading;
  const error = useDemoData ? null : apiError;

  const [selectedId, setSelectedId] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [sendError, setSendError] = useState<string>("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const resolvedSelectedId =
    selectedId || (threads.length > 0 ? threads[0].application_id : "");

  const {
    data: apiThreadData,
    isLoading: apiThreadLoading,
    mutate: mutateThread,
  } = useSWR(
    !useDemoData && resolvedSelectedId
      ? ["job-seeker-thread-messages", resolvedSelectedId]
      : null,
    () => getJobSeekerThreadMessages(resolvedSelectedId),
  );

  const threadData = useDemoData 
    ? { messages: DEMO_MESSAGES[resolvedSelectedId] || [] }
    : apiThreadData;
  const isThreadLoading = useDemoData ? false : apiThreadLoading;

  const conversations = useMemo(() => {
    return threads.map((thread) => {
      const lastMessage =
        thread.last_message?.content?.trim() ||
        "No messages yet";

      return {
        id: thread.application_id,
        name: thread.employer.company_name,
        subtitle: `${thread.employer.contact_name} • ${thread.job?.role || "Job Application"}`,
        avatar: getInitials(thread.employer.company_name),
        lastMessage,
        appliedAt: thread.last_message?.createdAt || thread.applied_at,
        email: thread.employer.email,
        phone: thread.employer.phone,
        jobRole: thread.job?.role || "",
      };
    });
  }, [threads]);

  // Filter conversations based on debounced search query
  const filteredConversations = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return conversations;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return conversations.filter((convo) => {
      return (
        convo.name.toLowerCase().includes(query) ||
        convo.subtitle.toLowerCase().includes(query) ||
        convo.email.toLowerCase().includes(query) ||
        convo.jobRole.toLowerCase().includes(query) ||
        convo.lastMessage.toLowerCase().includes(query)
      );
    });
  }, [conversations, debouncedSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  const selectedConvo = conversations.find((c) => c.id === resolvedSelectedId);

  const messages = useMemo(() => {
    if (!selectedConvo) return [];

    const threadMessages = threadData?.messages || [];

    if (threadMessages.length > 0) {
      return threadMessages.map((msg) => ({
        id: msg._id,
        sender: msg.sender === "job_seeker" ? ("me" as const) : ("them" as const),
        text: msg.content,
        attachmentUrl: msg.attachment_url,
        attachmentName: msg.attachment_name,
        timestamp: msg.createdAt,
      }));
    }

    return [];
  }, [selectedConvo, threadData]);

  const handleSend = async () => {
    if (!selectedConvo || !messageInput.trim() || isSending) return;
    setSendError("");
    setIsSending(true);

    try {
      if (useDemoData) {
        // Demo mode: Add message to demo data
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "job_seeker" as const,
          content: messageInput.trim(),
          createdAt: new Date().toISOString(),
        };
        
        if (!DEMO_MESSAGES[selectedConvo.id]) {
          DEMO_MESSAGES[selectedConvo.id] = [];
        }
        DEMO_MESSAGES[selectedConvo.id].push(newMessage);
        
        const convoIndex = DEMO_CONVERSATIONS.findIndex(c => c.application_id === selectedConvo.id);
        if (convoIndex !== -1) {
          DEMO_CONVERSATIONS[convoIndex].last_message = {
            content: messageInput.trim(),
            createdAt: new Date().toISOString(),
          };
        }
        
        setMessageInput("");
        setSelectedId(selectedConvo.id);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        await sendJobSeekerMessage(selectedConvo.id, messageInput.trim());
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

  const handleAttachmentChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.currentTarget.value = "";

    if (!selectedConvo || !file || isUploadingAttachment) return;

    setSendError("");
    setIsUploadingAttachment(true);
    try {
      if (useDemoData) {
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "job_seeker" as const,
          content: messageInput.trim() || "Sent an attachment",
          createdAt: new Date().toISOString(),
          attachment_url: "#",
          attachment_name: file.name,
        };
        
        if (!DEMO_MESSAGES[selectedConvo.id]) {
          DEMO_MESSAGES[selectedConvo.id] = [];
        }
        DEMO_MESSAGES[selectedConvo.id].push(newMessage);
        
        setMessageInput("");
        setSelectedId(selectedConvo.id);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        await sendJobSeekerAttachmentMessage(
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

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col bg-gray-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full h-full flex flex-col px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="mb-4 md:mb-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-500 mt-1">Messages from employers</p>
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
          {/* ── Left panel — Conversation list ── */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Search/Filter Header */}
            <div className="p-4 border-b border-gray-200 shrink-0">
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                )}
              </div>
              {debouncedSearchQuery && (
                <p className="text-xs text-gray-500 mt-2">
                  {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Conversations List */}
            <div className="overflow-y-auto flex-1">
              {filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => handleSelectConversation(convo.id)}
                  className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    resolvedSelectedId === convo.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar - Employer Logo */}
                    <Avatar
                      src={null}
                      name={convo.name}
                      size={44}
                      className="ring-2 ring-white"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {convo.name}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0">
                          {formatTimestamp(convo.appliedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {convo.subtitle}
                      </p>
                      <p className="text-xs text-gray-600 truncate line-clamp-2">
                        {convo.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {!isLoading && filteredConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {debouncedSearchQuery ? (
                      <HiOutlineMagnifyingGlass className="w-8 h-8 text-gray-400" />
                    ) : (
                      <HiOutlineInbox className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {debouncedSearchQuery ? "No results found" : "No messages yet"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {debouncedSearchQuery 
                      ? `No conversations match "${debouncedSearchQuery}"`
                      : "Messages from employers will appear here"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel — Chat view ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
            {selectedConvo ? (
              <>
                {/* Chat header */}
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <Avatar
                      src={null}
                      name={selectedConvo.name}
                      size={40}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {selectedConvo.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{selectedConvo.subtitle}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{selectedConvo.email}</span>
                    <span>•</span>
                    <span>{selectedConvo.phone}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 bg-gray-50">
                  {isThreadLoading && (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-sm text-gray-400">Loading messages...</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Show employer avatar for their messages */}
                      {msg.sender === "them" && selectedConvo && (
                        <Avatar
                          src={null}
                          name={selectedConvo.name}
                          size={32}
                          className="mt-1"
                        />
                      )}
                      
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                          msg.sender === "me"
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                        {msg.attachmentUrl && (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 mt-3 pt-3 border-t ${
                              msg.sender === "me"
                                ? "border-white/20 text-white"
                                : "border-gray-200 text-primary"
                            } text-xs font-medium hover:underline`}
                          >
                            <HiOutlineDocumentText className="w-4 h-4" />
                            {msg.attachmentName || "View attachment"}
                          </a>
                        )}
                        <p
                          className={`text-[10px] mt-1.5 ${
                            msg.sender === "me"
                              ? "text-white/70"
                              : "text-gray-400"
                          }`}
                        >
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                      
                      {/* Show user's own avatar for their messages */}
                      {msg.sender === "me" && userProfile && (
                        <Avatar
                          src={userProfile.role === "employer" ? userProfile.employer_profile?.logo_url : userProfile.picture}
                          name={userProfile.role === "employer" ? userProfile.employer_profile?.company_name || "You" : userProfile.full_name || "You"}
                          size={32}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  {!isThreadLoading && messages.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-sm text-gray-400">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-white shrink-0">
                  {sendError && (
                    <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600">{sendError}</p>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors shrink-0"
                      aria-label="Attach file"
                      onClick={() => attachmentInputRef.current?.click()}
                      disabled={isUploadingAttachment}
                    >
                      <HiOutlinePaperClip className="w-5 h-5" />
                    </button>
                    <input
                      ref={attachmentInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAttachmentChange}
                    />
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      aria-label="Send message"
                      onClick={handleSend}
                      disabled={
                        isSending ||
                        isUploadingAttachment ||
                        !messageInput.trim()
                      }
                    >
                      <HiOutlinePaperAirplane className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineInbox className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900 mb-2">Select a conversation</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  Choose a conversation from the list to start messaging with employers
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
