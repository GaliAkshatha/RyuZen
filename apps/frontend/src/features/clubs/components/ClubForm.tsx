import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createClubSchema,
  updateClubSchema,
  type CreateClubFormValues,
  type UpdateClubFormValues,
} from "@/features/clubs/schemas/club.schemas";
import type { ClubResponseDto } from "@/features/clubs/types/club.types";

interface ClubFormProps {
  club?: ClubResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateClubFormValues | UpdateClubFormValues) => void;
}

/** "code" is deliberately absent from edit — UpdateClubSchema has no code field, matching Department's same convention (A1). */
export function ClubForm({ club, isSubmitting, error, onSubmit }: ClubFormProps) {
  const isEdit = Boolean(club);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClubFormValues>({
    resolver: zodResolver(isEdit ? updateClubSchema : createClubSchema),
    defaultValues: {
      name: club?.name ?? "",
      code: club?.code ?? "",
      description: club?.description ?? "",
      logo: club?.logo ?? "",
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="font-body text-sm font-medium text-foreground">
            Code
          </label>
          <Input id="code" aria-invalid={Boolean(errors.code)} {...register("code")} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="logo" className="font-body text-sm font-medium text-foreground">
          Logo URL
        </label>
        <Input id="logo" placeholder="https://…" {...register("logo")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create club"}
      </Button>
    </form>
  );
}
