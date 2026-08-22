import { navRegistry, type NavGroup } from "@/shared/constants/navRegistry";
import type { UserRole } from "@/types/enums";

import type { SidebarSection } from "@/app-shell/layout/SidebarV2";

/** Order and human labels for the rebuilt Student IA - not every group
 * needs a visible label ("overview"/"account" read fine unlabeled,
 * matching the one existing precedent this app already established). */
const GROUP_ORDER: NavGroup[] = [
  "overview",
  "growth",
  "academic",
  "career",
  "placements",
  "ai",
  "community",
  "campus",
  "account",
];

const GROUP_LABELS: Partial<Record<NavGroup, string>> = {
  growth: "Growth",
  academic: "Learning",
  career: "Career",
  placements: "Placements",
  community: "Community",
  campus: "Campus",
};

/**
 * Pure data transform, no rendering - reuses navRegistry's real,
 * already-verified role/path data (the source of truth for who can
 * see what) rather than re-declaring nav items for the new shell.
 * Only the composition (SidebarV2) and grouping/labels above are new.
 */
export function buildSidebarSections(role: UserRole): SidebarSection[] {
  const visibleItems = navRegistry.filter(
    (item) => item.roles.includes(role) && item.group !== "account",
  );

  return GROUP_ORDER.filter((group) => group !== "account")
    .map((group) => ({
      group,
      label: GROUP_LABELS[group],
      items: visibleItems.filter((item) => item.group === group),
    }))
    .filter((section) => section.items.length > 0);
}
