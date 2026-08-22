import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function CitizenPage() {
  return <SmartWasteConsole accessRole="citizen" initialRole="citizen" projection={buildAppProjection()} />;
}
