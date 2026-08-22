import { useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { EmptyState } from "@/shared/components/EmptyState";
import { useSearchApplicants } from "@/domains/recruiters/hooks/useSearchApplicants";
import { ApplicantRow } from "@/domains/recruiters/components/ApplicantRow";

/**
 * Real search, scoped entirely server-side to this recruiter's own
 * company's applicant pool (confirmed - the use case resolves
 * companyId from the recruiter's own profile, never from a request
 * parameter). Skills/CGPA filter only what already exists in that
 * pool - there is no unrestricted student directory anywhere in this
 * path.
 */
export function CandidateSearchPage() {
  const [skillsInput, setSkillsInput] = useState("");
  const [minCgpaInput, setMinCgpaInput] = useState("");
  const { mutate: search, data: results, isPending, isSuccess } = useSearchApplicants();

  function handleSearch() {
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    search({
      skills: skills.length > 0 ? skills : undefined,
      minCgpa: minCgpaInput ? Number(minCgpaInput) : undefined,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Candidate Search</h1>
        <p className="text-sm text-muted-foreground">Search within your own applicant pool.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-4 w-4 text-primary" aria-hidden="true" />
            Filters
          </CardTitle>
          <CardDescription>Only searches applicants who have already applied to your company's drives.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-skills">Skills</Label>
            <Input
              id="search-skills"
              placeholder="e.g. React, Node.js"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-cgpa">Minimum CGPA</Label>
            <Input
              id="search-cgpa"
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={minCgpaInput}
              onChange={(e) => setMinCgpaInput(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={isPending} className="w-full">
              {isPending ? "Searching…" : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSuccess && (
        <div className="flex flex-col gap-2">
          {!results || results.length === 0 ? (
            <EmptyState title="No matching candidates" description="Try broadening your search criteria." />
          ) : (
            results.map((applicant) => <ApplicantRow key={applicant.id} applicant={applicant} />)
          )}
        </div>
      )}
    </div>
  );
}
