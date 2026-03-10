import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { format } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const [
    totalUsers,
    totalProfessionals,
    pendingApplications,
    totalBookings,
    revenueResult,
    recentActions,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "PROFESSIONAL" } }),
    db.professionalProfile.count({
      where: { applicationStatus: "PENDING" },
    }),
    db.booking.count(),
    db.booking.aggregate({ _sum: { platformFee: true } }),
    db.adminAction.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { admin: true },
    }),
  ]);

  const totalRevenue = revenueResult._sum.platformFee ?? 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-400",
    },
    {
      label: "Total Professionals",
      value: totalProfessionals.toLocaleString(),
      icon: Briefcase,
      color: "text-accent",
      bg: "bg-accent-light",
      borderColor: "border-accent",
    },
    {
      label: "Pending Applications",
      value: pendingApplications.toLocaleString(),
      icon: FileText,
      color: "text-cta",
      bg: "bg-cta-light",
      borderColor: "border-cta",
    },
    {
      label: "Total Bookings",
      value: totalBookings.toLocaleString(),
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
      borderColor: "border-green-400",
    },
    {
      label: "Revenue",
      value: `$${(totalRevenue / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="rounded-2xl bg-gradient-to-r from-accent-light/40 to-cta-light/30 p-6">
        <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
        <p className="mt-1 text-muted">
          Welcome back, {admin.firstName}. Here is your overview.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="elevated" className={`border-t-2 ${stat.borderColor}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-dark">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActions.length === 0 ? (
              <p className="text-sm text-muted">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-dark">
                        {action.admin.firstName} {action.admin.lastName}
                      </p>
                      <p className="text-sm text-muted">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {action.actionType}
                        </Badge>
                        {action.targetType} &middot; {action.targetId.slice(0, 8)}...
                      </p>
                      {action.reason && (
                        <p className="text-xs text-muted">
                          Reason: {action.reason}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted">
                      {format(new Date(action.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/applications">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-accent-light/30 hover:text-accent hover:border-accent/30"
              >
                Review Applications
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-accent-light/30 hover:text-accent hover:border-accent/30"
              >
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/disputes">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-accent-light/30 hover:text-accent hover:border-accent/30"
              >
                View Disputes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/banners">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-accent-light/30 hover:text-accent hover:border-accent/30"
              >
                Manage Banners
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
