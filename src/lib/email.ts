import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "BeautyLink <noreply@beautylinknetwork.com>";

/**
 * Wrap email content in the standard BeautyLink email template.
 */
function wrapTemplate(bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 22px; margin: 0; font-family: Georgia, serif; color: #3d1a0f;">
          <span style="font-weight: 700;">Beauty</span><span style="font-style: italic;">Link</span>
        </h1>
      </div>

      ${bodyHtml}

      <hr style="border: none; border-top: 1px solid #e0d3c8; margin: 32px 0;" />

      <p style="font-size: 12px; color: #9a7b6a; text-align: center; margin: 0;">
        BeautyLink &middot; Los Angeles, CA<br/>
        beautylinknetwork.com
      </p>
    </div>
  `;
}

/**
 * Send the approval email to a newly approved stylist.
 */
export async function sendApprovalEmail(
  to: string,
  firstName: string
): Promise<void> {
  if (!resend) {
    logger.warn("RESEND_NOT_CONFIGURED", { to, type: "approval" });
    return;
  }

  const name = firstName || "there";

  const bodyHtml = `
    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 0 0 16px;">
      Hi ${name},
    </p>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 0 0 16px;">
      Your application has been approved. Welcome to BeautyLink 🤎
    </p>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 0 0 16px;">
      We are excited to have you join as a founding stylist. You are now part of an early group of Los Angeles beauty professionals who will be live on the platform at launch.
    </p>

    <div style="background: #faf5f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="font-size: 14px; color: #3d1a0f; font-weight: 700; margin: 0 0 12px;">
        What happens next
      </p>
      <p style="font-size: 14px; color: #3d1a0f; line-height: 1.6; margin: 0 0 16px;">
        Before launch, we will guide you through getting fully set up so you are ready to start receiving bookings right away. This includes:
      </p>
      <ul style="font-size: 14px; color: #3d1a0f; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Setting up your profile</li>
        <li>Adding your services and pricing</li>
        <li>Posting your first availability (open appointment slots)</li>
      </ul>
    </div>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 0 0 16px;">
      We will be reaching out shortly with everything you need to get started. The process is simple, and we will be available if you need any help along the way.
    </p>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 0 0 24px;">
      Joining early means you will be in a strong position when clients begin booking.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://beautylinknetwork.com/pro/dashboard"
         style="display: inline-block; background: #3d1a0f; color: white; font-size: 15px; font-weight: 600; padding: 12px 32px; border-radius: 50px; text-decoration: none;">
        Go to Your Dashboard
      </a>
    </div>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 24px 0 0;">
      More to come soon. We are excited to have you on 🤎
    </p>

    <p style="font-size: 15px; color: #3d1a0f; line-height: 1.6; margin: 8px 0 0;">
      BeautyLink
    </p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "You're Approved 🤎 Welcome to BeautyLink",
      html: wrapTemplate(bodyHtml),
    });

    logger.info("APPROVAL_EMAIL_SENT", { to });
  } catch (error) {
    logger.error("APPROVAL_EMAIL_FAILED", {
      to,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
