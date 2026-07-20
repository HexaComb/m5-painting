"use server";

import { Resend } from "resend";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const DEFAULT_FROM_EMAIL = "M5 Painting <system@m5painting.com>";

type ContactNotificationInput = {
  leadId: string;
  name: string;
  phone?: string;
  email: string;
  interest: string;
  message: string;
};

type ContactNotificationResult =
  | { ok: true }
  | { ok: false; error: string };

function clean(value: string): string {
  return value.trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInterest(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getNotificationRecipient(): Promise<string | null> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return null;
  }

  const client = new ConvexHttpClient(convexUrl);
  const settings = await client.query(api.content.getSiteSettings, {});
  return settings?.email?.trim() || null;
}

export async function sendContactNotification(
  input: ContactNotificationInput,
): Promise<ContactNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Missing RESEND_API_KEY" };
  }

  const name = clean(input.name);
  const email = clean(input.email);
  const phone = input.phone ? clean(input.phone) : "";
  const interest = clean(input.interest);
  const message = clean(input.message);

  if (!name || !email || !interest || !message) {
    return { ok: false, error: "Missing required contact fields" };
  }

  const recipient = await getNotificationRecipient();
  if (!recipient) {
    return { ok: false, error: "Missing site settings notification email" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL;
  const subject = `New M5 Painting quote request from ${name}`;
  const interestLabel = formatInterest(interest);

  const { error } = await resend.emails.send({
    from,
    to: recipient,
    replyTo: email,
    subject,
    text: [
      "New M5 Painting contact/quote submission",
      "",
      `Lead ID: ${input.leadId}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Interest: ${interestLabel}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h1 style="font-size: 20px; margin: 0 0 16px;">New M5 Painting contact/quote submission</h1>
        <p style="margin: 0 0 16px;">A new lead was saved in the admin dashboard.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 700;">Lead ID</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHtml(input.leadId)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 700;">Name</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 700;">Email</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHtml(email)}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 700;">Phone</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHtml(phone || "Not provided")}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 700;">Interest</td>
              <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHtml(interestLabel)}</td>
            </tr>
          </tbody>
        </table>
        <h2 style="font-size: 16px; margin: 24px 0 8px;">Message</h2>
        <p style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px;">${escapeHtml(message)}</p>
      </div>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
