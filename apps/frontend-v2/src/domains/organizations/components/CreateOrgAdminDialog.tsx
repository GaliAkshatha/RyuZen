import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useCreateOrgAdmin } from "@/domains/organizations/hooks/useCreateOrgAdmin";
import { createOrgAdminSchema, type CreateOrgAdminFormValues } from "@/domains/organizations/organizationSchemas";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateOrgAdminDialog({
  organizationId,
  open,
  onOpenChange,
}: {
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: createOrgAdmin, isPending } = useCreateOrgAdmin(organizationId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrgAdminFormValues>({
    resolver: zodResolver(createOrgAdminSchema),
  });

  function onSubmit(values: CreateOrgAdminFormValues) {
    setSubmitError(null);
    createOrgAdmin(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
      onError: (error) => setSubmitError((error as AppApiError).message),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add organization admin</DialogTitle>
          <DialogDescription>Creates the first admin account for this organization.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {submitError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin-name">Name</Label>
            <Input id="admin-name" aria-invalid={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" aria-invalid={Boolean(errors.email)} {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending ? "Creating…" : "Create admin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
