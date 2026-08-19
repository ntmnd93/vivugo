import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "merchant_session";

export async function getActiveMerchantId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function getActiveMerchant() {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) return null;
  return prisma.merchant.findUnique({ where: { id: merchantId } });
}

/** Must be called from a Server Action or Route Handler (cookie mutation context). */
export async function setActiveMerchant(merchantId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, merchantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearActiveMerchant() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
