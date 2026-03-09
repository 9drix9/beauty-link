import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

// Clerk webhook event types
interface ClerkEmailAddress {
  email_address: string;
  id: string;
  verification: { status: string } | null;
}

interface ClerkPhoneNumber {
  phone_number: string;
  id: string;
}

interface ClerkUserEventData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmailAddress[];
  phone_numbers: ClerkPhoneNumber[];
  image_url: string | null;
  public_metadata: Record<string, unknown>;
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
}

interface ClerkSessionEventData {
  user_id: string;
}

interface ClerkDeletedEventData {
  id: string;
  deleted: boolean;
}

type WebhookEvent =
  | { type: "user.created"; data: ClerkUserEventData }
  | { type: "user.updated"; data: ClerkUserEventData }
  | { type: "user.deleted"; data: ClerkDeletedEventData }
  | { type: "session.created"; data: ClerkSessionEventData };

function getPrimaryEmail(data: ClerkUserEventData): string {
  if (data.primary_email_address_id) {
    const primary = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    );
    if (primary) return primary.email_address;
  }
  return data.email_addresses[0]?.email_address ?? "";
}

function getPrimaryEmailVerified(data: ClerkUserEventData): boolean {
  if (data.primary_email_address_id) {
    const primary = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    );
    if (primary) return primary.verification?.status === "verified";
  }
  return (data.email_addresses[0]?.verification?.status === "verified") || false;
}

function getPrimaryPhone(data: ClerkUserEventData): string | null {
  if (data.primary_phone_number_id) {
    const primary = data.phone_numbers.find(
      (p) => p.id === data.primary_phone_number_id
    );
    if (primary) return primary.phone_number;
  }
  return data.phone_numbers[0]?.phone_number ?? null;
}

function parseRole(metadata: Record<string, unknown>): UserRole {
  const role = metadata?.role;
  if (
    typeof role === "string" &&
    Object.values(UserRole).includes(role as UserRole)
  ) {
    return role as UserRole;
  }
  return UserRole.CUSTOMER;
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Get Svix headers for verification
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the raw body
  const body = await req.text();

  // Verify the webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "user.created": {
        const data = event.data;

        await db.user.create({
          data: {
            clerkId: data.id,
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            email: getPrimaryEmail(data),
            phone: getPrimaryPhone(data),
            profilePhotoUrl: data.image_url,
            isEmailVerified: getPrimaryEmailVerified(data),
            role: parseRole(data.public_metadata),
          },
        });

        console.log(`User created: ${data.id}`);
        break;
      }

      case "user.updated": {
        const data = event.data;

        await db.user.update({
          where: { clerkId: data.id },
          data: {
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            email: getPrimaryEmail(data),
            phone: getPrimaryPhone(data),
            profilePhotoUrl: data.image_url,
            isEmailVerified: getPrimaryEmailVerified(data),
            role: parseRole(data.public_metadata),
          },
        });

        console.log(`User updated: ${data.id}`);
        break;
      }

      case "user.deleted": {
        const data = event.data;

        // Soft-delete: preserve booking history by only deactivating
        await db.user.update({
          where: { clerkId: data.id },
          data: { isActive: false },
        });

        console.log(`User soft-deleted: ${data.id}`);
        break;
      }

      case "session.created": {
        const data = event.data;

        const user = await db.user.update({
          where: { clerkId: data.user_id },
          data: { lastLoginAt: new Date() },
          select: { id: true, pendingReviewIntercept: true },
        });

        if (user.pendingReviewIntercept) {
          console.log(
            `User ${data.user_id} has pending review intercept on login`
          );
          // The pendingReviewIntercept flag remains true so the client
          // can detect it and show the review prompt on next page load.
        }

        console.log(`Session created for user: ${data.user_id}`);
        break;
      }

      default: {
        // Unhandled event type — acknowledge receipt
        console.log(`Unhandled webhook event type: ${(event as { type: string }).type}`);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(`Error processing webhook event ${event.type}:`, err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
