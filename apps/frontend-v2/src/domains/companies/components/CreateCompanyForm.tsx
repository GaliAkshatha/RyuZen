import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { createCompanySchema, type CreateCompanyFormValues } from "@/domains/companies/companySchemas";
import type { CreateCompanyRequest } from "@/domains/companies/company.types";
import type { AppApiError } from "@/shared/types/api.types";

export function CreateCompanyForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateCompanyRequest) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormValues>({ resolver: zodResolver(createCompanySchema) });

  function handleFormSubmit(values: CreateCompanyFormValues) {
    onSubmit({
      name: values.name,
      logo: values.logo || undefined,
      website: values.website || undefined,
      description: values.description || undefined,
      hrName: values.hrName || undefined,
      hrEmail: values.hrEmail || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {submitError.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-name">Company name</Label>
        <Input id="company-name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-website">Website (optional)</Label>
        <Input id="company-website" placeholder="https://" aria-invalid={Boolean(errors.website)} {...register("website")} />
        {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-description">Description (optional)</Label>
        <Input id="company-description" {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company-hr-name">HR contact name (optional)</Label>
          <Input id="company-hr-name" {...register("hrName")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company-hr-email">HR contact email (optional)</Label>
          <Input id="company-hr-email" type="email" aria-invalid={Boolean(errors.hrEmail)} {...register("hrEmail")} />
          {errors.hrEmail && <p className="text-xs text-destructive">{errors.hrEmail.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Creating…" : "Create company"}
      </Button>
    </form>
  );
}
