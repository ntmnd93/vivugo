import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div
        className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-3xl px-8 py-16 text-center text-white"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      >
        <div aria-hidden className="absolute -top-16 -right-16 -z-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-10 -z-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Sẵn sàng cho chuyến đi Đà Nẵng - Hội An tiếp theo?
        </h2>
        <p className="max-w-md text-white/85">
          Để AI lo phần lên kế hoạch, bạn chỉ cần tận hưởng chuyến đi.
        </p>
        <Button
          size="lg"
          asChild
          className="bg-white text-[oklch(0.5_0.16_35)] shadow-lg shadow-black/10 hover:bg-white/90"
        >
          <Link href="/plan">
            Bắt đầu lập lịch trình
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
