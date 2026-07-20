import { Award } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";

export function LeaderboardSnippetWidget() {
  return (
    <WidgetCard
      title="Leaderboard"
      icon={Award}
      wired={false}
      milestone="C4"
      placeholderMessage="The top-ranked students near you will appear here."
    />
  );
}
