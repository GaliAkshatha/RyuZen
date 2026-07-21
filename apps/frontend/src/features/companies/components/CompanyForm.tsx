import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createCompanySchema,
  updateCompanySchema,
  type CreateCompanyFormValues,
  type UpdateCompanyFormValues,
} from "@/features/companies/schemas/company.schemas";
import type { CompanyResponseDto } from "@/features/companies/types/company.types";

interface CompanyFormProps {
  company?: CompanyResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateCompanyFormValues | UpdateCompanyFormValues) => void;
}

export function CompanyForm({ company, isSubmitting, error, onSubmit }: CompanyFormProps) {
  const isEdit = Boolean(company);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(isEdit ? updateCompanySchema : createCompanySchema),
    defaultValues: {
      name: company?.name ?? "",
      logo: company?.logo ?? "",
      website: company?.website ?? "",
      description: company?.description ?? "",
      hrName: company?.hrName ?? "",
      hrEmail: company?.hrEmail ?? "",
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
          logo: values.logo?.trim() ? values.logo.trim() : undefined,
          website: values.website?.trim() ? values.website.trim() : undefined,
          hrEmail: values.hrEmail?.trim() ? values.hrEmail.trim() : undefined,
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
          Company Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="website" className="font-body text-sm font-medium text-foreground">
            Website (optional)
          </label>
          <Input id="website" placeholder="https://…" {...register("website")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="logo" className="font-body text-sm font-medium text-foreground">
            Logo URL (optional)
          </label>
          <Input id="logo" placeholder="https://…" {...register("logo")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description (optional)
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="hrName" className="font-body text-sm font-medium text-foreground">
            HR Contact Name (optional)
          </label>
          <Input id="hrName" {...register("hrName")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="hrEmail" className="font-body text-sm font-medium text-foreground">
            HR Contact Email (optional)
          </label>
          <Input id="hrEmail" type="email" {...register("hrEmail")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create company"}
      </Button>
    </form>
  );
}
