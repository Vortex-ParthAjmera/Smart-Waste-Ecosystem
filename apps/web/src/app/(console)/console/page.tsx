import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function ConsolePage() {
  return <SmartWasteConsole projection={buildAppProjection()} />;
}
