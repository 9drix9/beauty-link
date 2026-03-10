import { requirePro } from "@/lib/auth";
import { ProSettingsForm } from "./pro-settings-form";
import { PaymentSetup } from "./payment-setup";

export const metadata = { title: "Edit Profile — BeautyLink Pro" };

export default async function ProSettingsPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile and payment settings.
        </p>
      </div>

      {/* Payment Setup */}
      <PaymentSetup
        stripeConnected={!!profile.stripeConnectAccountId}
        payoutEnabled={profile.payoutEnabled}
        bankLast4={profile.bankAccountLast4}
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
            instagramHandle: profile.instagramHandle || "",
            specialties: profile.specialties || [],
            workSetting: profile.workSetting || "",
          }}
        />
      </div>
    </div>
  );
}
