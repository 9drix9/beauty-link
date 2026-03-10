"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      className="w-full justify-center gap-2 text-error hover:text-error hover:bg-error/5 hover:border-error/20"
      onClick={() => signOut(() => router.push("/"))}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign Out
    </Button>
  );
}
