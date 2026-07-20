import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";

import { useInviteAlumni } from "@/features/alumni/hooks/useInviteAlumni";
import { InviteAlumniForm } from "@/features/alumni/components/InviteAlumniForm";

export function InviteAlumniPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useInviteAlumni();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        to="/app/admin/alumni"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Alumni
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Invite Alumnus</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteAlumniForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values, onDone) => mutate(values, { onSuccess: onDone })}
          />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        onClick={() => navigate("/app/admin/alumni")}
        className="self-start"
      >
        Done
      </Button>
    </div>
  );
}
