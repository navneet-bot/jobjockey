import { Resend } from "resend";

// --- Types --------------------------------------------------------------------

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

// --- Resend Client ------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER = "JobJockey <noreply@jobjockey.in>";

// --- Core Send Function -------------------------------------------------------

/**
 * Sends an email via Resend.
 * Errors are caught and logged - email failure does NOT block any main operation.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: SENDER,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
    });

    if (error) {
      console.error("[Email] Resend API error:", error);
    }
  } catch (err) {
    // Log the error, but never throw - email failure must not break the main flow
    console.error("[Email] Failed to send email:", err);
  }
}
