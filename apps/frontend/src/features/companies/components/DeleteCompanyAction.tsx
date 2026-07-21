import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteCompany } from "@/features/companies/hooks/useDeleteCompany";
import type { CompanyResponseDto } from "@/features/companies/types/company.types";

export function DeleteCompanyAction({ company }: { company: CompanyResponseDto }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteCompany();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this company?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(company.id, {
            onSuccess: () => {
              toast({ title: "Company deleted" });
              navigate("/app/placements/companies");
            },
          })
        }
      />
    </>
  );
}
