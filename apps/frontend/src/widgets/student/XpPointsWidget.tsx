import { Trophy } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function XpPointsWidget() {
  return (
    <WidgetCard
      title="XP / Points"
      icon={Trophy}
      wired={false}
      milestone="C4"
      placeholderMessage="Your current leaderboard points and rank will appear here."
    />
  );
}
