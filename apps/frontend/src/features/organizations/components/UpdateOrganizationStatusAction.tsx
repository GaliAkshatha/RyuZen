import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { useToast } from "@/hooks/useToast";
import { OrganizationStatus } from "@/types/enums";

import { useUpdateOrganizationStatus } from "@/features/organizations/hooks/useUpdateOrganizationStatus";
import {
  updateOrganizationStatusSchema,
  type UpdateOrganizationStatusFormValues,
} from "@/features/organizations/schemas/organization.schemas";

const STATUSES = [
  OrganizationStatus.ACTIVE,
  OrganizationStatus.INACTIVE,
  OrganizationStatus.SUSPENDED,
];

export function UpdateOrganizationStatusAction({
  organizationId,
  currentStatus,
}: {
  organizationId: string;
  currentStatus: OrganizationStatus;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateOrganizationStatus(organizationId);

  const { control, handleSubmit } = useForm<UpdateOrganizationStatusFormValues>({
    resolver: zodResolver(updateOrganizationStatusSchema),
    defaultValues: { status: currentStatus },
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutate(values, { onSuccess: () => toast({ title: "Status updated" }) }),
      )}
      className="flex items-center gap-2"
    >
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-36" aria-label="Select status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving…" : "Update Status"}
      </Button>
    </form>
  );
}
