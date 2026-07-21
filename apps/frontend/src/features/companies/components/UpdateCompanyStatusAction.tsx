import { PowerOff, Power } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { CompanyStatus } from "@/types/enums";

import { useUpdateCompanyStatus } from "@/features/companies/hooks/useUpdateCompanyStatus";
import type { CompanyResponseDto } from "@/features/companies/types/company.types";

export function UpdateCompanyStatusAction({ company }: { company: CompanyResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateCompanyStatus(company.id);

  const isActive = company.status === CompanyStatus.ACTIVE;
  const nextStatus = isActive ? CompanyStatus.INACTIVE : CompanyStatus.ACTIVE;

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        mutate(
          { status: nextStatus },
          { onSuccess: () => toast({ title: `Company marked ${nextStatus.toLowerCase()}` }) },
        )
      }
    >
      {isActive ? (
        <PowerOff className="mr-2 h-4 w-4" aria-hidden="true" />
      ) : (
        <Power className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      {isPending ? "Updating…" : isActive ? "Mark Inactive" : "Mark Active"}
    </Button>
  );
}
