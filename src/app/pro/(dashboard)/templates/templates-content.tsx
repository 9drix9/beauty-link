"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Zap,
  FileText,
  Trash2,
  Clock,
  Calendar,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface SerializedTemplate {
  id: string;
  name: string;
  serviceCategory: string;
  subCategory: string | null;
  title: string;
  description: string | null;
  durationMinutes: number;
  originalPriceCents: number | null;
  discountedPriceCents: number | null;
  isModelCall: boolean;
  maxClients: number;
  usageCount: number;
  lastUsedAt: string | null;
  coverPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface TemplatesContentProps {
  templates: SerializedTemplate[];
}

function getCategoryLabel(value: string) {
  const labels: Record<string, string> = {
    HAIR: "Hair", NAILS: "Nails", MAKEUP: "Makeup", LASHES: "Lashes",
    BROWS: "Brows", SKINCARE: "Skincare", HAIR_REMOVAL: "Hair Removal",
    MASSAGE: "Massage", SPRAY_TAN: "Spray Tan", OTHER: "Other",
  };
  return labels[value] || value;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function TemplatesContent({ templates }: TemplatesContentProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/providers/templates/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Service Templates</h1>
          <p className="mt-1 text-sm text-muted">
            Set up your services once, then post openings in seconds.
          </p>
        </div>
        <Button variant="cta" asChild>
          <Link href="/pro/appointments/new?mode=scratch">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Template
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {templates.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
              <FileText className="h-7 w-7 text-accent" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-dark text-lg">
              Create your first service template
            </h3>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Templates let you save your service details — name, price, duration, description — so you can post new openings in seconds without re-entering everything.
            </p>

            <div className="mt-6 space-y-3 max-w-sm mx-auto text-left">
              <div className="flex items-start gap-3 text-sm">
                <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-dark">Set up once</p>
                  <p className="text-muted">Save your service details as a reusable template</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-dark">Quick Post</p>
                  <p className="text-muted">Pick a template, set date & time, publish</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-dark">Post repeatedly</p>
                  <p className="text-muted">Use the same template for multiple dates</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="cta" asChild>
                <Link href="/pro/appointments/new?mode=scratch">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Create a Listing & Save as Template
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template cards */}
      {templates.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} variant="elevated">
              <CardContent className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-dark truncate">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted mt-0.5 truncate">
                      {template.title}
                    </p>
                  </div>
                  <Badge variant="default" size="sm" className="shrink-0">
                    {getCategoryLabel(template.serviceCategory)}
                  </Badge>
                </div>

                {/* Details */}
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDuration(template.durationMinutes)}
                  </span>
                  {template.isModelCall ? (
                    <Badge variant="outline" size="sm">Model Call</Badge>
                  ) : template.originalPriceCents ? (
                    <span>
                      <span className="line-through text-xs mr-1">
                        {formatPrice(template.originalPriceCents)}
                      </span>
                      <span className="font-semibold text-dark">
                        {formatPrice(template.discountedPriceCents || 0)}
                      </span>
                    </span>
                  ) : null}
                </div>

                {/* Usage stats */}
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>Used {template.usageCount} time{template.usageCount !== 1 ? "s" : ""}</span>
                  {template.lastUsedAt && (
                    <span>
                      Last used {new Date(template.lastUsedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button variant="primary" size="sm" asChild>
                    <Link href={`/pro/appointments/new?mode=choose&templateId=${template.id}`}>
                      <Zap className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Use Template
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === template.id}
                    onClick={() => handleDelete(template.id)}
                  >
                    {deletingId === template.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
