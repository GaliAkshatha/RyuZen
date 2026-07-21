import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createOrgAdminSchema,
  type CreateOrgAdminFormValues,
} from "@/features/organizations/schemas/organization.schemas";

interface CreateOrgAdminFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateOrgAdminFormValues) => void;
}

export function CreateOrgAdminForm({ isSubmitting, error, onSubmit }: CreateOrgAdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrgAdminFormValues>({
    resolver: zodResolver(createOrgAdminSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-name" className="font-body text-sm font-medium text-foreground">
          Name
        </label>
        <Input id="admin-name" {...register("name")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-email" className="font-body text-sm font-medium text-foreground">
          Email
        </label>
        <Input id="admin-email" type="email" {...register("email")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-password" className="font-body text-sm font-medium text-foreground">
          Temporary Password
        </label>
        <Input id="admin-password" type="password" {...register("password")} />
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Creating…" : "Create Org Admin"}
      </Button>
    </form>
  );
}
