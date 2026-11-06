import "server-only";

export type Mail = { to: string; replyTo: string; subject: string; text: string };

/**
 * Plain-text notification mail for the form endpoints, sent through Brevo (BREVO_API_KEY).
 * Returns false without a key so the forms still work in development; throws when Brevo rejects the mail.
 * Sender: B2B_INQUIRY_FROM ("Name <address>"), which must be a verified sender in Brevo.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const from = process.env.B2B_INQUIRY_FROM ?? "DoctorBox Shop <shop@doctorbox.de>";
  const brevoKey = process.env.BREVO_API_KEY;

  if (!brevoKey) return false;

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
