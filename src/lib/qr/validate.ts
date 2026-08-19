import { createHmac, timingSafeEqual } from "crypto";

const SIGNATURE_LENGTH = 32;

function sign(ticketId: string): string {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) throw new Error("TICKET_SIGNING_SECRET chưa được cấu hình.");
  return createHmac("sha256", secret).update(ticketId).digest("hex").slice(0, SIGNATURE_LENGTH);
}

/** Verifies a scanned QR payload's HMAC and returns the ticketId, or null if invalid/tampered. */
export function parseTicketPayload(payload: string): { ticketId: string } | null {
  const parts = payload.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "t1") return null;

  const [, ticketId, signature] = parts;
  const expected = sign(ticketId);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return { ticketId };
}
