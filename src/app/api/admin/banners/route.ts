import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const banners = await db.sitewideBanner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { message, linkText, linkUrl, backgroundColor, textColor } =
      body as {
        message: string;
        linkText?: string;
        linkUrl?: string;
        backgroundColor?: string;
        textColor?: string;
      };

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const banner = await db.sitewideBanner.create({
      data: {
        message: message.trim(),
        linkText: linkText?.trim() || null,
        linkUrl: linkUrl?.trim() || null,
        backgroundColor: backgroundColor || "#6A1B9A",
        textColor: textColor || "#FFFFFF",
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
