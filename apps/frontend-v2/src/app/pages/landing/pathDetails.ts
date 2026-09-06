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
  whyUs: string;
  items: PathDetailItem[];
}

/**
 * The real content each path's expanded detail panel reveals - one
 * genuinely different feature set per role, matching what that
 * role's actual real dashboard provides (not the same 4 generic
 * bullets relabeled three times). whyUs is a real competitive angle
 * per role - what RyuZen does differently, not just a feature list.
 */
export const PATH_DETAILS: Record<PathKey, PathDetailContent> = {
  student: {
    key: "student",
    label: "Student",
    color: "#5ce1e6",
    glow: "rgba(92,225,230,.55)",
    tagline: "Not a transcript of what you've done — a compass for what's next.",
    whyUs: "Most platforms track what's already done. RyuZen helps you see what's next - the skills worth building, the opportunities worth chasing.",
    items: [
      { icon: TrendingUp, title: "A Career Score that actually means something", desc: "Rank, resume quality, and verified achievements combined into one number that tells you where you really stand." },
      { icon: MessageCircle, title: "Practice before it counts", desc: "AI mock interviews with real, scored feedback - so the first time you're evaluated isn't the real thing." },
      { icon: Trophy, title: "A fair shot at recognition", desc: "Ranked within your own department and batch - never lost in a school-wide list you were never going to top." },
      { icon: ShieldCheck, title: "Achievements someone actually vouches for", desc: "Faculty-verified, not self-reported - the difference between a claim and something recruiters can trust." },
    ],
  },
  organization: {
    key: "organization",
    label: "Organization",
    color: "#ff9d3b",
    glow: "rgba(255,157,59,.55)",
    tagline: "Not a calendar to manage — the experiences that shape their journey.",
    whyUs: "Every activity is a chance to shape someone's story. RyuZen shows you which ones actually land - so you can build more of what works.",
    items: [
      { icon: Network, title: "Every department, one honest picture", desc: "See how faculty, students, and activity actually connect - not just where they're filed." },
      { icon: Users2, title: "Activities that actually reach students", desc: "Faculty create real, targeted opportunities; students show up; the record builds itself." },
      { icon: LineChart, title: "See outcomes, not just applications", desc: "Where your students are actually landing - not just how many applied and hoped." },
      { icon: BarChart3, title: "Know who's genuinely engaged", desc: "Which departments and batches are really showing up - not who you assumed was." },
    ],
  },
  recruiter: {
    key: "recruiter",
    label: "Recruiter",
    color: "#be8aff",
    glow: "rgba(190,138,255,.55)",
    tagline: "Not a stack of resumes — the person, the story, behind each one.",
    whyUs: "Job boards give you applications. RyuZen gives you evidence — real Career Scores, real interview performance, real campus activity — before you ever pick up the phone.",
    items: [
      { icon: LayoutGrid, title: "A real pipeline, not a spreadsheet", desc: "Kanban-style applicant tracking - move candidates through stages with one click." },
      { icon: UserSearch, title: "The full candidate, before the interview", desc: "Career Score, verified portfolio, and real AI interview results - not just a PDF." },
      { icon: Target, title: "Source, don't just wait", desc: "Search and filter engaged, verified students directly - no more posting and hoping." },
      { icon: BarChart3, title: "Real analytics on your own drives", desc: "Applications, shortlist rate, and placement outcomes tracked automatically." },
    ],
  },
};
