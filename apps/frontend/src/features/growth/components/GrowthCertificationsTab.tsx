import { useNavigate } from "react-router-dom";
import { BadgeCheck, ExternalLink } from "lucide-react";

import { EmptyState } from "@/shared/components/EmptyState";

import type { CertificationResponseDto } from "@/features/certifications/types/certification.types";

export function GrowthCertificationsTab({
  certifications,
}: {
  certifications: CertificationResponseDto[];
}) {
  const navigate = useNavigate();

  if (certifications.length === 0) {
    return (
      <EmptyState
        title="No certifications yet"
        description="Add certifications you've earned to build a fuller picture of your skills."
        actionLabel="Add a certification"
        onAction={() => navigate("/app/career/certifications")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-3"
        >
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">{cert.title}</p>
              <p className="font-body text-xs text-muted-foreground">
                {cert.issuer} · Issued {new Date(cert.issueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
