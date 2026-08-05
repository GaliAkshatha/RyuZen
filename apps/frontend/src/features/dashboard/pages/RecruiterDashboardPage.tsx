import { useState } from "react";
import { Search, Users, X } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { useMyApplicants } from "@/features/recruiters/hooks/useMyApplicants";
import { useSearchApplicants } from "@/features/recruiters/hooks/useSearchApplicants";
import type { JobApplicationResponseDto } from "@/features/job-applications/types/jobApplication.types";

/**
 * "Recruiter reviews applicants" plus real Candidate Discovery search
 * — every row on this page, filtered or not, is resolved entirely
 * server-side from this recruiter's own real profile -> their real
 * company -> that company's real drives -> those drives' real
 * applications. There is no companyId passed from here, and search
 * only ever matches against REAL, verified skills (confirmed against
 * SearchApplicantsUseCase directly) — a candidate's own unverified,
 * self-typed skill claim never produces a search match.
 */
export function RecruiterDashboardPage() {
  const { data: applicants, isLoading, isError, error, refetch } = useMyApplicants();
  const { mutate: search, data: searchResults, isPending: isSearching, reset: resetSearch } =
    useSearchApplicants();

  const [skillsInput, setSkillsInput] = useState("");
  const [minCgpaInput, setMinCgpaInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch() {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const minCgpa = minCgpaInput ? Number(minCgpaInput) : undefined;

    setHasSearched(true);
    search({ skills: skills.length > 0 ? skills : undefined, minCgpa });
  }

  function handleClearSearch() {
    setSkillsInput("");
    setMinCgpaInput("");
    setHasSearched(false);
    resetSearch();
  }

  const displayedApplicants = hasSearched ? (searchResults ?? []) : (applicants ?? []);

  const columns: DataGridColumn<JobApplicationResponseDto>[] = [
    { key: "studentId", header: "Student", render: (a) => a.studentId },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "appliedAt",
      header: "Applied",
      render: (a) => new Date(a.appliedAt).toLocaleDateString(),
      sortable: true,
      sortValue: (a) => new Date(a.appliedAt).getTime(),
    },
    {
      key: "resume",
      header: "Resume",
      render: (a) =>
        a.resume ? (
          <a
            href={a.resume}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4"
          >
            View
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Users className="h-6 w-6 text-primary" aria-hidden="true" />
        My Applicants
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-primary" aria-hidden="true" />
            Candidate Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-body text-xs text-muted-foreground">
            Searches only your own applicant pool. Skill matches are checked against verified
            institutional data — a candidate's own unverified skill claim will never match.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              placeholder="Skills, e.g. React, Node.js"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
            <Input
              type="number"
              step="0.1"
              min={0}
              max={10}
              placeholder="Minimum CGPA"
              value={minCgpaInput}
              onChange={(e) => setMinCgpaInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
                {isSearching ? "Searching…" : "Search"}
              </Button>
              {hasSearched && (
                <Button variant="ghost" size="icon" onClick={handleClearSearch} aria-label="Clear search">
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DataGrid
        data={displayedApplicants}
        columns={columns}
        getRowId={(a) => a.id}
        isLoading={isLoading || isSearching}
        searchable
        searchPlaceholder="Filter results by student…"
        getSearchableText={(a) => a.studentId}
        emptyTitle={hasSearched ? "No matching candidates" : "No applicants yet"}
        emptyDescription={
          hasSearched
            ? "No applicants in your pool match this search — try broadening your criteria."
            : "Applicants to your company's placement drives will appear here."
        }
      />
    </div>
  );
}
