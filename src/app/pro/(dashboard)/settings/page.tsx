import { requirePro } from "@/lib/auth";
import { ProSettingsForm } from "./pro-settings-form";
import { PaymentSetup } from "./payment-setup";
import { BadgeSelector } from "./badge-selector";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Profile | BeautyLink Pro" };

export default async function ProSettingsPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your professional profile, payment configuration, and account preferences.
        </p>
      </div>

      {/* Payment Setup */}
      <PaymentSetup
        stripeConnected={!!profile.stripeConnectAccountId}
        payoutEnabled={profile.payoutEnabled}
        bankLast4={profile.bankAccountLast4}
      />

      {/* Profile Badges */}
      <BadgeSelector
        currentBadges={profile.profileBadges || []}
        licensedBadge={profile.licensedBadge}
        licenseStatus={profile.licenseStatus}
      />

      {/* Profile Form */}
      <div>
        <h2 className="text-lg font-semibold text-dark mb-4">Profile</h2>
        <ProSettingsForm
          profile={{
            displayName: profile.displayName || "",
            bio: profile.bio || "",
            city: profile.city || "",
            state: profile.state || "",
            neighborhood: profile.neighborhood || "",
            instagramHandle: profile.instagramHandle || "",
            specialties: profile.specialties || [],
            workSetting: profile.workSetting || "",
            portfolioPhotos: profile.portfolioPhotos || [],
          }}
        />
      </div>
    </div>
  );
}
