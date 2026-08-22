import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function CitizenPage() {
  return <SmartWasteConsole initialRole="citizen" projection={buildAppProjection()} />;
}
