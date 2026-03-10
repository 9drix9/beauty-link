"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      variant="secondary"
      className="w-full justify-center gap-2 text-error hover:text-error hover:bg-error/5 hover:border-error/20"
      onClick={() => signOut({ redirectUrl: "/" })}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign Out
    </Button>
  );
}
