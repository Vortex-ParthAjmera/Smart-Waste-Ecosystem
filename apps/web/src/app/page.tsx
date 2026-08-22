import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function HomePage() {
  return <SmartWasteConsole projection={buildAppProjection()} />;
}
