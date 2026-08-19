"use client";

import { useEffect, useRef, useState } from "react";
import type { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const SCANNER_ELEMENT_ID = "qr-reader";

type RedeemResult =
  | { status: "success"; travelerName: string | null; items: { serviceName: string; alreadyRedeemed: boolean }[] }
  | { status: "error"; message: string };

export function QrScanner() {
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!scanning) return;
    let cancelled = false;

    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      if (cancelled) return;
      const scanner = new Html5QrcodeScanner(
        SCANNER_ELEMENT_ID,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(handleDecoded, () => {});
      scannerRef.current = scanner;
    });

    return () => {
      cancelled = true;
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  async function handleDecoded(decodedText: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    setScanning(false);

    try {
      const res = await fetch("/api/tickets/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPayload: decodedText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ status: "error", message: data.error ?? "Không thể xác nhận vé." });
      } else {
        setResult({ status: "success", travelerName: data.travelerName, items: data.items });
      }
    } catch {
      setResult({ status: "error", message: "Lỗi kết nối. Vui lòng thử lại." });
    } finally {
      busyRef.current = false;
    }
  }

  function scanAgain() {
    setResult(null);
    setScanning(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {scanning && (
        <Card>
          <CardContent className="py-4">
            <div id={SCANNER_ELEMENT_ID} />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            {result.status === "success" ? (
              <>
                <CheckCircle2 className="size-12 text-primary" />
                <div>
                  <p className="text-lg font-semibold">
                    Đã check-in{result.travelerName ? `: ${result.travelerName}` : ""}
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                    {result.items.map((item) => (
                      <p key={item.serviceName}>
                        {item.serviceName} {item.alreadyRedeemed ? "(đã check-in trước đó)" : "— vừa check-in"}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="size-12 text-destructive" />
                <p className="font-medium">{result.message}</p>
              </>
            )}
            <Button onClick={scanAgain} variant="outline">
              <RotateCcw className="size-4" />
              Quét vé khác
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
