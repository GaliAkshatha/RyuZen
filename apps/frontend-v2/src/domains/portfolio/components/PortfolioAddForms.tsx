import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import {
  useCreateProject,
  useCreateAchievement,
  useCreateExperience,
  useCreateEducation,
  useCreateCertification,
} from "@/domains/portfolio/hooks/usePortfolioMutations";
import type {
  CreatePortfolioProjectRequest,
  CreateAchievementRequest,
  CreateExperienceRequest,
  CreateEducationRequest,
  CreateCertificationRequest,
} from "@/domains/portfolio/portfolio.types";
import type { AppApiError } from "@/shared/types/api.types";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function ErrorText({ error }: { error?: AppApiError | null }) {
  if (!error) return null;
  return <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">{error.message}</p>;
}

/**
 * Five real add forms, each matching its real backend Create*Schema
 * field-for-field, filling a confirmed gap: only Skills had real add
 * functionality before this - Projects, Achievements, Experience,
 * Education, and Certifications were read-only display with no way
 * to add an entry from the frontend at all.
 */

export function AddProjectForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending, error } = useCreateProject();
  const { register, handleSubmit } = useForm<{ title: string; description: string; techStack: string; github: string; liveDemo: string }>();

  function onSubmit(values: { title: string; description: string; techStack: string; github: string; liveDemo: string }) {
    const payload: CreatePortfolioProjectRequest = {
      title: values.title,
      description: values.description || undefined,
      techStack: values.techStack
        ? values.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
      github: values.github || undefined,
      liveDemo: values.liveDemo || undefined,
    };
    mutate(payload, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <ErrorText error={error} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proj-title">Title</Label>
        <Input id="proj-title" {...register("title", { required: true })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proj-desc">Description</Label>
        <Input id="proj-desc" {...register("description")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proj-tech">Tech stack (comma separated)</Label>
        <Input id="proj-tech" placeholder="React, Node.js, MongoDB" {...register("techStack")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proj-github">GitHub URL</Label>
          <Input id="proj-github" {...register("github")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proj-demo">Live demo URL</Label>
          <Input id="proj-demo" {...register("liveDemo")} />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Adding…" : "Add project"}
      </Button>
    </form>
  );
}

export function AddAchievementForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending, error } = useCreateAchievement();
  const { register, handleSubmit } = useForm<{ title: string; description: string; level: string; position: string; achievementDate: string }>();

  function onSubmit(values: { title: string; description: string; level: string; position: string; achievementDate: string }) {
    const payload: CreateAchievementRequest = {
      title: values.title,
      description: values.description || undefined,
      level: (values.level || undefined) as CreateAchievementRequest["level"],
      position: values.position || undefined,
      achievementDate: values.achievementDate,
    };
    mutate(payload, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <ErrorText error={error} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ach-title">Title</Label>
        <Input id="ach-title" {...register("title", { required: true })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ach-desc">Description</Label>
        <Input id="ach-desc" {...register("description")} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ach-level">Level</Label>
          <select id="ach-level" className={selectClass} {...register("level")}>
            <option value="">—</option>
            <option value="COLLEGE">College</option>
            <option value="STATE">State</option>
            <option value="NATIONAL">National</option>
            <option value="INTERNATIONAL">International</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ach-position">Position</Label>
          <Input id="ach-position" placeholder="1st place" {...register("position")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ach-date">Date</Label>
          <Input id="ach-date" type="date" {...register("achievementDate", { required: true })} />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Adding…" : "Add achievement"}
      </Button>
    </form>
  );
}

export function AddExperienceForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending, error } = useCreateExperience();
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const { register, handleSubmit } = useForm<{
    company: string;
    role: string;
    employmentType: string;
    startDate: string;
    endDate: string;
    description: string;
  }>();

  function onSubmit(values: { company: string; role: string; employmentType: string; startDate: string; endDate: string; description: string }) {
    const payload: CreateExperienceRequest = {
      company: values.company,
      role: values.role,
      employmentType: (values.employmentType || undefined) as CreateExperienceRequest["employmentType"],
      startDate: values.startDate,
      endDate: currentlyWorking ? undefined : values.endDate || undefined,
      currentlyWorking,
      description: values.description || undefined,
    };
    mutate(payload, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <ErrorText error={error} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-company">Company</Label>
          <Input id="exp-company" {...register("company", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-role">Role</Label>
          <Input id="exp-role" {...register("role", { required: true })} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="exp-type">Employment type</Label>
        <select id="exp-type" className={selectClass} {...register("employmentType")}>
          <option value="">—</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
          <option value="FREELANCE">Freelance</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-start">Start date</Label>
          <Input id="exp-start" type="date" {...register("startDate", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp-end">End date</Label>
          <Input id="exp-end" type="date" disabled={currentlyWorking} {...register("endDate")} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={currentlyWorking} onChange={(e) => setCurrentlyWorking(e.target.checked)} />
        Currently working here
      </label>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="exp-desc">Description</Label>
        <Input id="exp-desc" {...register("description")} />
      </div>
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Adding…" : "Add experience"}
      </Button>
    </form>
  );
}

export function AddEducationForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending, error } = useCreateEducation();
  const { register, handleSubmit } = useForm<{ institution: string; degree: string; branch: string; cgpa: string; startYear: string; endYear: string }>();

  function onSubmit(values: { institution: string; degree: string; branch: string; cgpa: string; startYear: string; endYear: string }) {
    const payload: CreateEducationRequest = {
      institution: values.institution,
      degree: values.degree,
      branch: values.branch || undefined,
      cgpa: values.cgpa ? Number(values.cgpa) : undefined,
      startYear: Number(values.startYear),
      endYear: values.endYear ? Number(values.endYear) : undefined,
    };
    mutate(payload, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <ErrorText error={error} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edu-institution">Institution</Label>
        <Input id="edu-institution" {...register("institution", { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edu-degree">Degree</Label>
          <Input id="edu-degree" placeholder="B.Tech" {...register("degree", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edu-branch">Branch</Label>
          <Input id="edu-branch" placeholder="Computer Science" {...register("branch")} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edu-cgpa">CGPA</Label>
          <Input id="edu-cgpa" type="number" step="0.01" min="0" max="10" {...register("cgpa")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edu-start">Start year</Label>
          <Input id="edu-start" type="number" {...register("startYear", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edu-end">End year</Label>
          <Input id="edu-end" type="number" {...register("endYear")} />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Adding…" : "Add education"}
      </Button>
    </form>
  );
}

export function AddCertificationForm({ onDone }: { onDone: () => void }) {
  const { mutate, isPending, error } = useCreateCertification();
  const { register, handleSubmit } = useForm<{
    title: string;
    issuer: string;
    credentialId: string;
    issueDate: string;
    expiryDate: string;
    credentialUrl: string;
  }>();

  function onSubmit(values: { title: string; issuer: string; credentialId: string; issueDate: string; expiryDate: string; credentialUrl: string }) {
    const payload: CreateCertificationRequest = {
      title: values.title,
      issuer: values.issuer,
      credentialId: values.credentialId || undefined,
      issueDate: values.issueDate,
      expiryDate: values.expiryDate || undefined,
      credentialUrl: values.credentialUrl || undefined,
    };
    mutate(payload, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <ErrorText error={error} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cert-title">Title</Label>
          <Input id="cert-title" {...register("title", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cert-issuer">Issuer</Label>
          <Input id="cert-issuer" {...register("issuer", { required: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cert-issue-date">Issue date</Label>
          <Input id="cert-issue-date" type="date" {...register("issueDate", { required: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cert-expiry">Expiry date</Label>
          <Input id="cert-expiry" type="date" {...register("expiryDate")} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cert-url">Credential URL</Label>
        <Input id="cert-url" placeholder="https://coursera.org/verify/..." {...register("credentialUrl")} />
      </div>
      <p className="text-xs text-muted-foreground">You can attach a file (PDF or image) to this certification after adding it.</p>
      <Button type="submit" size="sm" disabled={isPending} className="w-fit">
        {isPending ? "Adding…" : "Add certification"}
      </Button>
    </form>
  );
}
