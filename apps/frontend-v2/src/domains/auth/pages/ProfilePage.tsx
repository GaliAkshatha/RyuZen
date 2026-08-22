import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Check, LogOut, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useAuth } from "@/domains/auth/AuthContext";
import { useUpdateProfile } from "@/domains/auth/hooks/useUpdateProfile";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/domains/auth/updateProfileSchema";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ORG_ADMIN: "Organization Admin",
  PLACEMENT_ADMIN: "Placement Admin",
  FACULTY: "Faculty",
  STUDENT: "Student",
  ALUMNI: "Alumni",
  RECRUITER: "Recruiter",
};

/**
 * Real, shared profile page - PATCH /auth/profile is identical
 * regardless of role, confirmed directly against the real schema.
 * Deliberately mounted as a standalone route (not nested under any
 * portal layout) - it replaces the topbar entirely with just a back
 * button, matching a real LinkedIn/Instagram-style profile screen
 * rather than another page inside the normal chrome. Logout lives
 * here now, since the avatar (its only entry point) no longer opens a
 * dropdown menu.
 */
export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [current, setCurrent] = useState(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: current?.name ?? "",
      phone: current?.profile.phone ?? "",
      bio: current?.profile.bio ?? "",
      image: current?.profile.image ?? "",
    },
  });

  if (!current) return null;

  function onSubmit(values: UpdateProfileFormValues) {
    setSaved(false);
    updateProfile(
      { name: values.name, profile: { phone: values.phone, bio: values.bio, image: values.image } },
      {
        onSuccess: (profile) => {
          setCurrent(profile);
          setIsEditing(false);
          setSaved(true);
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-13 items-center gap-2.5 border-b border-border px-5 py-3">
        <button
          onClick={() => navigate(getPortalPathForRole(current.role))}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="text-sm text-muted-foreground">Back</span>
      </div>

      <div className="h-36 bg-gradient-to-r from-primary/25 via-primary/5 to-transparent" />

      <div className="mx-auto max-w-3xl px-8">
        <div className="-mt-14 flex items-end justify-between">
          {current.profile.image ? (
            <img
              src={current.profile.image}
              alt=""
              className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-primary text-3xl font-extrabold text-primary-foreground shadow-xl">
              {current.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex gap-2 pb-1">
            {!isEditing && (
              <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit profile
              </Button>
            )}
            <Button size="sm" variant="outline" className="flex items-center gap-2 text-destructive hover:text-destructive" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Log out
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-2xl font-bold text-foreground">{current.name}</h1>
          <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            {ROLE_LABELS[current.role] ?? current.role}
          </span>
          {current.profile.bio && <p className="mt-2 max-w-md text-sm text-muted-foreground">{current.profile.bio}</p>}
        </div>

        {saved && !isEditing && (
          <p className="mt-4 flex w-fit items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">
            <Check className="h-4 w-4" aria-hidden="true" />
            Profile updated
          </p>
        )}

        <div className="my-6 border-t border-border" />

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input id="profile-name" aria-invalid={Boolean(errors.name)} {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-phone">Phone</Label>
                  <Input id="profile-phone" {...register("phone")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Input id="profile-bio" placeholder="A short line about yourself" {...register("bio")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="profile-image">Avatar URL</Label>
                  <Input id="profile-image" placeholder="https://" {...register("image")} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isPending}>{isPending ? "Saving…" : "Save changes"}</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                <div><span className="text-muted-foreground">Email</span><p className="font-medium text-foreground">{current.email}</p></div>
                <div><span className="text-muted-foreground">Phone</span><p className="font-medium text-foreground">{current.profile.phone || "Not set"}</p></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
