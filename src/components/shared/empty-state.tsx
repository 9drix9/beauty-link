import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-background p-4 mb-4">
        <Icon className="h-10 w-10 text-muted" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-dark mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{description}</p>
      {action && (
        <Button asChild variant="primary" size="md">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
