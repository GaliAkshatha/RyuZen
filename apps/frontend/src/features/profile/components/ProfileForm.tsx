import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { UrlInputField } from "@/shared/components/UrlInputField";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import type { ProfileResponseDto } from "@/features/auth/types/auth.types";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/features/profile/schemas/profile.schemas";
import type { UpdateProfilePayload } from "@/features/profile/types/profile.types";

export interface ProfileFormProps {
  profile: ProfileResponseDto;
  onSubmit: (payload: UpdateProfilePayload) => void;
  isSubmitting: boolean;
  error: AppApiError | null;
}

export function ProfileForm({ profile, onSubmit, isSubmitting, error }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      profile: {
        image: profile.profile.image,
        phone: profile.profile.phone,
        bio: profile.profile.bio,
      },
    },
  });

  function submit(values: UpdateProfileFormValues) {
    onSubmit(values);
  }

  const fieldErrors = [
    ...(errors.name ? [`Name: ${errors.name.message}`] : []),
    ...(errors.profile?.image ? [`Avatar URL: ${errors.profile.image.message}`] : []),
    ...(errors.profile?.phone ? [`Phone: ${errors.profile.phone.message}`] : []),
    ...(errors.profile?.bio ? [`Bio: ${errors.profile.bio.message}`] : []),
  ];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <Controller
        control={control}
        name="profile.image"
        render={({ field }) => (
          <UrlInputField
            label="Avatar URL"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="https://example.com/avatar.png"
          />
        )}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Full Name
        </label>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="font-body text-sm font-medium text-foreground">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.profile?.phone)}
          {...register("profile.phone")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="font-body text-sm font-medium text-foreground">
          Bio
        </label>
        <Textarea
          id="bio"
          rows={4}
          aria-invalid={Boolean(errors.profile?.bio)}
          {...register("profile.bio")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
