import { Badge, type BadgeProps } from "@/shared/ui/Badge";

const STATUS_VARIANT_MAP: Record<string, BadgeProps["variant"]> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
  PENDING: "warning",
  INVITED: "warning",
  EMAIL_VERIFIED: "warning",
  ARCHIVED: "secondary",
};

/**
 * Generic across every domain with a real status field - color is
 * paired with the real status text always, never color alone (a
 * genuine accessibility requirement, not decoration). Falls back to
 * a neutral outline for any status not in the map, rather than
 * hiding an unrecognized real value.
 */
export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT_MAP[status] ?? "outline"}>{status}</Badge>;
}
