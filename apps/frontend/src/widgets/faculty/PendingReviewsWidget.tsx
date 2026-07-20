import { FileCheck } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function PendingReviewsWidget() {
  return (
    <WidgetCard
      title="Pending Reviews"
      icon={FileCheck}
      wired={false}
      milestone="AC2"
      placeholderMessage="Submissions awaiting your review will appear here."
    />
  );
}
