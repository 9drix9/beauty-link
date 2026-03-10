"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Pencil,
  Megaphone,
  ExternalLink,
  X,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Banner {
  id: string;
  message: string;
  linkText: string | null;
  linkUrl: string | null;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
  updatedAt: string;
}

interface BannersContentProps {
  banners: Banner[];
}

export default function BannersContent({ banners }: BannersContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#6A1B9A");
  const [textColor, setTextColor] = useState("#FFFFFF");

  const [editMessage, setEditMessage] = useState("");
  const [editLinkText, setEditLinkText] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editBgColor, setEditBgColor] = useState("#6A1B9A");
  const [editTextColor, setEditTextColor] = useState("#FFFFFF");

  async function handleCreate() {
    if (!message.trim()) {
      alert("Message is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          linkText: linkText.trim() || undefined,
          linkUrl: linkUrl.trim() || undefined,
          backgroundColor,
          textColor,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create banner");
        return;
      }
      setMessage("");
      setLinkText("");
      setLinkUrl("");
      setBackgroundColor("#6A1B9A");
      setTextColor("#FFFFFF");
      router.refresh();
    } catch {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update banner");
        return;
      }
      router.refresh();
    } catch {
      alert("An error occurred.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete banner");
        return;
      }
      router.refresh();
    } catch {
      alert("An error occurred.");
    }
  }

  function startEditing(banner: Banner) {
    setEditingId(banner.id);
    setEditMessage(banner.message);
    setEditLinkText(banner.linkText || "");
    setEditLinkUrl(banner.linkUrl || "");
    setEditBgColor(banner.backgroundColor);
    setEditTextColor(banner.textColor);
  }

  async function handleSaveEdit(id: string) {
    if (!editMessage.trim()) {
      alert("Message is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: editMessage.trim(),
          linkText: editLinkText.trim() || null,
          linkUrl: editLinkUrl.trim() || null,
          backgroundColor: editBgColor,
          textColor: editTextColor,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update banner");
        return;
      }
      setEditingId(null);
      router.refresh();
    } catch {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark">
          Banner Management
        </h1>
        <p className="text-muted mt-1">
          Create and manage sitewide banners
        </p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-accent" />
            Create New Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              placeholder="Enter banner message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input
                id="linkText"
                placeholder="Learn More"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL (optional)</Label>
              <Input
                id="linkUrl"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <span className="text-sm text-muted">
                  {backgroundColor}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="txtColor">Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="txtColor"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <span className="text-sm text-muted">
                  {textColor}
                </span>
              </div>
            </div>
          </div>

          {message && (
            <div>
              <Label>Preview</Label>
              <div
                className="rounded-md px-4 py-3 text-center text-sm font-medium mt-1"
                style={{ backgroundColor, color: textColor }}
              >
                {message}
                {linkText && (
                  <span className="underline ml-2">{linkText}</span>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleCreate}
            disabled={loading || !message.trim()}
            className="bg-accent hover:bg-accent-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Banner
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-cta" />
          Existing Banners ({banners.length})
        </h2>

        {banners.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-muted">
              No banners created yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <Card key={banner.id} variant="elevated">
                <CardContent className="pt-6 space-y-4">
                  <div
                    className="rounded-md px-4 py-3 text-center text-sm font-medium"
                    style={{
                      backgroundColor: banner.backgroundColor,
                      color: banner.textColor,
                    }}
                  >
                    {banner.message}
                    {banner.linkText && (
                      <span className="underline ml-2">
                        {banner.linkText}
                        <ExternalLink className="inline h-3 w-3 ml-1" />
                      </span>
                    )}
                  </div>

                  {editingId === banner.id ? (
                    <div className="space-y-3 border border-border/50 rounded-md p-4 bg-gray-50">
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Input
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Link Text</Label>
                          <Input
                            value={editLinkText}
                            onChange={(e) => setEditLinkText(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Link URL</Label>
                          <Input
                            value={editLinkUrl}
                            onChange={(e) => setEditLinkUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={editBgColor}
                            onChange={(e) => setEditBgColor(e.target.value)}
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={editTextColor}
                            onChange={(e) => setEditTextColor(e.target.value)}
                            className="w-12 h-10 p-1 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(banner.id)}
                          disabled={loading}
                          className="bg-accent hover:bg-accent-hover"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={banner.isActive}
                            onCheckedChange={(checked) =>
                              handleToggle(banner.id, checked)
                            }
                          />
                          <Badge
                            variant={
                              banner.isActive ? "success" : "outline"
                            }
                            className={
                              banner.isActive
                                ? "bg-green-600 text-white"
                                : ""
                            }
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted">
                          Created{" "}
                          {format(
                            new Date(banner.createdAt),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
