"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Pause,
  RotateCcw,
  FileText,
  Image,
  Loader2,
} from "lucide-react";

interface Application {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
  applicationStatus: string;
  applicationSubmittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  licenseStatus: string;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  licenseExpiration: string | null;
  licenseVerifiedAt: string | null;
  portfolioPhotos: string[];
  servicesOffered: string[];
  specialties: string[];
  yearsExperience: string | null;
  workSetting: string | null;
  city: string | null;
  state: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  [key: string]: unknown;
}

interface ApplicationsContentProps {
  applications: Application[];
}

const experienceLabels: Record<string, string> = {
  UNDER_1: "Under 1 year",
  ONE_TO_THREE: "1-3 years",
  THREE_TO_FIVE: "3-5 years",
  FIVE_TO_TEN: "5-10 years",
  TEN_PLUS: "10+ years",
};

const workSettingLabels: Record<string, string> = {
  SALON_SUITE: "Salon Suite",
  CHAIR_RENTAL: "Chair Rental",
  HOME_STUDIO: "Home Studio",
  MOBILE: "Mobile",
  SALON_EMPLOYEE: "Salon Employee",
};

export default function ApplicationsContent({
  applications,
}: ApplicationsContentProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {}
  );

  const pending = applications.filter((a) => a.applicationStatus === "PENDING");
  const approved = applications.filter(
    (a) => a.applicationStatus === "APPROVED"
  );
  const rejected = applications.filter(
    (a) => a.applicationStatus === "REJECTED"
  );

  async function handleAction(
    id: string,
    action: "approve" | "reject" | "suspend" | "re-review",
    reason?: string
  ) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        return;
      }

      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  function renderApplicationCard(app: Application) {
    const isLoading = loadingId === app.id;

    return (
      <Card key={app.id} variant="elevated" className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {app.displayName ||
                  `${app.user.firstName} ${app.user.lastName}`}
              </CardTitle>
              <p className="mt-0.5 text-sm text-muted">{app.user.email}</p>
            </div>
            <Badge
              variant={
                app.applicationStatus === "APPROVED"
                  ? "success"
                  : app.applicationStatus === "REJECTED"
                  ? "error"
                  : "warning"
              }
            >
              {app.applicationStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Submitted date */}
          {app.applicationSubmittedAt && (
            <p className="text-sm text-muted">
              Submitted:{" "}
              {format(
                new Date(app.applicationSubmittedAt),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </p>
          )}

          {/* License info */}
          <div className="rounded-lg bg-gray-50 border border-border/50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-body">
                <FileText className="h-4 w-4" />
                License Information
              </div>
              <Badge
                variant={
                  app.licenseStatus === "LICENSE_VERIFIED"
                    ? "success"
                    : app.licenseStatus === "LICENSE_DECLARED"
                    ? "warning"
                    : "default"
                }
              >
                {app.licenseStatus === "LICENSE_VERIFIED"
                  ? "Verified"
                  : app.licenseStatus === "LICENSE_DECLARED"
                  ? "Declared"
                  : "Not Provided"}
              </Badge>
            </div>
            {app.licenseStatus !== "NOT_PROVIDED" ? (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted">Type:</span>{" "}
                  <span className="font-medium">
                    {app.licenseType?.replace(/_/g, " ") || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted">Number:</span>{" "}
                  <span className="font-medium">
                    {app.licenseNumber || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted">State:</span>{" "}
                  <span className="font-medium">
                    {app.licenseState || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">
                No license information provided.
              </p>
            )}
          </div>

          {/* Bio */}
          {app.bio && (
            <div>
              <p className="text-sm font-medium text-body">Bio</p>
              <p className="mt-1 text-sm text-body">
                {app.bio.length > 200
                  ? `${app.bio.substring(0, 200)}...`
                  : app.bio}
              </p>
            </div>
          )}

          {/* Service categories & details */}
          <div className="flex flex-wrap gap-4 text-sm">
            {app.servicesOffered.length > 0 && (
              <div>
                <span className="font-medium text-body">Services: </span>
                <span className="text-body">
                  {app.servicesOffered
                    .map((s) => s.replace(/_/g, " "))
                    .join(", ")}
                </span>
              </div>
            )}
            {app.yearsExperience && (
              <div>
                <span className="font-medium text-body">Experience: </span>
                <span className="text-body">
                  {experienceLabels[app.yearsExperience] ||
                    app.yearsExperience}
                </span>
              </div>
            )}
            {app.workSetting && (
              <div>
                <span className="font-medium text-body">Setting: </span>
                <span className="text-body">
                  {workSettingLabels[app.workSetting] || app.workSetting}
                </span>
              </div>
            )}
          </div>

          {/* Portfolio photos count */}
          <div className="flex items-center gap-1 text-sm text-muted">
            <Image className="h-4 w-4" />
            {app.portfolioPhotos.length} portfolio photo
            {app.portfolioPhotos.length !== 1 ? "s" : ""}
          </div>

          {/* Location */}
          {(app.city || app.state) && (
            <p className="text-sm text-muted">
              Location: {[app.city, app.state].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Rejection reason (for rejected) */}
          {app.applicationStatus === "REJECTED" && app.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">
                Rejection Reason
              </p>
              <p className="mt-1 text-sm text-red-600">
                {app.rejectionReason}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-end gap-3 border-t border-border pt-3">
            {app.applicationStatus === "PENDING" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                  onClick={() => handleAction(app.id, "approve")}
                >
                  {isLoading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-1 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <div className="flex flex-1 items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Rejection reason..."
                      rows={1}
                      value={rejectReasons[app.id] || ""}
                      onChange={(e) =>
                        setRejectReasons((prev) => ({
                          ...prev,
                          [app.id]: e.target.value,
                        }))
                      }
                      className="text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoading || !rejectReasons[app.id]?.trim()}
                    onClick={() =>
                      handleAction(
                        app.id,
                        "reject",
                        rejectReasons[app.id]
                      )
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-1 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </>
            )}

            {app.applicationStatus === "APPROVED" && (
              <Button
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                disabled={isLoading}
                onClick={() => handleAction(app.id, "suspend")}
              >
                {isLoading ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Pause className="mr-1 h-4 w-4" />
                )}
                Suspend
              </Button>
            )}

            {app.applicationStatus === "REJECTED" && (
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleAction(app.id, "re-review")}
              >
                {isLoading ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="mr-1 h-4 w-4" />
                )}
                Re-review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">Applications</h1>
        <p className="mt-1 text-muted">
          Review and manage professional applications.
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="py-10 text-center text-muted">
                No pending applications.
              </CardContent>
            </Card>
          ) : (
            pending.map(renderApplicationCard)
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {approved.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="py-10 text-center text-muted">
                No approved applications.
              </CardContent>
            </Card>
          ) : (
            approved.map(renderApplicationCard)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {rejected.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="py-10 text-center text-muted">
                No rejected applications.
              </CardContent>
            </Card>
          ) : (
            rejected.map(renderApplicationCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
