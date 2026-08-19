import { prisma } from "@/lib/prisma";
import { loginAsMerchant } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceTypeMeta } from "@/lib/service-labels";
import { ChevronRight } from "lucide-react";

export default async function MerchantLoginPage() {
  const merchants = await prisma.merchant.findMany({
    include: { destination: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập Merchant Portal</h1>
        <p className="text-muted-foreground">
          Bản demo — chọn một doanh nghiệp để xem cổng thông tin của họ.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {merchants.map((merchant) => {
          const meta = serviceTypeMeta[merchant.type];
          const Icon = meta.icon;
          return (
            <form key={merchant.id} action={loginAsMerchant.bind(null, merchant.id)}>
              <button type="submit" className="w-full text-left">
                <Card className="transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-4 py-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{merchant.name}</p>
                      <p className="text-xs text-muted-foreground">{merchant.destination.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {meta.label}
                    </Badge>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
