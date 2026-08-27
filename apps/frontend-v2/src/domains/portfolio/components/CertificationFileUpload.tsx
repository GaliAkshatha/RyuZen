import { useRef } from "react";
import { Paperclip, FileCheck } from "lucide-react";

import { useUploadCertificationFile } from "@/domains/portfolio/hooks/usePortfolioMutations";

/**
 * The real "upload the file" UI - a plain file input styled as a
 * button, since certification.fileUrl and the real
 * POST /certifications/:id/file endpoint existed on the backend with
 * no frontend at all before this. Accepts PDF/image, matching
 * certificationFileUpload's real backend MIME filter exactly.
 */
export function CertificationFileUpload({ certificationId, hasFile }: { certificationId: string; hasFile: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadCertificationFile();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    upload({ certificationId, file });
    e.target.value = "";
  }

  return (
    <>
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileChange} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
      >
        {hasFile ? <FileCheck className="h-3 w-3" aria-hidden="true" /> : <Paperclip className="h-3 w-3" aria-hidden="true" />}
        {isPending ? "Uploading…" : hasFile ? "Replace file" : "Attach file"}
      </button>
    </>
  );
}
