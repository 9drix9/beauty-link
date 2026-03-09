import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { User as UserIcon, Mail, Phone, Heart, Settings, ExternalLink } from "lucide-react";

import { db } from "@/lib/db";
import { ProfileSettings } from "./profile-settings";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect("/login");
  }

  const savedCount = await db.savedProfessional.count({
    where: { customerId: user.id },
  });

  const maskPhone = (phone: string | null) => {
    if (!phone) return "Not provided";
    if (phone.length < 4) return phone;
    return "***-***-" + phone.slice(-4);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          {user.profilePhotoUrl ? (
            <Image
              src={user.profilePhotoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-full object-cover ring-4 ring-accent-light"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white ring-4 ring-accent-light">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-dark">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="mt-1 text-xs text-muted">
              Member since {format(new Date(user.createdAt), "MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* Saved Professionals */}
      <div className="mb-6 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="h-5 w-5 text-cta" />
          <h2 className="text-lg font-semibold text-dark">Saved Professionals</h2>
        </div>
        <p className="text-body">
          You have{" "}
          <span className="font-semibold text-accent">{savedCount}</span>{" "}
          saved professional{savedCount !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="mb-6 rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-dark">Notification Preferences</h2>
        </div>
        <ProfileSettings
          notifEmailMessages={user.notifEmailMessages}
          notifEmailReminders={user.notifEmailReminders}
          notifPushMessages={user.notifPushMessages}
          notifPushReminders={user.notifPushReminders}
          marketingConsent={user.marketingConsent}
        />
      </div>

      {/* Account */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <UserIcon className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-dark">Account</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs font-medium uppercase text-muted">Email</p>
              <p className="text-sm text-body">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted" />
            <div>
              <p className="text-xs font-medium uppercase text-muted">Phone</p>
              <p className="text-sm text-body">{maskPhone(user.phone)}</p>
            </div>
          </div>
          <div className="pt-2">
            <a
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Manage account in Clerk
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
