import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Genuinely wired - a launcher button needs no data, only a real
 * destination. Links into AI Chat, which sits inside AIToolsLayout's
 * persistent tab strip alongside Resume Review, Career Score,
 * Recommendations, and Mock Interview - so this is a launcher into
 * the full AI workspace, not just the chat tab in isolation.
 */
export function AiLauncherWidget() {
  return (
    <WidgetCard title="AI Assistant" icon={Bot} wired>
      <div className="flex flex-col gap-3">
        <p className="font-body text-sm text-muted-foreground">
          Get help with resumes, interview practice, and career guidance.
        </p>
        <Button asChild size="sm" className="self-start">
          <Link to="/app/ai/chat">Open AI Chat</Link>
        </Button>
      </div>
    </WidgetCard>
  );
}
