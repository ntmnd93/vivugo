import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-primary)/12%,transparent_70%)]"
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center sm:pt-28">
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
          <Sparkles className="size-3.5" />
          Lập lịch trình bằng AI trong 30 giây
        </Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Chuyến đi trong mơ của bạn,
          <br className="hidden sm:block" /> do AI thiết kế riêng
        </h1>
        <p className="max-w-xl text-balance text-lg text-muted-foreground">
          Nhập ngân sách, số ngày và sở thích — VivuGo tự động dựng lịch trình theo từng
          khung giờ, gộp combo ưu đãi và gói gọn mọi vé, phòng vào một mã QR duy nhất.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/plan">
              Lập lịch trình miễn phí
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">Xem cách hoạt động</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Đang thử nghiệm tại Đà Nẵng · Hội An
        </p>
      </div>
    </section>
  );
}
