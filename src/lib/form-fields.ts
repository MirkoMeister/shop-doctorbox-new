import { NextResponse } from "next/server";
import { z } from "zod";

/** Single-line text: whitespace (including line breaks) collapsed, so it is safe in a mail subject */
export const line = (max: number) =>
  z
    .string()
    .max(max)
    .transform((s) => s.replace(/\s+/g, " ").trim());

/** Required single-line text, at least two characters */
export const requiredLine = (max: number) => line(max).pipe(z.string().min(2));

export const email = z
  .string()
  .trim()
  .max(254)
  .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

/** Honeypot field: real visitors leave it empty (FormData sends "", the newsletter form may send null) */
export const honeypot = z.string().max(500).nullish();

/** 400 response in the shape the forms expect: `error: "email"` gets its own message, anything else the generic one */
export function invalidResponse(error: z.ZodError) {
  const field = String(error.issues[0]?.path[0] ?? "");
  return NextResponse.json({ ok: false, error: field === "email" ? "email" : "invalid", field: field || undefined }, { status: 400 });
}

export const rateLimitedResponse = () => NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
