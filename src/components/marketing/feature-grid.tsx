import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Tags, Ticket, LineChart, ArrowUpRight } from "lucide-react";

const travelerFeatures = [
  {
    icon: BrainCircuit,
    title: "Cá nhân hóa thật sự bằng AI",
    description:
      "Không phải mẫu lịch trình dựng sẵn — mỗi lịch trình được AI tạo riêng theo ngân sách, số ngày và sở thích của bạn.",
  },
  {
    icon: Tags,
    title: "Combo & giá ưu đãi linh hoạt",
    description:
      "Tự chọn khách sạn, tour, nhà hàng để gộp combo — giá luôn thấp hơn mua lẻ từng dịch vụ.",
  },
  {
    icon: Ticket,
    title: "Vé điện tử liền mạch",
    description:
      "Mọi phòng, vé, voucher quy về một mã QR duy nhất. Check-in tức thì tại từng điểm đến.",
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border/60 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {travelerFeatures.map((f) => (
            <Card key={f.title} className="bg-background">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}

          <Link href="/merchant/login" className="group">
            <Card className="h-full border-primary/30 bg-primary text-primary-foreground transition-colors">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <LineChart className="size-5" />
                </div>
                <CardTitle className="flex items-center gap-1 text-base text-primary-foreground">
                  Dành cho doanh nghiệp
                  <ArrowUpRight className="size-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Đăng dịch vụ, nhận đơn và được tự động chia doanh thu minh bạch theo từng giao dịch.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
