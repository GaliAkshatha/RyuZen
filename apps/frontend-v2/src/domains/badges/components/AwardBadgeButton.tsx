import { useState } from "react";
import { Award, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useBadges } from "@/domains/badges/hooks/useBadges";
import { useAwardBadge } from "@/domains/badges/hooks/useBadgeMutations";

/**
 * Real gap filled: AwardBadgeSchema/AwardBadgeUseCase existed on the
 * backend (Faculty/Org Admin/Super Admin can award a catalog badge to
 * a student) with zero frontend caller. A small inline picker rather
 * than a full page, since awarding is a quick, occasional action, not
 * a primary workflow.
 */
export function AwardBadgeButton({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const { data: badges } = useBadges();
  const { mutate: award, isPending } = useAwardBadge(studentId);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
        <Award className="h-3.5 w-3.5" aria-hidden="true" />
        Award badge
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        disabled={isPending}
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            award({ badgeId: e.target.value, payload: { studentId } }, { onSuccess: () => setOpen(false) });
          }
        }}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="" disabled>
          {isPending ? "Awarding…" : "Choose a badge…"}
        </option>
        {(badges ?? []).map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="h-8 w-8 p-0">
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}
