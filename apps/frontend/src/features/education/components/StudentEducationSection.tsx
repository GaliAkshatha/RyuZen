import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useUserEducation } from "@/features/education/hooks/useUserEducation";

/**
 * Embedded in StudentDetailPage (A2). View-only — a viewer here
 * doesn't own the student's education entries (Edit/Delete enforce
 * real ownership server-side, "You can only update your own education
 * entries."), and unlike Skills (CE1) there is no Verify action at all
 * for education. userId is the Student's own `userId` field.
 */
export function StudentEducationSection({ userId }: { userId: string }) {
  const { data: education } = useUserEducation(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        {!education || education.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            No education entries listed yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {education.map((entry) => (
              <li key={entry.id} className="flex flex-col">
                <span className="font-body text-sm text-foreground">
                  {entry.degree} — {entry.institution}
                </span>
                <span className="font-body text-xs text-muted-foreground">
                  {entry.startYear}
                  {entry.endYear ? ` – ${entry.endYear}` : " – present"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
