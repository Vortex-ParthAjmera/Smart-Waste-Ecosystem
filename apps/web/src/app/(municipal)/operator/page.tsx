import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function MunicipalOperatorPage() {
  return <SmartWasteConsole accessRole="municipal" initialRole="municipal" projection={buildAppProjection()} />;
}
