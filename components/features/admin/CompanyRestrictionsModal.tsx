"use client";

import { GlassModal, GlassModalContent, GlassModalHeader, GlassModalTitle, GlassModalDescription } from "@/components/ui/GlassModal";
import { CompanyRestrictionsForm } from "./CompanyRestrictionsForm";

interface CompanyRestrictionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: { id: string; companyName: string | null };
}

export function CompanyRestrictionsModal({ open, onOpenChange, company }: CompanyRestrictionsModalProps) {
  return (
    <GlassModal open={open} onOpenChange={onOpenChange}>
      <GlassModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <GlassModalHeader>
          <GlassModalTitle>Manage Restrictions</GlassModalTitle>
          <GlassModalDescription>
            Configure posting restrictions and permissions for{" "}
            <span className="font-semibold text-[var(--text-main)]">{company.companyName ?? company.id}</span>.
            Blank numeric fields fall back to global platform settings.
          </GlassModalDescription>
        </GlassModalHeader>
        <div className="mt-6">
          <CompanyRestrictionsForm
            companies={[company]}
            lockedCompanyId={company.id}
          />
        </div>
      </GlassModalContent>
    </GlassModal>
  );
}
