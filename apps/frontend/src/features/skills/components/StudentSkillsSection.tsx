import { BadgeCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";

import { useUserSkills } from "@/features/skills/hooks/useUserSkills";
import { VerifySkillAction } from "@/features/skills/components/VerifySkillAction";
import { canVerifySkills } from "@/features/skills/utils/skillPermissions";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Embedded in StudentDetailPage (A2). View + Verify only — a viewer
 * here doesn't own the student's skills, so Edit/Delete (which enforce
 * real server-side ownership, "You can only update your own skills.")
 * are correctly never shown. userId is the Student's own `userId`
 * field, not the Student.id — skills are scoped by User.id directly.
 */
export function StudentSkillsSection({ userId }: { userId: string }) {
  const { user } = useAuth();
  const { data: skills } = useUserSkills(userId);
  const canVerify = canVerifySkills(user?.role);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {!skills || skills.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No skills listed yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {skills.map((skill) => (
              <li key={skill.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-foreground">{skill.name}</span>
                  {skill.level && <Badge variant="outline">{skill.level}</Badge>}
                  {skill.verified && (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </div>
                {canVerify && <VerifySkillAction skill={skill} ownerUserId={userId} />}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
