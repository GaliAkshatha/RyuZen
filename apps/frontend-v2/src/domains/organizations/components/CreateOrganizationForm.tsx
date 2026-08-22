import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { createOrganizationSchema, type CreateOrganizationFormValues } from "@/domains/organizations/organizationSchemas";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateOrganizationForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: { name: string; code: string; emailDomains: string[] }) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  function handleFormSubmit(values: CreateOrganizationFormValues) {
    // Real transform: the schema validates emailDomainsInput as a
    // single string (what a text input naturally produces) - split
    // and cleaned into the real string[] the backend expects, here at
    // the boundary rather than inside the schema itself.
    const emailDomains = values.emailDomainsInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    onSubmit({ name: values.name, code: values.code, emailDomains });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="code">Code</Label>
        <Input id="code" placeholder="e.g. RVITM" aria-invalid={Boolean(errors.code)} {...register("code")} />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        <p className="text-xs text-muted-foreground">2-10 characters, used as a short identifier.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="emailDomainsInput">Email domains</Label>
        <Input
          id="emailDomainsInput"
          placeholder="e.g. rvitm.edu.in, rv.edu.in"
          aria-invalid={Boolean(errors.emailDomainsInput)}
          {...register("emailDomainsInput")}
        />
        {errors.emailDomainsInput && (
          <p className="text-xs text-destructive">{errors.emailDomainsInput.message}</p>
        )}
        <p className="text-xs text-muted-foreground">Comma-separated. Used to verify student self-registration.</p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create organization"}
      </Button>
    </form>
  );
}
