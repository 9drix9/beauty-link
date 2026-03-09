"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  CalendarCheck,
  Award,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Professional {
  id: string;
  userId: string;
  displayName: string;
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  applicationStatus: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoUrl: string | null;
  };
}

interface FeaturedContentProps {
  professionals: Professional[];
}

export default function FeaturedContent({
  professionals,
}: FeaturedContentProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const featured = professionals.filter((p) => p.isFeatured);
  const notFeatured = professionals.filter((p) => !p.isFeatured);

  async function handleToggle(id: string, isFeatured: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/featured/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update featured status");
        return;
      }
      router.refresh();
    } catch {
      alert("An error occurred.");
    } finally {
      setLoadingId(null);
    }
  }

  function ProfessionalCard({ pro }: { pro: Professional }) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent-light flex items-center justify-center text-accent font-semibold text-lg">
                {pro.user.firstName?.[0]}
                {pro.user.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold">
                  {pro.displayName ||
                    `${pro.user.firstName} ${pro.user.lastName}`}
                </p>
                <p className="text-sm text-muted">
                  {pro.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {pro.isFeatured && (
                <Badge className="bg-cta text-white">
                  <Award className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              <Switch
                checked={pro.isFeatured}
                disabled={loadingId === pro.id}
                onCheckedChange={(checked) => handleToggle(pro.id, checked)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-foreground">
                {pro.avgRating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {pro.totalReviews} reviews
            </div>
            <div className="flex items-center gap-1">
              <CalendarCheck className="h-4 w-4" />
              {pro.totalBookings} bookings
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">
          Featured Professionals
        </h1>
        <p className="text-muted mt-1">
          Manage which professionals are featured on the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto text-cta mb-2" />
            <p className="text-2xl font-bold">{featured.length}</p>
            <p className="text-sm text-muted">
              Currently Featured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 mx-auto text-accent mb-2" />
            <p className="text-2xl font-bold">{professionals.length}</p>
            <p className="text-sm text-muted">
              Total Approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">
              {professionals.length > 0
                ? (
                    professionals.reduce((sum, p) => sum + p.avgRating, 0) /
                    professionals.length
                  ).toFixed(1)
                : "0.0"}
            </p>
            <p className="text-sm text-muted">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {featured.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-cta" />
            Currently Featured ({featured.length})
          </h2>
          <div className="space-y-3">
            {featured.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} />
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          All Professionals ({notFeatured.length})
        </h2>
        {notFeatured.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted">
              All approved professionals are currently featured.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notFeatured.map((pro) => (
              <ProfessionalCard key={pro.id} pro={pro} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
