import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-8 py-16 text-center">
        <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Sẵn sàng cho chuyến đi Đà Nẵng - Hội An tiếp theo?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Để AI lo phần lên kế hoạch, bạn chỉ cần tận hưởng chuyến đi.
        </p>
        <Button size="lg" asChild>
          <Link href="/plan">
            Bắt đầu lập lịch trình
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
