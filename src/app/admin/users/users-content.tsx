"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserX,
  UserCheck,
  ShieldCheck,
  Loader2,
  Search,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profilePhotoUrl: string | null;
}

interface UsersContentProps {
  users: User[];
  totalCount: number;
}

export default function UsersContent({
  users,
  totalCount,
}: UsersContentProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmAdminId, setConfirmAdminId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  async function handleAction(
    userId: string,
    action: "deactivate" | "reactivate" | "makeAdmin"
  ) {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        return;
      }

      setConfirmAdminId(null);
      router.refresh();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default" as const;
      case "PROFESSIONAL":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Users</h1>
          <p className="mt-1 text-muted">
            {totalCount} total users. Showing first 50.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="PROFESSIONAL">Professional</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      <Card variant="elevated">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-accent-light/30 text-left text-sm font-medium text-muted">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => {
                  const isLoading = loadingId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-dark">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={roleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.isActive ? "success" : "error"}
                          className={
                            user.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : ""
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              disabled={isLoading}
                              onClick={() =>
                                handleAction(user.id, "deactivate")
                              }
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserX className="mr-1 h-4 w-4" />
                              )}
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:bg-green-50"
                              disabled={isLoading}
                              onClick={() =>
                                handleAction(user.id, "reactivate")
                              }
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="mr-1 h-4 w-4" />
                              )}
                              Reactivate
                            </Button>
                          )}

                          {user.role !== "ADMIN" && (
                            <>
                              {confirmAdminId === user.id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    disabled={isLoading}
                                    onClick={() =>
                                      handleAction(user.id, "makeAdmin")
                                    }
                                  >
                                    {isLoading ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Confirm"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setConfirmAdminId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-purple-600 hover:bg-purple-50"
                                  onClick={() => setConfirmAdminId(user.id)}
                                >
                                  <ShieldCheck className="mr-1 h-4 w-4" />
                                  Make Admin
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-muted"
                    >
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
