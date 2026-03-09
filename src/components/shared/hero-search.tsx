"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/browse?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services or pros..."
          className="h-14 w-full rounded-l-xl border border-r-0 border-border bg-white pl-12 pr-4 text-sm sm:text-base text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        className="h-14 rounded-l-none rounded-r-xl px-5 sm:px-8 text-sm sm:text-base font-semibold"
      >
        Search
      </Button>
    </form>
  );
}
