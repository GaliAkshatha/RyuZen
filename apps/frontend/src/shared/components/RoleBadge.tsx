import { Badge, type BadgeProps } from "@/shared/ui/Badge";
import { UserRole } from "@/types/enums";

const ROLE_VARIANT_MAP: Record<UserRole, BadgeProps["variant"]> = {
  [UserRole.SUPER_ADMIN]: "default",
  [UserRole.ORG_ADMIN]: "secondary",
  [UserRole.FACULTY]: "info",
  [UserRole.STUDENT]: "outline",
  [UserRole.ALUMNI]: "warning",
};

const ROLE_LABEL_MAP: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "Super Admin",
  [UserRole.ORG_ADMIN]: "Org Admin",
  [UserRole.FACULTY]: "Faculty",
  [UserRole.STUDENT]: "Student",
  [UserRole.ALUMNI]: "Alumni",
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <Badge variant={ROLE_VARIANT_MAP[role]} className={className}>
      {ROLE_LABEL_MAP[role]}
    </Badge>
  );
}
