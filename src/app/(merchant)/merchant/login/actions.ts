"use server";

import { redirect } from "next/navigation";
import { setActiveMerchant } from "@/lib/demo-auth/merchant-session";

export async function loginAsMerchant(merchantId: string) {
  await setActiveMerchant(merchantId);
  redirect("/merchant/orders");
}
