import { TrendingUp, MessageCircle, Trophy, ShieldCheck, Network, Users2, LineChart, LayoutGrid, UserSearch, Target, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PathKey = "student" | "organization" | "recruiter";

export interface PathDetailItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface PathDetailContent {
  key: PathKey;
  label: string;
  color: string;
  glow: string;
  tagline: string;
  items: PathDetailItem[];
}

/**
 * The real content each path's expanded detail panel reveals - one
 * genuinely different feature set per role, matching what that
 * role's actual real dashboard provides (not the same 4 generic
 * bullets relabeled three times).
 */
export const PATH_DETAILS: Record<PathKey, PathDetailContent> = {
  student: {
    key: "student",
    label: "Student",
    color: "var(--rz-eye)",
    glow: "rgba(125,232,255,.45)",
    tagline: "Discover opportunities, build experience, develop skills, and understand your career readiness.",
    items: [
      { icon: TrendingUp, title: "A Career Score that means something", desc: "Leaderboard rank, resume quality, and verified achievements combined into one live number." },
      { icon: MessageCircle, title: "AI mock interviews, real feedback", desc: "Practice with an AI interviewer and get scored feedback before the real thing." },
      { icon: Trophy, title: "A leaderboard that's actually fair", desc: "Ranked within your own department and batch, not lost in a school-wide list." },
      { icon: ShieldCheck, title: "Achievements your faculty vouch for", desc: "Verified credentials, not self-reported claims recruiters have learned to ignore." },
    ],
  },
  organization: {
    key: "organization",
    label: "Organization",
    color: "var(--rz-gold)",
    glow: "rgba(232,200,122,.45)",
    tagline: "Create activities, engage students, manage participation, and understand campus involvement.",
    items: [
      { icon: Network, title: "Departments, faculty, and students in one place", desc: "Manage your entire academic structure from a single real dashboard." },
      { icon: Users2, title: "Activities that actually drive engagement", desc: "Faculty create real, targeted activities; students complete them; the record grows itself." },
      { icon: LineChart, title: "Placement analytics, not guesswork", desc: "Applications, shortlist rate, and placement outcomes tracked automatically." },
      { icon: BarChart3, title: "A real engagement leaderboard", desc: "See which departments and batches are genuinely participating, not assuming." },
    ],
  },
  recruiter: {
    key: "recruiter",
    label: "Recruiter",
    color: "var(--rz-purple)",
    glow: "rgba(177,140,255,.45)",
    tagline: "Explore student profiles, understand skills and experience, and find candidates who fit your needs.",
    items: [
      { icon: LayoutGrid, title: "A real pipeline, not a spreadsheet", desc: "Kanban-style applicant tracking - move candidates through stages with one click." },
      { icon: UserSearch, title: "The full candidate, before the interview", desc: "Career Score, verified portfolio, and real AI interview results - not just a PDF." },
      { icon: Target, title: "Source, don't just wait", desc: "Search and filter engaged, verified students directly - no more posting and hoping." },
      { icon: BarChart3, title: "Real analytics on your own drives", desc: "Applications, shortlist rate, and placement outcomes tracked automatically." },
    ],
  },
};
