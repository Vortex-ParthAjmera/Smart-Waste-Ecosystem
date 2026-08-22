import { SmartWasteConsole } from "@/components/smart-waste-console";
import { buildAppProjection } from "@/lib/domain/projections";

export default function MunicipalReviewPage() {
  return <SmartWasteConsole initialRole="municipal" projection={buildAppProjection()} focus="review" />;
}
