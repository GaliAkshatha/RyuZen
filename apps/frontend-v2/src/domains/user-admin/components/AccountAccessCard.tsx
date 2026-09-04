import { useState } from "react";
import { ShieldCheck, ShieldX, Unlock, Plus, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { useGrantPermission, useRevokePermission, useUnlockUser, useUpdateUserStatus } from "@/domains/user-admin/hooks/useUserAdminMutations";
import { Permission, UserAccountStatus } from "@/domains/user-admin/userAdmin.types";

const ALL_PERMISSIONS = Object.values(Permission);

/**
 * Real account-access management, filling a confirmed gap: all four
 * backend actions (grant/revoke permission, unlock, suspend/
 * reactivate) existed with zero frontend caller anywhere in the app.
 * Shared between Faculty and Student detail pages - same real
 * endpoints, same real shape, only the userId/recordQueryKey/current
 * values differ per caller (each detail page already fetches
 * userStatus/permissions as part of its own real query, via the
 * enrichment added to GetFacultyUseCase/GetStudentUseCase).
 */
export function AccountAccessCard({
  userId,
  recordQueryKey,
  userStatus,
  permissions,
}: {
  userId: string;
  recordQueryKey: readonly unknown[];
  userStatus?: string;
  permissions?: string[];
}) {
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus(userId, recordQueryKey);
  const { mutate: unlock, isPending: isUnlocking } = useUnlockUser(userId, recordQueryKey);
  const { mutate: grant, isPending: isGranting } = useGrantPermission(userId, recordQueryKey);
  const { mutate: revoke, isPending: isRevoking } = useRevokePermission(userId, recordQueryKey);
  const [selectedPermission, setSelectedPermission] = useState<string>("");

  const isSuspended = userStatus === UserAccountStatus.SUSPENDED;
  const grantedPermissions = permissions ?? [];
  const availableToGrant = ALL_PERMISSIONS.filter((p) => !grantedPermissions.includes(p));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account access</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isSuspended ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            }`}
          >
            {isSuspended ? <ShieldX className="h-3.5 w-3.5" aria-hidden="true" /> : <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
            {userStatus ?? "Unknown"}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={isUpdatingStatus}
            onClick={() => updateStatus({ status: isSuspended ? UserAccountStatus.ACTIVE : UserAccountStatus.SUSPENDED })}
          >
            {isUpdatingStatus ? "Saving…" : isSuspended ? "Reactivate account" : "Suspend account"}
          </Button>

          <Button size="sm" variant="outline" disabled={isUnlocking} onClick={() => unlock()} className="flex items-center gap-1.5">
            <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
            {isUnlocking ? "Unlocking…" : "Unlock account"}
          </Button>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Permissions</p>
          {grantedPermissions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No extra permissions granted.</p>
          ) : (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {grantedPermissions.map((p) => (
                <span key={p} className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {p}
                  <button
                    onClick={() => revoke({ permission: p as Permission })}
                    disabled={isRevoking}
                    aria-label={`Revoke ${p}`}
                    className="text-primary/70 hover:text-primary"
                  >
                    <Minus className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {availableToGrant.length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Grant a permission…" />
                </SelectTrigger>
                <SelectContent>
                  {availableToGrant.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                disabled={!selectedPermission || isGranting}
                onClick={() => {
                  grant({ permission: selectedPermission as Permission });
                  setSelectedPermission("");
                }}
                className="flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Grant
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
