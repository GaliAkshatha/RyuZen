import { useAuth } from "@/contexts/AuthContext";
import { HeroBanner } from "@/shared/components/HeroBanner";

const ROLE_SUBTITLES: Record<string, string> = {
  SUPER_ADMIN: "Here's what's happening across the platform.",
  ORG_ADMIN: "Here's what's happening in your organization.",
  FACULTY: "Here's what needs your attention today.",
  STUDENT: "Here's what's happening in your academic journey.",
  ALUMNI: "Here's what's happening in your network.",
};

/**
 * Genuinely wired, not a placeholder — the greeting only needs the
 * current user's name and role, both already available from
 * AuthContext (F4). This isn't a new API integration, just reusing
 * data the app already has, so there's no reason to show it as
 * "coming later."
 */
export function DashboardHero() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <HeroBanner
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      subtitle={ROLE_SUBTITLES[user.role] ?? "Here's your dashboard."}
    />
  );
}
