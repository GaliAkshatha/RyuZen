import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldPlus, ShieldMinus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { Permission } from "@/types/enums";

import {
  grantPermissionSchema,
  type GrantPermissionFormValues,
} from "@/features/user-permissions/schemas/userPermissions.schemas";

const PERMISSIONS = Object.values(Permission);

interface ManagePermissionsFormProps {
  isGranting: boolean;
  isRevoking: boolean;
  error: AppApiError | null;
  onGrant: (values: GrantPermissionFormValues) => void;
  onRevoke: (values: GrantPermissionFormValues) => void;
}

/**
 * Raw user-ID entry — there's no generic cross-role "browse/search all
 * users" endpoint wired into a reusable hook in this app, same
 * established precedent as NewChatForm (CM2) and IssueCertificateForm
 * (C5).
 */
export function ManagePermissionsForm({
  isGranting,
  isRevoking,
  error,
  onGrant,
  onRevoke,
}: ManagePermissionsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<GrantPermissionFormValues>({
    resolver: zodResolver(grantPermissionSchema),
    defaultValues: { userId: "", permission: undefined },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="userId" className="font-body text-sm font-medium text-foreground">
          User ID
        </label>
        <Input id="userId" placeholder="Enter the target user's ID" {...register("userId")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-medium text-foreground">Permission</label>
        <Controller
          control={control}
          name="permission"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Select permission">
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                {PERMISSIONS.map((permission) => (
                  <SelectItem key={permission} value={permission}>
                    {permission}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={isGranting} onClick={handleSubmit(onGrant)}>
          <ShieldPlus className="mr-2 h-4 w-4" aria-hidden="true" />
          {isGranting ? "Granting…" : "Grant"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isRevoking}
          onClick={handleSubmit(onRevoke)}
        >
          <ShieldMinus className="mr-2 h-4 w-4" aria-hidden="true" />
          {isRevoking ? "Revoking…" : "Revoke"}
        </Button>
      </div>
    </form>
  );
}
