import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/instagram
 * Fetches Instagram photos from a public profile or individual post URLs.
 *
 * Body options:
 *   { handle: "@username" }          — fetch recent posts from profile
 *   { urls: ["https://instagram.com/p/..."] } — fetch specific posts by URL
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

    // Mode 3: Fetch recent posts from a public profile
    if (body.handle) {
      return handleProfileFetch(body.handle);
    }

    return NextResponse.json(
      { error: "Provide handle, urls, or imageUrl" },
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
      // Validate it's an Instagram URL
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

/** Attempt to fetch recent posts from a public Instagram profile */
async function handleProfileFetch(handle: string) {
  const username = handle.replace(/^@/, "").trim();

  if (!username || username.length > 30) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  try {
    // Try fetching the profile page and extracting og:image + embedded data
    const profileUrl = `https://www.instagram.com/${username}/`;
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({
        photos: [],
        profileImage: null,
        error: "profile_private_or_not_found",
        message:
          "Could not access this profile. It may be private or the username may be incorrect.",
      });
    }

    const html = await res.text();

    // Extract profile image from og:image
    const profileImage = extractMetaContent(html, "og:image");

    // Extract description for bio
    const bio = extractMetaContent(html, "og:description") || "";

    // Try to extract post images from embedded JSON data
    const photos = extractPostImages(html);

    return NextResponse.json({
      photos,
      profileImage,
      bio,
      username,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({
      photos: [],
      profileImage: null,
      error: "fetch_failed",
      message:
        "Could not fetch Instagram profile. You can paste individual post URLs instead.",
    });
  }
}

/** Download a remote image and upload it to Vercel Blob */
async function handleImageUpload(imageUrl: string, userId: string) {
  try {
    // Validate URL
    const parsed = new URL(imageUrl);
    if (
      !parsed.hostname.includes("instagram.com") &&
      !parsed.hostname.includes("cdninstagram.com") &&
      !parsed.hostname.includes("fbcdn.net") &&
      !parsed.hostname.includes("scontent")
    ) {
      return NextResponse.json(
        { error: "URL must be from Instagram" },
        { status: 400 }
      );
    }

    // Download the image
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

    // Check size (10MB max)
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
  // Try property attribute
  const propRegex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const propMatch = html.match(propRegex);
  if (propMatch) return propMatch[1];

  // Try reversed order (content before property)
  const revRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    "i"
  );
  const revMatch = html.match(revRegex);
  if (revMatch) return revMatch[1];

  return null;
}

/** Extract post image URLs from Instagram HTML */
function extractPostImages(html: string): string[] {
  const images: string[] = [];

  // Try to find image URLs in the HTML (Instagram embeds them in various formats)
  // Look for high-res image URLs from cdninstagram / scontent
  const cdnRegex =
    /https:\/\/(?:scontent[^"'\s]+|[^"'\s]*cdninstagram\.com[^"'\s]*)\.(jpg|jpeg|png|webp)[^"'\s]*/gi;

  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = cdnRegex.exec(html)) !== null) {
    let url = match[0];
    // Clean up escaped characters
    url = url.replace(/\\u0026/g, "&").replace(/\\/g, "");
    // Remove trailing garbage
    url = url.split('"')[0].split("'")[0].split("\\")[0];

    // Skip tiny thumbnails (profile pics are usually small)
    if (url.includes("150x150") || url.includes("s150x150")) continue;

    // Deduplicate by base URL (without size params)
    const baseUrl = url.split("?")[0];
    if (!seen.has(baseUrl)) {
      seen.add(baseUrl);
      images.push(url);
    }
  }

  // Return up to 12 unique images
  return images.slice(0, 12);
}

/** Fetch og:image from a single URL */
async function fetchOgImage(url: string): Promise<string | null> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) return null;

  const html = await res.text();
  return extractMetaContent(html, "og:image");
}
