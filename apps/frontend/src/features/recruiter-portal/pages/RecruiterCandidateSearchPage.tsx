import { useState } from "react";
import { Search, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { useSearchApplicants } from "@/features/recruiters/hooks/useSearchApplicants";
import { RecruiterLayout } from "@/features/recruiter-portal/components/RecruiterLayout";
import { ApplicantsTable } from "@/features/recruiter-portal/components/ApplicantsTable";

/**
 * Real Candidate Discovery, scoped entirely server-side to this
 * recruiter's own real company's applicant pool (SearchApplicantsUseCase)
 * - never a companyId passed from here. Skill matches only ever
 * consider verified, institutional data - a candidate's own
 * unverified skill claim never produces a match.
 */
export function RecruiterCandidateSearchPage() {
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

  return (
    <RecruiterLayout>
      <div className="flex flex-col gap-6">
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

        {hasSearched && (
          <ApplicantsTable
            applicants={searchResults ?? []}
            isLoading={isSearching}
            emptyTitle="No matching candidates"
            emptyDescription="No applicants in your pool match this search — try broadening your criteria."
          />
        )}
      </div>
    </RecruiterLayout>
  );
}
