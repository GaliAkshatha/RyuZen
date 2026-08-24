import type { DemoRole } from "@/app/pages/landing/demoAccounts";

export interface DemoPreviewStat {
  value: string;
  label: string;
}

export interface DemoPreview {
  role: DemoRole;
  label: string;
  color: string;
  glow: string;
  stats: DemoPreviewStat[];
}

/**
 * One small, representative preview per role - genuinely different
 * stats per role (not the same 3 generic tiles relabeled), matching
 * what that role's own real dashboard actually leads with.
 */
export const DEMO_PREVIEWS: DemoPreview[] = [
  {
    role: "student",
    label: "Student",
    color: "var(--rz-eye)",
    glow: "rgba(125,232,255,.5)",
    stats: [
      { value: "82", label: "career score" },
      { value: "3", label: "open activities" },
      { value: "#4", label: "dept rank" },
    ],
  },
  {
    role: "faculty",
    label: "Faculty",
    color: "var(--rz-crystal)",
    glow: "rgba(79,227,212,.5)",
    stats: [
      { value: "6", label: "activities" },
      { value: "18", label: "mentees" },
      { value: "9", label: "pending review" },
    ],
  },
  {
    role: "alumni",
    label: "Alumni",
    color: "#B18CFF",
    glow: "rgba(177,140,255,.4)",
    stats: [
      { value: "24", label: "connections" },
      { value: "5", label: "requests" },
      { value: "2022", label: "batch" },
    ],
  },
  {
    role: "organization",
    label: "Organization",
    color: "var(--rz-gold)",
    glow: "rgba(232,200,122,.5)",
    stats: [
      { value: "54", label: "total users" },
      { value: "2", label: "departments" },
      { value: "29", label: "activities" },
    ],
  },
  {
    role: "recruiter",
    label: "Recruiter",
    color: "#B18CFF",
    glow: "rgba(177,140,255,.5)",
    stats: [
      { value: "47", label: "applicants" },
      { value: "18", label: "shortlisted" },
      { value: "5", label: "selected" },
    ],
  },
  {
    role: "placementAdmin",
    label: "Placement Admin",
    color: "var(--rz-gold)",
    glow: "rgba(232,200,122,.45)",
    stats: [
      { value: "3", label: "drives" },
      { value: "12", label: "companies" },
      { value: "68%", label: "placement rate" },
    ],
  },
];
