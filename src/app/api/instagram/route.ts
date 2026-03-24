import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/instagram
 * Two modes:
 *   { urls: ["https://instagram.com/p/..."] } — extract images from post URLs
 *   { imageUrl: "https://...", upload: true }  — proxy-download an image and upload to Blob
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Mode 1: Upload a remote image URL to Vercel Blob
    if (body.imageUrl && body.upload) {
      return handleImageUpload(body.imageUrl, user.id);
    }

    // Mode 2: Fetch photos from individual post URLs
    if (body.urls && Array.isArray(body.urls)) {
      return handlePostUrls(body.urls);
    }

    return NextResponse.json(
      { error: "Provide urls or imageUrl" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Instagram fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}

/** Fetch og:image from individual Instagram post URLs */
async function handlePostUrls(urls: string[]) {
  const results: { url: string; imageUrl: string | null; error?: string }[] = [];

  for (const url of urls.slice(0, 10)) {
    try {
      if (!url.includes("instagram.com")) {
        results.push({ url, imageUrl: null, error: "Not an Instagram URL" });
        continue;
      }

      const imageUrl = await fetchOgImage(url);
      results.push({ url, imageUrl });
    } catch {
      results.push({ url, imageUrl: null, error: "Failed to fetch" });
    }
  }

  return NextResponse.json({ photos: results });
}

/** Download a remote image and upload it to Vercel Blob */
async function handleImageUpload(imageUrl: string, userId: string) {
  try {
    const parsed = new URL(imageUrl);
    const host = parsed.hostname.toLowerCase();
    const allowedDomains = [
      "instagram.com",
      "cdninstagram.com",
      "fbcdn.net",
      "scontent",
      "fbsbx.com",
    ];
    if (!allowedDomains.some((d) => host.includes(d))) {
      return NextResponse.json(
        { error: "URL must be from Instagram" },
        { status: 400 }
      );
    }

    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Failed to download image" },
        { status: 400 }
      );
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : "jpg";

    const buffer = await imageRes.arrayBuffer();

    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const pathname = `portfolio/${userId}-ig-${timestamp}-${random}.${ext}`;

    const blob = await put(pathname, Buffer.from(buffer), {
      access: "public",
      addRandomSuffix: false,
      contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to import image" },
      { status: 500 }
    );
  }
}

/** Extract content from an HTML meta tag */
function extractMetaContent(html: string, property: string): string | null {
  const propRegex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const propMatch = html.match(propRegex);
  if (propMatch) return propMatch[1];

  const revRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    "i"
  );
  const revMatch = html.match(revRegex);
  if (revMatch) return revMatch[1];

  return null;
}

/** Fetch og:image from a single post URL, trying embed page as fallback */
async function fetchOgImage(url: string): Promise<string | null> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html",
  };

  // Try direct URL first
  try {
    const res = await fetch(url, { headers, redirect: "follow" });
    if (res.ok) {
      const html = await res.text();
      const ogImage = extractMetaContent(html, "og:image");
      if (ogImage && isValidPostImage(ogImage)) return ogImage;
    }
  } catch {
    // Direct fetch failed, try embed
  }

  // Fallback: try the embed version which is more accessible
  try {
    const embedUrl = url.replace(/\/?(\?.*)?$/, "/embed/");
    const embedRes = await fetch(embedUrl, { headers, redirect: "follow" });
    if (embedRes.ok) {
      const embedHtml = await embedRes.text();
      const ogImage = extractMetaContent(embedHtml, "og:image");
      if (ogImage && isValidPostImage(ogImage)) return ogImage;

      // Try extracting CDN image URLs from embed HTML
      const cdnRegex =
        /https:\/\/(?:scontent[^"'\s]+|[^"'\s]*cdninstagram\.com[^"'\s]*)\.(jpg|jpeg|png|webp)[^"'\s]*/gi;
      let match: RegExpExecArray | null;
      while ((match = cdnRegex.exec(embedHtml)) !== null) {
        const imgUrl = match[0]
          .replace(/\\u0026/g, "&")
          .replace(/\\/g, "")
          .split('"')[0]
          .split("'")[0];
        if (isValidPostImage(imgUrl)) return imgUrl;
      }
    }
  } catch {
    // Embed fallback also failed
  }

  return null;
}

/** Check if an image URL is actual user content (not an Instagram logo/static asset) */
function isValidPostImage(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes("static.cdninstagram.com")) return false;
  if (lower.includes("/static/")) return false;
  if (lower.includes("instagram_logo")) return false;
  if (lower.includes("glyph-logo")) return false;
  if (lower.includes("/images/ico/")) return false;
  if (lower.includes("app_icon")) return false;
  if (lower.includes("favicon")) return false;
  if (lower.includes("/icons/")) return false;
  if (lower.includes("/branding/")) return false;
  // Tiny images are UI elements, not photos
  if (lower.includes("44x44") || lower.includes("50x50")) return false;
  if (lower.includes("56x56") || lower.includes("64x64")) return false;
  if (lower.includes("100x100") || lower.includes("150x150")) return false;
  return true;
}
