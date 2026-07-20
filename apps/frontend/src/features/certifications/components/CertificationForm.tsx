import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createCertificationSchema,
  updateCertificationSchema,
  type CreateCertificationFormValues,
  type UpdateCertificationFormValues,
} from "@/features/certifications/schemas/certification.schemas";
import type { CertificationResponseDto } from "@/features/certifications/types/certification.types";

interface CertificationFormProps {
  certification?: CertificationResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateCertificationFormValues | UpdateCertificationFormValues) => void;
  onCancel?: () => void;
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/**
 * `credentialUrl` is optional on the backend, but its Zod rule
 * (`.url().optional()`) only skips validation for `undefined` — an
 * empty string still fails `.url()`. Rather than loosen the schema
 * (which would drift from the backend), a blank field is converted to
 * `undefined` here before validation runs, so leaving it empty means
 * "omit", not "invalid".
 */
export function CertificationForm({
  certification,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const isEdit = Boolean(certification);
  const [skillsInput, setSkillsInput] = useState(certification?.skills?.join(", ") ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCertificationFormValues>({
    resolver: zodResolver(isEdit ? updateCertificationSchema : createCertificationSchema),
    defaultValues: {
      title: certification?.title ?? "",
      issuer: certification?.issuer ?? "",
      credentialId: certification?.credentialId ?? "",
      issueDate: certification?.issueDate
        ? new Date(toDateInputValue(certification.issueDate))
        : undefined,
      expiryDate: certification?.expiryDate
        ? new Date(toDateInputValue(certification.expiryDate))
        : undefined,
      credentialUrl: certification?.credentialUrl ?? "",
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
          credentialUrl: values.credentialUrl?.trim() ? values.credentialUrl.trim() : undefined,
          skills: skillsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
            Title
          </label>
          <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="issuer" className="font-body text-sm font-medium text-foreground">
            Issuer
          </label>
          <Input id="issuer" aria-invalid={Boolean(errors.issuer)} {...register("issuer")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="issueDate" className="font-body text-sm font-medium text-foreground">
            Issue Date
          </label>
          <Controller
            control={control}
            name="issueDate"
            render={({ field }) => (
              <Input
                id="issueDate"
                type="date"
                value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiryDate" className="font-body text-sm font-medium text-foreground">
            Expiry Date (optional)
          </label>
          <Controller
            control={control}
            name="expiryDate"
            render={({ field }) => (
              <Input
                id="expiryDate"
                type="date"
                value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="credentialId" className="font-body text-sm font-medium text-foreground">
            Credential ID (optional)
          </label>
          <Input id="credentialId" {...register("credentialId")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="credentialUrl" className="font-body text-sm font-medium text-foreground">
            Credential URL (optional)
          </label>
          <Input id="credentialUrl" placeholder="https://…" {...register("credentialUrl")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="skills" className="font-body text-sm font-medium text-foreground">
          Related skills (comma-separated, optional)
        </label>
        <Input
          id="skills"
          placeholder="AWS, Cloud Architecture"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add certification"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
