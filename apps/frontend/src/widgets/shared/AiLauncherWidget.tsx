import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { WidgetCard } from "@/widgets/shared/WidgetCard";

/**
 * Genuinely wired — a launcher button needs no data, only a
 * destination route, which already exists (registered in F5's
 * navRegistry as /app/ai/chat). The destination page itself is still a
 * RouteStubPage until AI1 builds it; that's AI1's scope, not this
 * widget's.
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
