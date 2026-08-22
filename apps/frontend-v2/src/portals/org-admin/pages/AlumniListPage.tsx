import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck, Mail, Plus, ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/Tabs";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatCard } from "@/shared/components/StatCard";
import { useAlumniList } from "@/domains/alumni-management/hooks/useAlumniList";
import { useCreateAlumni } from "@/domains/alumni-management/hooks/useCreateAlumni";
import { useInviteAlumni } from "@/domains/alumni-management/hooks/useInviteAlumni";
import { useVerifyAlumni } from "@/domains/alumni-management/hooks/useVerifyAlumni";
import {
  inviteAlumniSchema,
  createAlumniSchema,
  type InviteAlumniFormValues,
  type CreateAlumniFormValues,
} from "@/domains/alumni-management/alumniSchemas";
import { AlumniStatus } from "@/domains/alumni-management/alumniManagement.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Closes a real, confirmed gap: Org Admin previously had no way to
 * manage Alumni records at all. Two genuinely distinct real backend
 * paths, both built: Invite (no user account exists yet - creates a
 * real invite-token flow) and Create (links an already-existing user
 * account, same pattern as Faculty/Student).
 */
export function AlumniListPage() {
  const { data: alumni, isLoading, isError, error, refetch } = useAlumniList();
  const { mutate: createAlumni, isPending: isCreating } = useCreateAlumni();
  const { mutate: inviteAlumni, isPending: isInviting } = useInviteAlumni();
  const { mutate: verifyAlumni, isPending: isVerifying, variables: verifyId } = useVerifyAlumni();
  const [formError, setFormError] = useState<AppApiError | null>(null);

  const inviteForm = useForm<InviteAlumniFormValues>({ resolver: zodResolver(inviteAlumniSchema) });
  const createForm = useForm<CreateAlumniFormValues>({ resolver: zodResolver(createAlumniSchema) });

  const active = (alumni ?? []).filter((a) => a.status === AlumniStatus.ACTIVE).length;
  const invited = (alumni ?? []).filter((a) => a.status === AlumniStatus.INVITED).length;
  const verified = (alumni ?? []).filter((a) => a.isVerified).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Alumni</h1>
        <p className="text-sm text-muted-foreground">Every alumni record in your organization.</p>
      </div>

      {!isLoading && !isError && alumni && alumni.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={Users} value={alumni.length} label="Total alumni" tone="primary" />
          <StatCard icon={UserCheck} value={active} label="Active" tone="success" />
          <StatCard icon={Mail} value={invited} label="Invited" tone="warning" />
          <StatCard icon={ShieldCheck} value={verified} label="Verified" tone="info" />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add alumni</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invite">
            <TabsList>
              <TabsTrigger value="invite" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Invite by email</TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Link existing account</TabsTrigger>
            </TabsList>

            <TabsContent value="invite">
              <form
                className="flex flex-col gap-4"
                noValidate
                onSubmit={inviteForm.handleSubmit((values) => {
                  setFormError(null);
                  inviteAlumni(values, { onSuccess: () => inviteForm.reset(), onError: (err) => setFormError(err) });
                })}
              >
                {formError && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{formError.message}</p>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="alumni-email">Email</Label>
                  <Input id="alumni-email" type="email" {...inviteForm.register("email")} />
                  {inviteForm.formState.errors.email && <p className="text-xs text-destructive">{inviteForm.formState.errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="alumni-name">Name (optional)</Label>
                    <Input id="alumni-name" {...inviteForm.register("name")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="alumni-grad-year">Graduation year (optional)</Label>
                    <Input id="alumni-grad-year" type="number" {...inviteForm.register("graduationYear")} />
                  </div>
                </div>
                <Button type="submit" disabled={isInviting} className="w-fit">{isInviting ? "Inviting…" : "Send invite"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="create">
              <form
                className="flex flex-col gap-4"
                noValidate
                onSubmit={createForm.handleSubmit((values) => {
                  setFormError(null);
                  createAlumni(values, { onSuccess: () => createForm.reset(), onError: (err) => setFormError(err) });
                })}
              >
                {formError && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{formError.message}</p>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="alumni-user-id">User ID</Label>
                  <Input id="alumni-user-id" placeholder="The real, existing account's user id" {...createForm.register("userId")} />
                  {createForm.formState.errors.userId && <p className="text-xs text-destructive">{createForm.formState.errors.userId.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="alumni-create-grad-year">Grad. year</Label>
                    <Input id="alumni-create-grad-year" type="number" {...createForm.register("graduationYear")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="alumni-company">Company</Label>
                    <Input id="alumni-company" {...createForm.register("company")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="alumni-designation">Designation</Label>
                    <Input id="alumni-designation" {...createForm.register("designation")} />
                  </div>
                </div>
                <Button type="submit" disabled={isCreating} className="w-fit">{isCreating ? "Creating…" : "Create alumni profile"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !alumni || alumni.length === 0 ? (
        <EmptyState icon={Users} title="No alumni yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {alumni.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">{a.name || a.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.email}
                    {a.company && ` · ${a.company}`}
                    {a.designation && ` · ${a.designation}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.status} />
                  {a.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-success"><ShieldCheck className="h-3.5 w-3.5" />Verified</span>
                  )}
                  {!a.isVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isVerifying && verifyId === a.id}
                      onClick={() => verifyAlumni(a.id)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
