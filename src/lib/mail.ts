import "server-only";

export type Mail = { to: string; replyTo: string; subject: string; text: string };

/**
 * Plain-text notification mail for the form endpoints: through Brevo when BREVO_API_KEY is set,
 * otherwise through Resend when RESEND_API_KEY is set. Returns false without a key so the forms
 * still work in development; throws when the provider rejects the mail.
 * Sender: B2B_INQUIRY_FROM ("Name <address>"), which must be a verified sender at the provider.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const from = process.env.B2B_INQUIRY_FROM ?? "DoctorBox Shop <shop@doctorbox.de>";
  const brevoKey = process.env.BREVO_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (brevoKey) {
    const sender = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoKey, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: sender ? { name: sender[1] || undefined, email: sender[2] } : { email: from.trim() },
        to: [{ email: mail.to }],
        replyTo: { email: mail.replyTo },
        subject: mail.subject,
        textContent: mail.text,
      }),
    });
    if (!res.ok) throw new Error(`brevo ${res.status} ${(await res.text()).slice(0, 300)}`);
    return true;
  }

  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [mail.to], reply_to: mail.replyTo, subject: mail.subject, text: mail.text }),
    });
    if (!res.ok) throw new Error(`resend ${res.status} ${(await res.text()).slice(0, 300)}`);
    return true;
  }

  return false;
}
