"use client";

import { useState, useCallback } from "react";

interface ProfileSettingsProps {
  notifEmailMessages: boolean;
  notifEmailReminders: boolean;
  notifPushMessages: boolean;
  notifPushReminders: boolean;
  marketingConsent: boolean;
}

interface SettingItem {
  key: keyof ProfileSettingsProps;
  label: string;
  description: string;
}

const settings: SettingItem[] = [
  {
    key: "notifEmailMessages",
    label: "Email messages",
    description: "Receive email notifications when you get a new message",
  },
  {
    key: "notifEmailReminders",
    label: "Email reminders",
    description: "Receive email reminders about upcoming appointments",
  },
  {
    key: "notifPushMessages",
    label: "Push messages",
    description: "Receive push notifications for new messages",
  },
  {
    key: "notifPushReminders",
    label: "Push reminders",
    description: "Receive push notifications for appointment reminders",
  },
  {
    key: "marketingConsent",
    label: "Marketing emails",
    description: "Receive promotional emails about deals and new features",
  },
];

export function ProfileSettings(props: ProfileSettingsProps) {
  const [values, setValues] = useState<ProfileSettingsProps>(props);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleToggle = useCallback(
    async (key: keyof ProfileSettingsProps) => {
      const newValue = !values[key];
      const newValues = { ...values, [key]: newValue };
      setValues(newValues);
      setSaving(true);
      setSavedMessage(null);

      try {
        const res = await fetch("/api/user/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: newValue }),
        });

        if (res.ok) {
          setSavedMessage("Preferences saved");
          setTimeout(() => setSavedMessage(null), 2000);
        } else {
          // Revert on error
          setValues(values);
          setSavedMessage("Failed to save");
          setTimeout(() => setSavedMessage(null), 2000);
        }
      } catch {
        setValues(values);
        setSavedMessage("Failed to save");
        setTimeout(() => setSavedMessage(null), 2000);
      } finally {
        setSaving(false);
      }
    },
    [values]
  );

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div
          key={setting.key}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{setting.label}</p>
            <p className="text-xs text-gray-500">{setting.description}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={values[setting.key]}
            disabled={saving}
            onClick={() => handleToggle(setting.key)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-primary focus:ring-offset-2 disabled:opacity-50 ${
              values[setting.key] ? "bg-purple-primary" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                values[setting.key] ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}

      {savedMessage && (
        <p
          className={`text-xs font-medium ${
            savedMessage === "Preferences saved"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {savedMessage}
        </p>
      )}
    </div>
  );
}
