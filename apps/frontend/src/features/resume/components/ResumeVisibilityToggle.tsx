import { Switch } from "@/shared/ui/Switch";
import { useToast } from "@/hooks/useToast";
import { ResumeVisibility } from "@/types/enums";

import { useUpdateResumeVisibility } from "@/features/resume/hooks/useUpdateResumeVisibility";

export function ResumeVisibilityToggle({ visibility }: { visibility: ResumeVisibility }) {
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateResumeVisibility();

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="resumeVisibility"
        checked={visibility === ResumeVisibility.PUBLIC}
        disabled={isPending}
        onCheckedChange={(checked) =>
          mutate(
            { visibility: checked ? ResumeVisibility.PUBLIC : ResumeVisibility.PRIVATE },
            { onSuccess: () => toast({ title: "Visibility updated" }) },
          )
        }
      />
      <label htmlFor="resumeVisibility" className="font-body text-sm text-foreground">
        {visibility === ResumeVisibility.PUBLIC ? "Public" : "Private"}
      </label>
    </div>
  );
}
