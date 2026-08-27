import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle2, Save, Award } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { StatCard } from "@/shared/components/StatCard";
import { useMyMentorships } from "@/domains/mentorship/hooks/useMyMentorships";
import { useUpdateMentorship } from "@/domains/mentorship/hooks/useUpdateMentorship";
import { useCompleteMentorship } from "@/domains/mentorship/hooks/useCompleteMentorship";
import { MentorshipStatus, type Mentorship } from "@/domains/mentorship/mentorship.types";

/**
 * "My Students" - closes a real, previously-flagged Faculty portal
 * gap. Sourced from assigned mentees only (confirmed: Faculty has no
 * generic student-directory access), not a workaround for that
 * boundary - it's the real, intended shape of this feature.
 */
export function MyStudentsPage() {
  const { data: mentorships, isLoading, isError, error, refetch } = useMyMentorships();
  const { mutate: updateMentorship, isPending: isSaving } = useUpdateMentorship();
  const { mutate: completeMentorship, isPending: isCompleting } = useCompleteMentorship();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftRemarks, setDraftRemarks] = useState("");

  const active = (mentorships ?? []).filter((m) => m.status === MentorshipStatus.ACTIVE).length;
  const completed = (mentorships ?? []).filter((m) => m.status === MentorshipStatus.COMPLETED).length;

  function startEditing(m: Mentorship) {
    setEditingId(m.id);
    setDraftRemarks(m.remarks ?? "");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Students</h1>
        <p className="text-sm text-muted-foreground">Students assigned to you for mentorship.</p>
      </div>

      {!isLoading && !isError && mentorships && mentorships.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Users} value={mentorships.length} label="Total mentees" tone="primary" />
          <StatCard icon={Users} value={active} label="Active" tone="success" />
          <StatCard icon={CheckCircle2} value={completed} label="Completed" tone="info" />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !mentorships || mentorships.length === 0 ? (
        <EmptyState icon={Users} title="No mentees assigned yet" description="Your Org Admin assigns students to mentors." />
      ) : (
        <div className="flex flex-col gap-2">
          {mentorships.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex flex-col gap-3 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{m.studentName ?? m.studentId}</p>
                    {m.studentUsn && <p className="text-xs text-muted-foreground">{m.studentUsn}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={m.status} />
                    {m.studentUserId && (
                      <Link
                        to={`/faculty/students/${m.studentUserId}/certifications`}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Award className="h-3.5 w-3.5" aria-hidden="true" />
                        Certifications
                      </Link>
                    )}
                    {m.status === MentorshipStatus.ACTIVE && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isCompleting}
                        onClick={() => completeMentorship(m.id)}
                      >
                        Mark complete
                      </Button>
                    )}
                  </div>
                </div>

                {editingId === m.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={draftRemarks}
                      onChange={(e) => setDraftRemarks(e.target.value)}
                      placeholder="Add remarks about this mentee…"
                    />
                    <Button
                      size="sm"
                      disabled={isSaving || !draftRemarks.trim()}
                      className="flex items-center gap-1.5"
                      onClick={() => updateMentorship({ id: m.id, payload: { remarks: draftRemarks } }, { onSuccess: () => setEditingId(null) })}
                    >
                      <Save className="h-3.5 w-3.5" aria-hidden="true" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(m)}
                    className="w-fit text-left text-xs text-muted-foreground hover:text-foreground"
                  >
                    {m.remarks ? m.remarks : "Add remarks…"}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
