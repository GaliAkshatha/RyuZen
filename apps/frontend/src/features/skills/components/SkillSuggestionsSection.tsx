import { Sparkles, Wand2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Spinner } from "@/shared/components/Spinner";
import { useToast } from "@/hooks/useToast";

import { usePendingSkillSuggestions } from "@/features/skills/hooks/usePendingSkillSuggestions";
import { useExtractSkills } from "@/features/skills/hooks/useExtractSkills";
import { useApproveSkillSuggestion } from "@/features/skills/hooks/useApproveSkillSuggestion";
import { DeleteSkillAction } from "@/features/skills/components/DeleteSkillAction";

/**
 * AI Skill Extraction review UI — real suggestions inferred from the
 * student's actual Portfolio Projects, Certifications, Experience, and
 * completed Activities (Ollama-backed, see OllamaSkillExtractionProvider
 * on the backend). Each suggestion shows the model's own confidence and
 * the specific evidence it cited, so approving one is an informed
 * decision, not a blind click. Rejecting reuses DeleteSkillAction — a
 * rejected suggestion and a deleted skill are the same real action.
 */
export function SkillSuggestionsSection() {
  const { toast } = useToast();
  const { data: suggestions, isLoading } = usePendingSkillSuggestions();
  const { mutate: extract, isPending: isExtracting } = useExtractSkills();
  const { mutate: approve, isPending: isApproving } = useApproveSkillSuggestion();

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-primary" aria-hidden="true" />
          AI Skill Suggestions
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          disabled={isExtracting}
          onClick={() =>
            extract(undefined, {
              onSuccess: (created) =>
                toast({
                  title:
                    created.length > 0
                      ? `${created.length} new skill${created.length === 1 ? "" : "s"} suggested`
                      : "No new skills found",
                }),
            })
          }
        >
          {isExtracting ? "Analyzing your profile…" : "Suggest skills from my profile"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Spinner size="sm" />
        ) : !suggestions || suggestions.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">
            No pending suggestions. Click "Suggest skills from my profile" to have AI look at your
            projects, certifications, experience, and completed activities for skills you haven't
            added yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-card/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-body text-sm font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {suggestion.name}
                    {typeof suggestion.confidence === "number" && (
                      <Badge variant="secondary" className="text-[10px]">
                        {suggestion.confidence}% confidence
                      </Badge>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      disabled={isApproving}
                      onClick={() =>
                        approve(suggestion.id, {
                          onSuccess: () => toast({ title: `${suggestion.name} added to your skills` }),
                        })
                      }
                    >
                      Approve
                    </Button>
                    <DeleteSkillAction
                      skillId={suggestion.id}
                      title="Reject this suggestion?"
                      confirmLabel="Reject"
                      successMessage="Suggestion rejected"
                    />
                  </div>
                </div>
                {suggestion.evidence && (
                  <p className="font-body text-xs text-muted-foreground">{suggestion.evidence}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
