import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Wrench, CalendarDays, Code2, HelpCircle, ClipboardList, ListChecks, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { useCreateActivity } from "@/domains/activities/hooks/useCreateActivity";
import { CreateActivityForm } from "@/domains/activities/components/CreateActivityForm";
import type { ActivityType, CreateActivityRequest } from "@/domains/activities/activity.types";
import type { AppApiError } from "@/shared/types/api.types";

const TYPE_OPTIONS: { value: ActivityType; label: string; icon: typeof FileText }[] = [
  { value: "ASSIGNMENT", label: "Assignment", icon: FileText },
  { value: "WORKSHOP", label: "Workshop", icon: Wrench },
  { value: "EVENT", label: "Event", icon: CalendarDays },
  { value: "HACKATHON", label: "Hackathon", icon: Code2 },
  { value: "QUIZ", label: "Quiz", icon: HelpCircle },
  { value: "FORM", label: "Form", icon: ClipboardList },
  { value: "SURVEY", label: "Survey", icon: ListChecks },
];

/**
 * Real 2-step flow, per approved wireframe: pick a type first, then
 * fill the real form. Honest about what this wizard actually does -
 * checked CreateActivitySchema directly, every type shares the exact
 * same fields, so step 2 never changes based on step 1's choice. The
 * wizard makes the type selection deliberate, it doesn't unlock
 * fields that don't exist in the backend.
 */
export function CreateActivityPage() {
  const navigate = useNavigate();
  const { mutate: createActivity, isPending } = useCreateActivity();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);

  function handleSubmit(values: CreateActivityRequest) {
    setSubmitError(null);
    createActivity(values, {
      onSuccess: (activity) => navigate(`/faculty/activities/${activity.id}`),
      onError: (error) => setSubmitError(error),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div className="flex gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className={`h-1 flex-1 rounded-full ${selectedType ? "bg-primary" : "bg-border"}`} />
      </div>

      {!selectedType ? (
        <Card>
          <CardHeader>
            <CardTitle>What kind of activity?</CardTitle>
            <CardDescription>Step 1 of 2</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center transition-colors hover:border-primary/40"
                >
                  <opt.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create {selectedType.toLowerCase()}</CardTitle>
                <CardDescription>Step 2 of 2 · Starts as a draft — publish when you're ready.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5" onClick={() => setSelectedType(null)}>
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CreateActivityForm type={selectedType} onSubmit={handleSubmit} isSubmitting={isPending} submitError={submitError} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
