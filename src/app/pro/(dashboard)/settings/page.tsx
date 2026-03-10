import { requirePro } from "@/lib/auth";
import { ProSettingsForm } from "./pro-settings-form";

export const metadata = { title: "Edit Profile — BeautyLink Pro" };

export default async function ProSettingsPage() {
  const user = await requirePro();
  const profile = user.professionalProfile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Edit Profile</h1>
        <p className="mt-1 text-sm text-muted">
          Update your professional profile visible to clients.
        </p>
      </div>

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
  );
}
