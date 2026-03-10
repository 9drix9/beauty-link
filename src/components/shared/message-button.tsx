"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageButtonProps {
  recipientId: string;
  recipientName: string;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MessageButton({
  recipientId,
  recipientName,
  variant = "outline",
  size = "md",
  className,
}: MessageButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMessage() {
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // Send an introductory message to create the thread
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          body: `Hi ${recipientName}! I have a question about your services.`,
        }),
      });

      if (res.ok) {
        router.push("/messages");
      } else {
        const data = await res.json();
        if (data.error === "Cannot send a message to yourself") {
          // Pro viewing their own listing
          return;
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMessage}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      Message
    </Button>
  );
}
