import { createHmac } from "crypto";
import QRCode from "qrcode";

const SIGNATURE_LENGTH = 32; // hex chars (16 bytes) — compact enough to keep the QR code dense-but-scannable.

function sign(ticketId: string): string {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) throw new Error("TICKET_SIGNING_SECRET chưa được cấu hình.");
  return createHmac("sha256", secret).update(ticketId).digest("hex").slice(0, SIGNATURE_LENGTH);
}

/** Builds the compact signed string encoded into a ticket's QR code. */
export function buildTicketPayload(ticketId: string): string {
  return `t1.${ticketId}.${sign(ticketId)}`;
}

export async function renderTicketQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, { margin: 1, width: 320 });
}
