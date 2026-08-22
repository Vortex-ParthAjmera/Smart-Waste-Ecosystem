"use client";

import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";

export default function ScanCitizenPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Scan Citizen QR Code"
        description="Scan citizen's opaque QR token at bin collection point to claim disposal session"
      />
      <QrScanner />
    </div>
  );
}
