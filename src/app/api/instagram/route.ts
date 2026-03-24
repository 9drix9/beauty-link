import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/instagram
 *   { handle: "@username" }          — fetch recent posts from profile
 *   { urls: ["https://instagram.com/p/..."] } — fetch specific posts by URL
 *   { imageUrl: "https://...", upload: true }  — proxy-download and upload to Blob
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.imageUrl && body.upload) {
      return handleImageUpload(body.imageUrl, user.id);
    }

    if (body.urls && Array.isArray(body.urls)) {
      return handlePostUrls(body.urls);
    }

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

// ── Profile fetch ──────────────────────────────────────────────

async function handleProfileFetch(handle: string) {
  const username = handle.replace(/^@/, "").trim();
  if (!username || username.length > 30) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const photos: string[] = [];
  let profileImage: string | null = null;
  let bio = "";

  // Strategy 1: Try fetching profile page for og:image (profile pic)
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      profileImage = extractMetaContent(html, "og:image");
      bio = extractMetaContent(html, "og:description") || "";

      // Try to pull image URLs from embedded JSON / shared data
      const cdnImages = extractCdnImages(html);
      photos.push(...cdnImages);
    }
  } catch {
    // Profile page fetch failed
  }

  // Strategy 2: Try the Instagram embed channel page
  if (photos.length === 0) {
    try {
      const res = await fetch(
        `https://www.instagram.com/${username}/channel/?__a=1&__d=dis`,
        {
          headers: {
            "User-Agent":
              "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_US; 458229258)",
            Accept: "*/*",
            "X-IG-App-ID": "936619743392459",
          },
          redirect: "follow",
        }
      );
      if (res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          // Try to extract image URLs from the JSON response
          const jsonImages = extractImagesFromJson(json);
          photos.push(...jsonImages);
        } catch {
          // Not JSON, try regex on the text
          const cdnImages = extractCdnImages(text);
          photos.push(...cdnImages);
        }
      }
    } catch {
      // Channel fetch failed
    }
  }

  // Strategy 3: Try fetching recent post shortcodes from the profile page
  // and then fetch each post's og:image individually
  if (photos.length === 0) {
    try {
      const res = await fetch(`https://www.instagram.com/${username}/`, {
        headers: {
          "User-Agent":
            "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "text/html",
        },
        redirect: "follow",
      });
      if (res.ok) {
        const html = await res.text();
        if (!profileImage) {
          profileImage = extractMetaContent(html, "og:image");
        }
        const cdnImages = extractCdnImages(html);
        photos.push(...cdnImages);
      }
    } catch {
      // Facebook UA fetch failed
    }
  }

  // Final validation: remove duplicates that are likely the same logo at different sizes
  const validatedPhotos = deduplicateAndValidate(photos);

  return NextResponse.json({
    photos: validatedPhotos,
    profileImage,
    bio,
    username,
  });
}

// ── Post URLs fetch ────────────────────────────────────────────

async function handlePostUrls(urls: string[]) {
  const results: { url: string; imageUrl: string | null; error?: string }[] = [];

  for (const url of urls.slice(0, 10)) {
    try {
      if (!url.includes("instagram.com")) {
        results.push({ url, imageUrl: null, error: "Not an Instagram URL" });
        continue;
      }
      const imageUrl = await fetchPostImage(url);
      results.push({ url, imageUrl });
    } catch {
      results.push({ url, imageUrl: null, error: "Failed to fetch" });
    }
  }

  return NextResponse.json({ photos: results });
}

// ── Image upload ───────────────────────────────────────────────

async function handleImageUpload(imageUrl: string, userId: string) {
  try {
    const parsed = new URL(imageUrl);
    const host = parsed.hostname.toLowerCase();
    const allowed = ["instagram.com", "cdninstagram.com", "fbcdn.net", "scontent", "fbsbx.com"];
    if (!allowed.some((d) => host.includes(d))) {
      return NextResponse.json({ error: "URL must be from Instagram" }, { status: 400 });
    }

    const imageRes = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });

    if (!imageRes.ok) {
      return NextResponse.json({ error: "Failed to download image" }, { status: 400 });
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const buffer = await imageRes.arrayBuffer();

    if (buffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 });
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
    return NextResponse.json({ error: "Failed to import image" }, { status: 500 });
  }
}

// ── Helpers ────────────────────────────────────────────────────

function extractMetaContent(html: string, property: string): string | null {
  const propRegex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"
  );
  const propMatch = html.match(propRegex);
  if (propMatch) return propMatch[1];

  const revRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"
  );
  const revMatch = html.match(revRegex);
  if (revMatch) return revMatch[1];

  return null;
}

/** Extract real user content CDN image URLs from HTML, filtering out Instagram's own assets */
function extractCdnImages(html: string): string[] {
  const images: string[] = [];
  const cdnRegex =
    /https:\/\/(?:scontent[^"'\s\\]+|[^"'\s\\]*cdninstagram\.com[^"'\s\\]*)\.(jpg|jpeg|png|webp)[^"'\s\\]*/gi;

  const seen = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = cdnRegex.exec(html)) !== null) {
    let url = match[0].replace(/\\u0026/g, "&").replace(/\\u003d/g, "=").replace(/\\/g, "");
    url = url.split('"')[0].split("'")[0];

    if (!isUserPhoto(url)) continue;

    const baseUrl = url.split("?")[0];
    if (!seen.has(baseUrl)) {
      seen.add(baseUrl);
      images.push(url);
    }
  }

  return images.slice(0, 12);
}

/** Recursively extract image URLs from a JSON object */
function extractImagesFromJson(obj: unknown): string[] {
  const images: string[] = [];
  const seen = new Set<string>();

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    // Look for common Instagram image URL fields
    for (const key of ["image_versions2", "display_url", "thumbnail_src", "src", "url"]) {
      if (typeof record[key] === "string" && isUserPhoto(record[key] as string)) {
        const base = (record[key] as string).split("?")[0];
        if (!seen.has(base)) {
          seen.add(base);
          images.push(record[key] as string);
        }
      }
    }
    // Walk into candidates array for image_versions2
    if (record.candidates && Array.isArray(record.candidates)) {
      const best = record.candidates[0] as Record<string, unknown> | undefined;
      if (best && typeof best.url === "string" && isUserPhoto(best.url)) {
        const base = best.url.split("?")[0];
        if (!seen.has(base)) {
          seen.add(base);
          images.push(best.url);
        }
      }
    }
    Object.values(record).forEach(walk);
  }

  walk(obj);
  return images.slice(0, 12);
}

/** Check if an image URL is actual user content, not an Instagram static asset */
function isUserPhoto(url: string): boolean {
  const lower = url.toLowerCase();
  // Instagram static assets and resources
  if (lower.includes("static.cdninstagram.com")) return false;
  if (lower.includes("/static/")) return false;
  if (lower.includes("rsrc.php")) return false;
  if (lower.includes("instagram_logo") || lower.includes("glyph-logo")) return false;
  if (lower.includes("/images/ico/") || lower.includes("app_icon")) return false;
  if (lower.includes("favicon") || lower.includes("/icons/") || lower.includes("/branding/")) return false;
  // PNG files from Instagram CDN are almost always UI assets/logos, not user photos
  // User content is served as .jpg or .webp
  if (lower.endsWith(".png") || lower.includes(".png?")) return false;
  // Small/medium sized images are UI elements or profile pics, not post photos
  if (/(?:^|[/_])s?(?:44|50|56|64|100|110|150|160|192|240|320)x(?:44|50|56|64|100|110|150|160|192|240|320)(?:[/_]|$)/.test(lower)) return false;
  if (lower.includes("_s.jpg") || lower.includes("_a.jpg")) return false;
  // Must be from a CDN domain
  if (!lower.includes("cdninstagram.com") && !lower.includes("scontent") && !lower.includes("fbcdn.net")) return false;
  return true;
}

/** Post-process: if all images look like duplicates of the same thing (e.g. logos), return empty */
function deduplicateAndValidate(images: string[]): string[] {
  if (images.length === 0) return [];
  // Extract the filename stem (last path segment before query params, without size info)
  const stems = images.map((url) => {
    const path = url.split("?")[0];
    const segments = path.split("/");
    const filename = segments[segments.length - 1] || "";
    // Remove size prefixes like "s1080x1080/"
    return filename.replace(/^s?\d+x\d+[/_]?/, "").replace(/\.\w+$/, "");
  });
  // If all stems are the same, it's probably the same image (logo) at different sizes
  const unique = new Set(stems);
  if (unique.size === 1 && images.length > 2) return [];
  return images;
}

/** Fetch the image from a single Instagram post URL */
async function fetchPostImage(url: string): Promise<string | null> {
  const headers = {
    "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    Accept: "text/html",
  };

  // Try direct URL with Facebook crawler UA (Instagram serves og:image to Facebook)
  try {
    const res = await fetch(url, { headers, redirect: "follow" });
    if (res.ok) {
      const html = await res.text();
      const ogImage = extractMetaContent(html, "og:image");
      if (ogImage && isUserPhoto(ogImage)) return ogImage;
    }
  } catch {
    // Direct fetch failed
  }

  // Try embed page
  try {
    const embedUrl = url.replace(/\/?(\?.*)?$/, "/embed/");
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      const ogImage = extractMetaContent(html, "og:image");
      if (ogImage && isUserPhoto(ogImage)) return ogImage;

      const cdnImages = extractCdnImages(html);
      if (cdnImages.length > 0) return cdnImages[0];
    }
  } catch {
    // Embed fetch failed
  }

  return null;
}
