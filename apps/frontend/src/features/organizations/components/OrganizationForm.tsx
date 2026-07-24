import { useState } from "react";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationFormValues,
  type UpdateOrganizationFormValues,
} from "@/features/organizations/schemas/organization.schemas";
import type { OrganizationResponseDto } from "@/features/organizations/types/organization.types";

interface OrganizationFormProps {
  organization?: OrganizationResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateOrganizationFormValues | UpdateOrganizationFormValues) => void;
}

/** `emailDomains` is kept as local comma-separated state, same pattern as ExperienceForm's skills field — a text input can only produce a string, but this field is a string[]. */
export function OrganizationForm({
  organization,
  isSubmitting,
  error,
  onSubmit,
}: OrganizationFormProps) {
  const isEdit = Boolean(organization);
  const [emailDomainsInput, setEmailDomainsInput] = useState(
    organization?.emailDomains?.join(", ") ?? "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<CreateOrganizationFormValues>({
    resolver: zodResolver(isEdit ? updateOrganizationSchema : createOrganizationSchema),
    defaultValues: {
      name: organization?.name ?? "",
      code: organization?.code ?? "",
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          emailDomains: emailDomainsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      )}
      className="flex flex-col gap-4"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Organization Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="font-body text-sm font-medium text-foreground">
            Code
          </label>
          <Input id="code" placeholder="e.g. RYU" {...register("code")} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="emailDomains" className="font-body text-sm font-medium text-foreground">
          Allowed Email Domains (comma-separated)
        </label>
        <Input
          id="emailDomains"
          placeholder="university.edu, alumni.university.edu"
          value={emailDomainsInput}
          onChange={(e) => setEmailDomainsInput(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create organization"}
      </Button>
    </form>
  );
}
