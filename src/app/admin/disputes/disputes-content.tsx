"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  XCircle,
  Clock,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Dispute {
  id: string;
  bookingReference: string;
  serviceName: string;
  serviceCategory: string;
  appointmentDate: string;
  appointmentTime: string;
  totalCharged: number;
  status: string;
  disputeOpenedAt: string | null;
  disputeReason: string | null;
  disputeResolvedAt: string | null;
  disputeOutcome: string | null;
  refundAmount: number | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhotoUrl: string | null;
  };
  professional: {
    id: string;
    displayName: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      profilePhotoUrl: string | null;
    };
  };
}

interface DisputesContentProps {
  disputes: Dispute[];
}

export default function DisputesContent({ disputes }: DisputesContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"open" | "resolved">("open");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [partialAmounts, setPartialAmounts] = useState<
    Record<string, string>
  >({});

  const openDisputes = disputes.filter(
    (d) => d.status === "DISPUTED" && !d.disputeOutcome
  );
  const resolvedDisputes = disputes.filter((d) => !!d.disputeOutcome);

  const currentDisputes =
    activeTab === "open" ? openDisputes : resolvedDisputes;

  async function handleResolve(
    disputeId: string,
    outcome: "FULL_REFUND" | "PARTIAL_REFUND" | "NO_ACTION",
    refundAmount?: number
  ) {
    setLoadingId(disputeId);
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome,
          ...(refundAmount !== undefined && { refundAmount }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to resolve dispute");
        return;
      }

      router.refresh();
    } catch {
      alert("An error occurred while resolving the dispute.");
    } finally {
      setLoadingId(null);
    }
  }

  function getOutcomeBadge(outcome: string) {
    switch (outcome) {
      case "FULL_REFUND":
        return <Badge className="bg-red-600 text-white">Full Refund</Badge>;
      case "PARTIAL_REFUND":
        return (
          <Badge className="bg-orange-600 text-white">Partial Refund</Badge>
        );
      case "NO_ACTION":
        return <Badge variant="outline">No Action</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent">
          Dispute Management
        </h1>
        <p className="text-muted mt-1">
          Review and resolve customer disputes
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === "open" ? "primary" : "outline"}
          onClick={() => setActiveTab("open")}
          className={
            activeTab === "open"
              ? "bg-accent hover:bg-accent-hover"
              : ""
          }
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Open ({openDisputes.length})
        </Button>
        <Button
          variant={activeTab === "resolved" ? "primary" : "outline"}
          onClick={() => setActiveTab("resolved")}
          className={
            activeTab === "resolved"
              ? "bg-accent hover:bg-accent-hover"
              : ""
          }
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Resolved ({resolvedDisputes.length})
        </Button>
      </div>

      {currentDisputes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted">
            {activeTab === "open"
              ? "No open disputes. All clear!"
              : "No resolved disputes yet."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentDisputes.map((dispute) => (
            <Card key={dispute.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    #{dispute.bookingReference}
                  </CardTitle>
                  {dispute.disputeOutcome ? (
                    getOutcomeBadge(dispute.disputeOutcome)
                  ) : (
                    <Badge className="bg-cta text-white">
                      Open Dispute
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-muted" />
                    <div>
                      <p className="text-sm font-medium">Customer</p>
                      <p className="text-sm text-muted">
                        {dispute.customer.firstName}{" "}
                        {dispute.customer.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 mt-1 text-muted" />
                    <div>
                      <p className="text-sm font-medium">Professional</p>
                      <p className="text-sm text-muted">
                        {dispute.professional.user.firstName}{" "}
                        {dispute.professional.user.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Service</p>
                    <p className="text-muted">
                      {dispute.serviceName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted">
                      {format(
                        new Date(dispute.appointmentDate),
                        "MMM d, yyyy"
                      )}{" "}
                      at {dispute.appointmentTime}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Amount Charged</p>
                    <p className="text-muted font-semibold">
                      ${(dispute.totalCharged / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {dispute.disputeReason && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Dispute Reason
                      </p>
                      <p className="text-sm text-muted bg-muted p-3 rounded-md">
                        {dispute.disputeReason}
                      </p>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-4 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Opened:{" "}
                    {dispute.disputeOpenedAt
                      ? format(
                          new Date(dispute.disputeOpenedAt),
                          "MMM d, yyyy 'at' h:mm a"
                        )
                      : "N/A"}
                  </div>
                  {dispute.disputeResolvedAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Resolved:{" "}
                      {format(
                        new Date(dispute.disputeResolvedAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </div>
                  )}
                </div>

                {dispute.disputeOutcome && dispute.refundAmount !== null && (
                  <div className="text-sm">
                    <span className="font-medium">Refund Amount: </span>
                    <span className="text-cta font-semibold">
                      ${(dispute.refundAmount / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                {!dispute.disputeOutcome && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={loadingId === dispute.id}
                        onClick={() =>
                          handleResolve(dispute.id, "FULL_REFUND")
                        }
                      >
                        <DollarSign className="mr-1 h-4 w-4" />
                        Full Refund
                      </Button>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          className="w-28 h-9"
                          min={0}
                          step={0.01}
                          value={partialAmounts[dispute.id] || ""}
                          onChange={(e) =>
                            setPartialAmounts((prev) => ({
                              ...prev,
                              [dispute.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-cta text-cta hover:bg-cta-light"
                          disabled={
                            loadingId === dispute.id ||
                            !partialAmounts[dispute.id]
                          }
                          onClick={() => {
                            const amount = parseFloat(
                              partialAmounts[dispute.id]
                            );
                            if (isNaN(amount) || amount <= 0) {
                              alert("Please enter a valid refund amount.");
                              return;
                            }
                            handleResolve(
                              dispute.id,
                              "PARTIAL_REFUND",
                              Math.round(amount * 100)
                            );
                          }}
                        >
                          Partial Refund
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingId === dispute.id}
                        onClick={() =>
                          handleResolve(dispute.id, "NO_ACTION")
                        }
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        No Action
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
