import { Link } from "react-router-dom";
import { KeyRound, Laptop, Moon, Sun, ShieldCheck, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

/**
 * "Keep settings focused on account/appearance/notifications/privacy/
 * security/linked accounts. Do not mix settings with the student's
 * growth profile." Security (Change Password, Active Sessions) moved
 * here from ProfilePage, where it was previously mixed in with
 * identity/growth content.
 *
 * Deliberately does NOT include Notifications or Linked Accounts
 * sections - checked the backend directly and confirmed neither has
 * any real preference storage (no notificationPreferences,
 * privacySettings, or linked-account concept exists anywhere).
 * Building toggles for those would be fabricated UI with nothing
 * real behind it. Privacy links to Portfolio's real, existing
 * visibility setting (already in My Portfolio) rather than
 * duplicating that control here.
 */
export function SettingsPage() {
  const { mode, toggleMode } = useTheme();
  const { user } = useAuth();
  const isStudent = user?.role === UserRole.STUDENT;

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/profile/change-password" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Change Password
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/profile/sessions" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" aria-hidden="true" />
              Active Sessions
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="font-body text-sm text-muted-foreground">
            {mode === "dark" ? "Dark Fantasy Academy" : "Light Fantasy"}
          </p>
          <Button variant="outline" size="sm" onClick={toggleMode}>
            {mode === "dark" ? (
              <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Switch to {mode === "dark" ? "Light" : "Dark"}
          </Button>
        </CardContent>
      </Card>

      {isStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacy</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              Control whether your portfolio is public or private in My Portfolio.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/career/portfolio" className="flex items-center gap-2">
                Manage
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
