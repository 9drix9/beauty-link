"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string | null;
}

interface SerializedThread {
  id: string;
  participant1: Participant;
  participant2: Participant;
  participant1Id: string;
  participant2Id: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCountP1: number;
  unreadCountP2: number;
}

interface MessageData {
  id: string;
  threadId: string;
  senderId: string;
  recipientId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagesContentProps {
  threads: SerializedThread[];
  currentUserId: string;
}

export function MessagesContent({ threads, currentUserId }: MessagesContentProps) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [threadList, setThreadList] = useState(threads);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threadList.find((t) => t.id === activeThreadId);

  const getOtherParticipant = useCallback(
    (thread: SerializedThread): Participant => {
      return thread.participant1Id === currentUserId
        ? thread.participant2
        : thread.participant1;
    },
    [currentUserId]
  );

  const getUnreadCount = useCallback(
    (thread: SerializedThread): number => {
      return thread.participant1Id === currentUserId
        ? thread.unreadCountP1
        : thread.unreadCountP2;
    },
    [currentUserId]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const openThread = async (threadId: string) => {
    setActiveThreadId(threadId);
    setLoadingMessages(true);

    try {
      const res = await fetch(`/api/messages/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);

        // Clear unread count locally
        setThreadList((prev) =>
          prev.map((t) => {
            if (t.id !== threadId) return t;
            return t.participant1Id === currentUserId
              ? { ...t, unreadCountP1: 0 }
              : { ...t, unreadCountP2: 0 };
          })
        );
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !activeThread || sending) return;

    const otherParticipant = getOtherParticipant(activeThread);
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: otherParticipant.id,
          body: messageBody.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setMessageBody("");

        // Update thread preview
        setThreadList((prev) =>
          prev.map((t) => {
            if (t.id !== activeThread.id) return t;
            return {
              ...t,
              lastMessagePreview: messageBody.trim(),
              lastMessageAt: new Date().toISOString(),
            };
          })
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const getInitials = (participant: Participant) => {
    return `${participant.firstName?.[0] ?? ""}${participant.lastName?.[0] ?? ""}`.toUpperCase();
  };

  // Thread list panel
  const threadListPanel = (
    <div
      className={`flex flex-col border-r border-border bg-white ${
        activeThreadId ? "hidden md:flex" : "flex"
      } w-full md:w-96`}
    >
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-dark">Conversations</h2>
      </div>

      {threadList.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
          <p className="text-lg font-medium text-muted">No messages yet</p>
          <p className="mt-1 text-sm text-muted">
            Start a conversation by messaging a professional from their listing.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {threadList.map((thread) => {
            const other = getOtherParticipant(thread);
            const unread = getUnreadCount(thread);
            const isActive = thread.id === activeThreadId;

            return (
              <button
                key={thread.id}
                onClick={() => openThread(thread.id)}
                className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 ${
                  isActive ? "bg-purple-50" : ""
                }`}
              >
                {/* Avatar */}
                {other.profilePhotoUrl ? (
                  <Image
                    src={other.profilePhotoUrl}
                    alt={`${other.firstName} ${other.lastName}`}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-primary text-sm font-semibold text-white">
                    {getInitials(other)}
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-semibold text-dark">
                      {other.firstName} {other.lastName}
                    </span>
                    {thread.lastMessageAt && (
                      <span className="flex-shrink-0 text-xs text-muted">
                        {formatTime(thread.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-muted">
                      {thread.lastMessagePreview || "No messages yet"}
                    </p>
                    {unread > 0 && (
                      <span className="ml-2 flex h-5 min-w-[1.25rem] flex-shrink-0 items-center justify-center rounded-full bg-purple-primary px-1.5 text-xs font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Conversation panel
  const conversationPanel = (
    <div
      className={`flex flex-1 flex-col bg-gray-50 ${
        activeThreadId ? "flex" : "hidden md:flex"
      }`}
    >
      {activeThread ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-white px-4 py-3">
            <button
              onClick={() => setActiveThreadId(null)}
              className="rounded-lg p-2 text-muted hover:bg-gray-100 md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {(() => {
              const other = getOtherParticipant(activeThread);
              return (
                <>
                  {other.profilePhotoUrl ? (
                    <Image
                      src={other.profilePhotoUrl}
                      alt={`${other.firstName} ${other.lastName}`}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-primary text-xs font-semibold text-white">
                      {getInitials(other)}
                    </div>
                  )}
                  <span className="truncate font-semibold text-dark">
                    {other.firstName} {other.lastName}
                  </span>
                </>
              );
            })()}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-primary border-t-transparent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted">
                No messages in this conversation yet.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isSent = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isSent
                            ? "bg-purple-primary text-white"
                            : "bg-gray-200 text-dark"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {msg.body}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            isSent ? "text-purple-200" : "text-muted"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-border bg-white p-4"
          >
            <input
              type="text"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-primary focus:outline-none focus:ring-1 focus:ring-purple-primary"
            />
            <button
              type="submit"
              disabled={!messageBody.trim() || sending}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-primary text-white transition-colors hover:bg-purple-mid disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <MessageSquare className="mb-4 h-16 w-16 text-gray-200" aria-hidden="true" />
          <p className="text-lg font-medium text-muted">
            Select a conversation to start messaging
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-8rem)] md:h-[calc(100dvh-12rem)] overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      {threadListPanel}
      {conversationPanel}
    </div>
  );
}
