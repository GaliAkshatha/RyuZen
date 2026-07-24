import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { useToast } from "@/hooks/useToast";

import { useChangePassword } from "@/features/profile/hooks/useChangePassword";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

export function ChangePasswordPage() {
  const { mutate, isPending, error } = useChangePassword();
  const { toast } = useToast();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        to="/app/profile"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to profile
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(payload) =>
              mutate(payload, {
                onSuccess: () => toast({ title: "Password changed" }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
