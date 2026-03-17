export const dynamic = "force-dynamic";

import { requirePro } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import {
  DollarSign,
  Wallet,
  Clock,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EarningsActions } from "./earnings-actions";

export const metadata = { title: "Earnings" };

function getPayoutStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "FAILED":
      return <Badge variant="error">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function EarningsPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  const [recentPayouts, completedBookings] = await Promise.all([
    db.payout.findMany({
      where: { professionalId: profile.id },
      orderBy: { requestedAt: "desc" },
      take: 10,
    }),
    db.booking.findMany({
      where: {
        professionalId: profile.id,
        status: "COMPLETED",
      },
      orderBy: { updatedAt: "desc" },
      include: { customer: true },
      take: 10,
    }),
  ]);

  const stats = [
    {
      label: "Lifetime Earnings",
      value: formatPrice(profile.lifetimeEarnings),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success-light",
    },
    {
      label: "Available Balance",
      value: formatPrice(profile.availableBalance),
      icon: Wallet,
      color: "text-accent",
      bg: "bg-accent-light",
    },
    {
      label: "Pending Balance",
      value: formatPrice(profile.pendingBalance),
      icon: Clock,
      color: "text-cta",
      bg: "bg-cta-light",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success">Earnings</span>
        <div>
          <h1 className="text-2xl font-bold text-dark">Earnings</h1>
          <p className="mt-1 text-sm text-muted">
            Track your earnings, balances, and payouts.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="elevated">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="text-xl font-bold text-dark">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payout Actions */}
      <EarningsActions
        availableBalance={profile.availableBalance}
        payoutEnabled={profile.payoutEnabled}
        stripeConnected={!!profile.stripeConnectAccountId}
        bankLast4={profile.bankAccountLast4}
      />

      {/* How Payouts Work */}
      {!profile.payoutEnabled && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-cta shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-dark">How payouts work</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  <li>1. Set up your bank account via Stripe Connect</li>
                  <li>2. When a booking is completed, earnings are added to your balance</li>
                  <li>3. After a 24-hour hold, payouts are automatically sent to your bank</li>
                  <li>4. You can also request manual payouts anytime from this page</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Payouts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPayouts.length === 0 ? (
            <div className="py-8 text-center">
              <ArrowDownRight className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted">
                No payouts yet. Complete bookings to start earning!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-dark">
                      {formatPrice(payout.amount)}
                      {payout.instantFee ? (
                        <span className="ml-2 text-xs text-muted">
                          (fee: {formatPrice(payout.instantFee)})
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-muted">
                      {format(new Date(payout.requestedAt), "MMM d, yyyy")}
                      {payout.payoutType === "INSTANT" && (
                        <span className="ml-2 text-xs text-orange-600">
                          Instant
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {payout.completedAt && (
                      <span className="text-xs text-muted">
                        {format(new Date(payout.completedAt), "MMM d")}
                      </span>
                    )}
                    {getPayoutStatusBadge(payout.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Completed Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Recent Completed Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedBookings.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
              <p className="mt-3 text-sm text-muted">
                No completed bookings yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-dark">
                      {booking.serviceName}
                    </p>
                    <p className="text-sm text-muted">
                      {booking.customer.firstName} {booking.customer.lastName}{" "}
                      &middot;{" "}
                      {format(
                        new Date(booking.appointmentDate),
                        "MMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      +{formatPrice(booking.discountedPrice)}
                    </p>
                    <p className="text-xs text-muted">
                      {booking.payoutReleased ? "Paid out" : "Pending payout"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
