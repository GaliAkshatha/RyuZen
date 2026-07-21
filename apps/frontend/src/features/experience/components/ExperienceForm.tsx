import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Switch } from "@/shared/ui/Switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { EmploymentType } from "@/types/enums";

import {
  createExperienceSchema,
  updateExperienceSchema,
  type CreateExperienceFormValues,
  type UpdateExperienceFormValues,
} from "@/features/experience/schemas/experience.schemas";
import type { ExperienceResponseDto } from "@/features/experience/types/experience.types";

interface ExperienceFormProps {
  experience?: ExperienceResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateExperienceFormValues | UpdateExperienceFormValues) => void;
  onCancel?: () => void;
}

const EMPLOYMENT_TYPES = [
  EmploymentType.FULL_TIME,
  EmploymentType.PART_TIME,
  EmploymentType.INTERNSHIP,
  EmploymentType.CONTRACT,
  EmploymentType.FREELANCE,
];

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/** `skills` is kept as local text-input state (not registered with RHF) since the field is a string[] but a text input can only ever produce a string — converted to an array only at submit time. */
export function ExperienceForm({
  experience,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const isEdit = Boolean(experience);
  const [skillsInput, setSkillsInput] = useState(experience?.skills?.join(", ") ?? "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateExperienceFormValues>({
    resolver: zodResolver(isEdit ? updateExperienceSchema : createExperienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      employmentType: experience?.employmentType,
      location: experience?.location ?? "",
      startDate: experience?.startDate
        ? new Date(toDateInputValue(experience.startDate))
        : undefined,
      endDate: experience?.endDate ? new Date(toDateInputValue(experience.endDate)) : undefined,
      currentlyWorking: experience?.currentlyWorking ?? false,
      description: experience?.description ?? "",
    },
  });

  const currentlyWorking = watch("currentlyWorking");

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="font-body text-sm font-medium text-foreground">
            Company
          </label>
          <Input id="company" aria-invalid={Boolean(errors.company)} {...register("company")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="role" className="font-body text-sm font-medium text-foreground">
            Role
          </label>
          <Input id="role" aria-invalid={Boolean(errors.role)} {...register("role")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Employment Type</label>
          <Controller
            control={control}
            name="employmentType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select employment type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="font-body text-sm font-medium text-foreground">
            Location (optional)
          </label>
          <Input id="location" {...register("location")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="font-body text-sm font-medium text-foreground">
            Start Date
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Input
                id="startDate"
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
          <label htmlFor="endDate" className="font-body text-sm font-medium text-foreground">
            End Date {currentlyWorking ? "(disabled — currently working)" : "(optional)"}
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Input
                id="endDate"
                type="date"
                disabled={currentlyWorking}
                value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
              />
            )}
          />
        </div>
      </div>

      <Controller
        control={control}
        name="currentlyWorking"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch id="currentlyWorking" checked={field.value} onCheckedChange={field.onChange} />
            <label
              htmlFor="currentlyWorking"
              className="font-body text-sm font-medium text-foreground"
            >
              Currently working here
            </label>
          </div>
        )}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description (optional)
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="skills" className="font-body text-sm font-medium text-foreground">
          Skills used (comma-separated, optional)
        </label>
        <Input
          id="skills"
          placeholder="React, TypeScript, Node.js"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add experience"}
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
