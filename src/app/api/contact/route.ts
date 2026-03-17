import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "BeautyLink <noreply@beautylinknetwork.com>";
const TEAM_EMAIL = process.env.TEAM_EMAIL || "team@beautylinknetwork.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, category } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || email.length < 5) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Please provide more detail in your message." },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await db.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        category: category || "general",
      },
    });

    // Send auto-reply to user
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email.trim().toLowerCase(),
          subject: `We Received Your Message: ${subject.trim()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 22px; color: #3A1F10; margin: 0;">
                  Beauty<span style="color: #D06A4E;">Link</span>
                </h1>
              </div>

              <p style="font-size: 15px; color: #3A1F10; line-height: 1.6; margin: 0 0 16px;">
                Hi ${name.trim()},
              </p>

              <p style="font-size: 15px; color: #3A1F10; line-height: 1.6; margin: 0 0 16px;">
                Thank you for reaching out to BeautyLink. We have received your message and our team will get back to you within 24 hours.
              </p>

              <div style="background: #F6EDE6; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 13px; color: #9A7B6A; margin: 0 0 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</p>
                <p style="font-size: 14px; color: #3A1F10; margin: 0 0 12px; font-weight: 600;">${subject.trim()}</p>
                <p style="font-size: 14px; color: #3A1F10; line-height: 1.5; margin: 0; white-space: pre-wrap;">${message.trim()}</p>
              </div>

              <p style="font-size: 14px; color: #9A7B6A; line-height: 1.6; margin: 24px 0 0;">
                Reference: #${submission.id.slice(-8).toUpperCase()}<br/>
                If you need immediate assistance, reply directly to this email.
              </p>

              <hr style="border: none; border-top: 1px solid #E6D8CF; margin: 32px 0;" />

              <p style="font-size: 12px; color: #9A7B6A; text-align: center; margin: 0;">
                BeautyLink &middot; Los Angeles, CA<br/>
                beautylinknetwork.com
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        logger.error("Auto-reply email failed", { error: emailErr, submissionId: submission.id });
      }

      // Notify team
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TEAM_EMAIL,
          subject: `[Contact Form] ${category || "General"}: ${subject.trim()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px;">
              <h2 style="color: #3A1F10; margin: 0 0 16px;">New Contact Form Submission</h2>
              <table style="font-size: 14px; color: #3A1F10; line-height: 1.6;">
                <tr><td style="padding: 4px 16px 4px 0; color: #9A7B6A; font-weight: 600;">Name</td><td>${name.trim()}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #9A7B6A; font-weight: 600;">Email</td><td><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #9A7B6A; font-weight: 600;">Category</td><td>${category || "General"}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #9A7B6A; font-weight: 600;">Subject</td><td>${subject.trim()}</td></tr>
                <tr><td style="padding: 4px 16px 4px 0; color: #9A7B6A; font-weight: 600;">Ref</td><td>#${submission.id.slice(-8).toUpperCase()}</td></tr>
              </table>
              <div style="background: #F6EDE6; border-radius: 8px; padding: 16px; margin-top: 16px;">
                <p style="font-size: 14px; color: #3A1F10; line-height: 1.5; margin: 0; white-space: pre-wrap;">${message.trim()}</p>
              </div>
            </div>
          `,
          replyTo: email.trim().toLowerCase(),
        });
      } catch (teamErr) {
        logger.error("Team notification email failed", { error: teamErr, submissionId: submission.id });
      }
    }

    return NextResponse.json({
      success: true,
      reference: submission.id.slice(-8).toUpperCase(),
    });
  } catch (error) {
    logger.error("Contact form error", { error });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
