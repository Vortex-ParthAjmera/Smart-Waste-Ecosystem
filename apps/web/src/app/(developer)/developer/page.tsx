import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function DeveloperPage() {
  return <SmartWasteConsole accessRole="developer" initialRole="developer" projection={buildAppProjection()} />;
}
