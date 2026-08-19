"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { interestOptions, companionOptions } from "@/lib/ai/itinerary-schema";
import { Loader2, Sparkles } from "lucide-react";

type CompanionType = (typeof companionOptions)[number]["value"];
type Interest = (typeof interestOptions)[number]["value"];

export function ItineraryForm() {
  const router = useRouter();
  const [travelerName, setTravelerName] = useState("");
  const [budgetVnd, setBudgetVnd] = useState(5_000_000);
  const [days, setDays] = useState<number>(2);
  const [companionType, setCompanionType] = useState<CompanionType>("COUPLE");
  const [interests, setInterests] = useState<Interest[]>(["food", "culture"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleInterest(value: Interest) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (interests.length === 0) {
      toast.error("Chọn ít nhất một sở thích.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travelerName: travelerName.trim() || undefined,
          budgetVnd,
          days,
          companionType,
          interests,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Không thể tạo lịch trình.");
      }
      router.push(`/itinerary/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">VivuGo đã sẵn sàng phục vụ</CardTitle>
        <CardDescription>
          Hãy cho mình biết bạn muốn gì, mình giúp bạn có một chuyến đi thật đáng nhớ.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="travelerName">Tên của bạn (không bắt buộc)</Label>
            <Input
              id="travelerName"
              placeholder="Ví dụ: Minh Anh"
              value={travelerName}
              onChange={(e) => setTravelerName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budgetVnd">Ngân sách cho cả chuyến đi (VND)</Label>
            <Input
              id="budgetVnd"
              type="number"
              min={500_000}
              step={100_000}
              value={budgetVnd}
              onChange={(e) => setBudgetVnd(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Số ngày</Label>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} ngày
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Đi cùng ai</Label>
            <Select
              value={companionType}
              onValueChange={(v) => setCompanionType(v as CompanionType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companionOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Sở thích (chọn ít nhất 1)</Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((opt) => {
                const active = interests.includes(opt.value);
                return (
                  <Badge
                    key={opt.value}
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer select-none px-3 py-1.5 text-sm"
                    onClick={() => toggleInterest(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                AI đang lên lịch trình...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Xây dựng lịch trình
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
