import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";

import { useUserExperience } from "@/features/experience/hooks/useUserExperience";

/**
 * Embedded in StudentDetailPage (A2). View-only — a viewer here
 * doesn't own the student's experience entries (Edit/Delete enforce
 * real ownership server-side, "You can only update your own
 * experience entries."). userId is the Student's own `userId` field.
 */
export function StudentExperienceSection({ userId }: { userId: string }) {
  const { data: experience } = useUserExperience(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent>
        {!experience || experience.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            No experience entries listed yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {experience.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1">
                <span className="font-body text-sm text-foreground">
                  {entry.role} — {entry.company}
                </span>
                <span className="font-body text-xs text-muted-foreground">
                  {new Date(entry.startDate).toLocaleDateString()}
                  {" – "}
                  {entry.currentlyWorking
                    ? "present"
                    : entry.endDate
                      ? new Date(entry.endDate).toLocaleDateString()
                      : "present"}
                </span>
                {entry.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
