import { Link } from "react-router-dom";
import { Bot, FileSearch, Gauge, Compass, Mic } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

const TOOLS = [
  {
    to: "/app/ai/chat",
    label: "AI Chat",
    icon: Bot,
    description: "Ask questions and get help with resumes, interview practice, and career guidance.",
  },
  {
    to: "/app/ai/resume-review",
    label: "Resume Review",
    icon: FileSearch,
    description: "Get real, structured feedback on your resume before you send it anywhere.",
  },
  {
    to: "/app/ai/career-score",
    label: "Career Score",
    icon: Gauge,
    description: "See how your real activity, skills, and achievements add up - and what to build next.",
  },
  {
    to: "/app/ai/recommendations",
    label: "Recommendations",
    icon: Compass,
    description: "Personalized suggestions for activities, skills, and opportunities worth pursuing.",
  },
  {
    to: "/app/ai/interview",
    label: "Mock Interview",
    icon: Mic,
    description: "Practice real interview questions and get feedback before the real thing.",
  },
];

export function AIToolsHubPage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <Link key={tool.to} to={tool.to} className="group">
          <Card className="h-full border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <tool.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {tool.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
