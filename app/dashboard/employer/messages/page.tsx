"use client";

import { ChangeEvent, useMemo, useRef, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import {
  getEmployerMessageThreads,
  getEmployerThreadMessages,
  sendEmployerAttachmentMessage,
  sendEmployerMessage,
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
import type { EmployerThreadMessage } from "@/types/api";

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
    applicant: {
      full_name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
    },
    job: { role: "Software Developer" },
    application_id: "app-1",
    selected_skills: ["React", "TypeScript", "Node.js"],
    additional_info: "I'm very interested in this position and believe my 5 years of experience in full-stack development would be a great fit.",
    applied_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    last_message: {
      content: "Thank you for considering my application. I'm available for an interview anytime next week.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    },
  },
  {
    id: "conv-2",
    applicant: {
      full_name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "(555) 234-5678",
    },
    job: { role: "Data Analyst" },
    application_id: "app-2",
    selected_skills: ["Python", "SQL", "Tableau", "Excel"],
    additional_info: "I have extensive experience in data analysis and visualization. Looking forward to discussing how I can contribute to your team.",
    applied_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    last_message: {
      content: "I've attached my portfolio with recent projects. Please let me know if you need any additional information.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
  },
  {
    id: "conv-3",
    applicant: {
      full_name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "(555) 345-6789",
    },
    job: { role: "Software Developer" },
    application_id: "app-3",
    selected_skills: ["JavaScript", "Vue.js", "CSS", "Git"],
    additional_info: "Excited about the opportunity to work on innovative projects. I'm a quick learner and team player.",
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    last_message: {
      content: "Hi! Just following up on my application. Would love to chat about the role.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  },
  {
    id: "conv-4",
    applicant: {
      full_name: "David Thompson",
      email: "d.thompson@email.com",
      phone: "(555) 456-7890",
    },
    job: { role: "Data Analyst" },
    application_id: "app-4",
    selected_skills: ["R", "Python", "Machine Learning", "Statistics"],
    additional_info: "PhD in Statistics with 3 years of industry experience. Passionate about turning data into actionable insights.",
    applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    last_message: {
      content: "Looking forward to hearing from you!",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
  },
];

const DEMO_MESSAGES: Record<string, Array<{
  _id: string;
  sender: "employer" | "applicant";
  content: string;
  createdAt: string;
  attachment_url?: string;
  attachment_name?: string;
}>> = {
  "app-1": [
    {
      _id: "msg-1-1",
      sender: "applicant",
      content: "Hello! Thank you for posting this opportunity. I'm very interested in the Software Developer position.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-2",
      sender: "employer",
      content: "Hi Sarah! Thanks for your interest. I've reviewed your application and I'm impressed with your experience. Would you be available for a quick call this week?",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-3",
      sender: "applicant",
      content: "Absolutely! I'm available Monday through Friday after 2 PM. What time works best for you?",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-4",
      sender: "employer",
      content: "Perfect! How about Tuesday at 3 PM? I'll send you a calendar invite with the video call link.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-1-5",
      sender: "applicant",
      content: "Thank you for considering my application. I'm available for an interview anytime next week.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  "app-2": [
    {
      _id: "msg-2-1",
      sender: "applicant",
      content: "Good morning! I'm reaching out regarding the Data Analyst position. I have 4 years of experience in data visualization and statistical analysis.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-2",
      sender: "employer",
      content: "Hi Michael! Your background looks great. Can you tell me more about your experience with Tableau?",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-3",
      sender: "applicant",
      content: "I've been using Tableau for 3 years, creating interactive dashboards for executive reporting. I've also worked extensively with Python for data preprocessing and analysis.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2-4",
      sender: "applicant",
      content: "I've attached my portfolio with recent projects. Please let me know if you need any additional information.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      attachment_url: "#",
      attachment_name: "Michael_Chen_Portfolio.pdf",
    },
  ],
  "app-3": [
    {
      _id: "msg-3-1",
      sender: "applicant",
      content: "Hi! I'm very excited about this opportunity. I've been working with Vue.js for the past 2 years and would love to contribute to your team.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-3-2",
      sender: "applicant",
      content: "Hi! Just following up on my application. Would love to chat about the role.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "app-4": [
    {
      _id: "msg-4-1",
      sender: "applicant",
      content: "Hello! I'm interested in the Data Analyst position. My PhD research focused on predictive modeling and I've since applied these skills in industry settings.",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-4-2",
      sender: "applicant",
      content: "Looking forward to hearing from you!",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function MessagesPage() {
  // Use demo data instead of API for now
  const [useDemoData, setUseDemoData] = useState(true);
  
  const {
    data: apiThreads = [],
    isLoading: apiLoading,
    error: apiError,
    mutate: mutateThreads,
  } = useSWR(
    useDemoData ? null : "employer-message-threads",
    getEmployerMessageThreads
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
      ? ["employer-thread-messages", resolvedSelectedId]
      : null,
    () => getEmployerThreadMessages(resolvedSelectedId),
  );

  const threadData = useDemoData 
    ? { messages: DEMO_MESSAGES[resolvedSelectedId] || [] }
    : apiThreadData;
  const isThreadLoading = useDemoData ? false : apiThreadLoading;

  const conversations = useMemo(() => {
    return threads.map((thread) => {
      const lastMessage =
        thread.last_message?.content?.trim() ||
        thread.additional_info?.trim() ||
        "No messages yet";

      return {
        id: thread.application_id,
        name: thread.applicant.full_name,
        role: `Applicant — ${thread.job?.role || "Job Posting"}`,
        avatar: getInitials(thread.applicant.full_name),
        lastMessage,
        appliedAt: thread.last_message?.createdAt || thread.applied_at,
        email: thread.applicant.email,
        phone: thread.applicant.phone,
        selectedSkills: thread.selected_skills || [],
        additionalInfo: thread.additional_info || "",
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
        convo.role.toLowerCase().includes(query) ||
        convo.email.toLowerCase().includes(query) ||
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
        sender: msg.sender === "employer" ? ("me" as const) : ("them" as const),
        text: msg.content,
        attachmentUrl: msg.attachment_url,
        attachmentName: msg.attachment_name,
        timestamp: msg.createdAt,
      }));
    }

    const base = [];
    if (selectedConvo.additionalInfo.trim()) {
      base.push({
        id: `${selectedConvo.id}-app`,
        sender: "them" as const,
        text: selectedConvo.additionalInfo.trim(),
        attachmentUrl: undefined,
        attachmentName: undefined,
        timestamp: selectedConvo.appliedAt,
      });
    }
    if (selectedConvo.selectedSkills.length > 0) {
      base.push({
        id: `${selectedConvo.id}-skills`,
        sender: "them" as const,
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
        // Demo mode: Add message to localStorage
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "employer" as const,
          content: messageInput.trim(),
          createdAt: new Date().toISOString(),
        };
        
        // Update demo messages
        if (!DEMO_MESSAGES[selectedConvo.id]) {
          DEMO_MESSAGES[selectedConvo.id] = [];
        }
        DEMO_MESSAGES[selectedConvo.id].push(newMessage);
        
        // Update last message in conversation
        const convoIndex = DEMO_CONVERSATIONS.findIndex(c => c.application_id === selectedConvo.id);
        if (convoIndex !== -1) {
          DEMO_CONVERSATIONS[convoIndex].last_message = {
            content: messageInput.trim(),
            createdAt: new Date().toISOString(),
          };
        }
        
        setMessageInput("");
        // Force re-render
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
        // Demo mode: Simulate attachment upload
        const newMessage = {
          _id: `msg-${Date.now()}`,
          sender: "employer" as const,
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Communicate with job applicants</p>
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
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 ring-2 ring-white">
                      {convo.avatar}
                    </div>

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
                        {convo.role}
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
                      : "Messages from applicants will appear here"
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                      {selectedConvo.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {selectedConvo.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{selectedConvo.role}</p>
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
                      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
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
                  Choose a conversation from the list to start messaging with applicants
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
