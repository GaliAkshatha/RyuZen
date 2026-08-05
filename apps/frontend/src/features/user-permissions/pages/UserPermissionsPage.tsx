import { UserCog } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";

import { useGrantPermission } from "@/features/user-permissions/hooks/useGrantPermission";
import { useRevokePermission } from "@/features/user-permissions/hooks/useRevokePermission";
import { ManagePermissionsForm } from "@/features/user-permissions/components/ManagePermissionsForm";

export function UserPermissionsPage() {
  const {
    mutate: grant,
    data: grantedProfile,
    isPending: isGranting,
    error: grantError,
  } = useGrantPermission();
  const {
    mutate: revoke,
    data: revokedProfile,
    isPending: isRevoking,
    error: revokeError,
  } = useRevokePermission();

  const result = revokedProfile ?? grantedProfile;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <UserCog className="h-6 w-6 text-primary" aria-hidden="true" />
        Users &amp; Permissions
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Grant or Revoke a Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <ManagePermissionsForm
            isGranting={isGranting}
            isRevoking={isRevoking}
            error={grantError ?? revokeError}
            onGrant={(values) => grant(values)}
            onRevoke={(values) => revoke(values)}
          />
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.name} — Current Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {result.permissions.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">
                This user has no granted permissions.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {result.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
