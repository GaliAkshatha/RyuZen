import type { DemoRole } from "@/app/pages/landing/demoAccounts";

export interface DemoPreviewStat {
  value: string;
  label: string;
}

export interface DemoPreviewRow {
  label: string;
  value: string;
}

export interface DemoPreview {
  role: DemoRole;
  label: string;
  color: string;
  glow: string;
  stats: DemoPreviewStat[];
  rows: DemoPreviewRow[];
}

/**
 * One small, representative dashboard snapshot per role - genuinely
 * different stats and rows per role (not the same 3 tiles relabeled),
 * matching what that role's own real dashboard actually leads with.
 * rows are what makes this read as an actual dashboard snapshot
 * rather than just three numbers.
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
    rows: [
      { label: "AWS Cloud Practitioner", value: "verified" },
      { label: "Mock interview — SWE", value: "score 78" },
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
    rows: [
      { label: "Cloud Fundamentals Workshop", value: "published" },
      { label: "Core CS Concepts Quiz", value: "3 pending" },
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
    rows: [
      { label: "New connection requests", value: "5 pending" },
      { label: "Profile status", value: "verified" },
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
    rows: [
      { label: "Computer Science", value: "32 students" },
      { label: "Engagement this term", value: "68%" },
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
    rows: [
      { label: "Ananya Sharma — CSE", value: "score 91" },
      { label: "Rohan Mehta — CSE", value: "score 74" },
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
    rows: [
      { label: "Software Engineer Drive", value: "active" },
      { label: "Companies this term", value: "12" },
    ],
  },
];
