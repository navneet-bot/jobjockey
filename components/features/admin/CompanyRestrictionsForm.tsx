"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySettingsSchema, CompanySettingsFormValues } from "@/lib/validators";
import { getCompanySettings, upsertCompanySettings } from "@/actions/companySettingsActions";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/ui/GradientButton";
import { Building2, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Company = { id: string; companyName: string | null };

interface CompanyRestrictionsFormProps {
  companies: Company[];
  /** If provided, the form is locked to this specific company (used inside the modal). */
  lockedCompanyId?: string;
}

export function CompanyRestrictionsForm({ companies, lockedCompanyId }: CompanyRestrictionsFormProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(lockedCompanyId ?? "");
  const [loadingSettings, setLoadingSettings] = useState(false);

  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyId: lockedCompanyId ?? "",
      disableJobPosting: false,
      disableInternshipPosting: false,
      hideCompany: false,
      allowCustomExpiry: false,
      unlimitedPosting: false,
    },
  });

  const { register, handleSubmit, formState: { isSubmitting, errors }, setValue, watch, reset } = form;

  // When a company is selected (or locked), load its existing settings
  useEffect(() => {
    if (!selectedCompanyId) return;
    setLoadingSettings(true);
    getCompanySettings(selectedCompanyId).then((settings) => {
      reset({
        companyId: selectedCompanyId,
        maxJobPosts: settings?.maxJobPosts ?? undefined,
        maxInternshipPosts: settings?.maxInternshipPosts ?? undefined,
        jobExpiryDays: settings?.jobExpiryDays ?? undefined,
        internshipExpiryDays: settings?.internshipExpiryDays ?? undefined,
        disableJobPosting: settings?.disableJobPosting ?? false,
        disableInternshipPosting: settings?.disableInternshipPosting ?? false,
        hideCompany: settings?.hideCompany ?? false,
        allowCustomExpiry: settings?.allowCustomExpiry ?? false,
        unlimitedPosting: settings?.unlimitedPosting ?? false,
      });
      setLoadingSettings(false);
    });
  }, [selectedCompanyId, reset]);

  const onSubmit = async (data: CompanySettingsFormValues) => {
    const result = await upsertCompanySettings(data);
    if (result.success) {
      toast.success("Company restrictions saved.");
    } else {
      toast.error(result.error || "Failed to save restrictions.");
    }
  };

  const Toggle = ({
    name,
    label,
  }: {
    name: keyof CompanySettingsFormValues;
    label: string;
  }) => {
    const value = watch(name) as boolean;
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
        <Label className="text-sm font-medium cursor-pointer" onClick={() => setValue(name, !value as any)}>
          {label}
        </Label>
        <button
          type="button"
          onClick={() => setValue(name, !value as any)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value ? "bg-[#111827] dark:bg-white" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              value ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Selector (hidden when locked) */}
      {!lockedCompanyId && (
        <div className="space-y-2">
          <Label>Select Company</Label>
          <select
            className="w-full h-10 px-3 rounded-xl bg-background/50 border border-black/10 dark:border-white/10 text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={selectedCompanyId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedCompanyId(id);
              setValue("companyId", id);
            }}
          >
            <option value="">— Select a company —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName ?? c.id}
              </option>
            ))}
          </select>
          {errors.companyId && <p className="text-xs text-destructive">{errors.companyId.message}</p>}
        </div>
      )}

      {loadingSettings && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading company settings…
        </div>
      )}

      {(selectedCompanyId || lockedCompanyId) && !loadingSettings && (
        <>
          {/* Posting Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Job Posts <span className="text-muted-foreground text-xs">(blank = use global)</span></Label>
              <Input
                type="number"
                placeholder="Global default"
                {...register("maxJobPosts", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Internship Posts <span className="text-muted-foreground text-xs">(blank = use global)</span></Label>
              <Input
                type="number"
                placeholder="Global default"
                {...register("maxInternshipPosts", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Job Expiry Days <span className="text-muted-foreground text-xs">(blank = use global)</span></Label>
              <Input
                type="number"
                placeholder="Global default"
                {...register("jobExpiryDays", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Internship Expiry Days <span className="text-muted-foreground text-xs">(blank = use global)</span></Label>
              <Input
                type="number"
                placeholder="Global default"
                {...register("internshipExpiryDays", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Restriction Toggles */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Restrictions</p>
            <Toggle name="disableJobPosting" label="Disable Job Posting" />
            <Toggle name="disableInternshipPosting" label="Disable Internship Posting" />
            <Toggle name="hideCompany" label="Hide Company From Platform" />
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permissions</p>
            <Toggle name="allowCustomExpiry" label="Allow company to set custom expiry date" />
            <Toggle name="unlimitedPosting" label="Allow unlimited job & internship postings" />
          </div>

          <div className="flex justify-end pt-2">
            <GradientButton type="submit" disabled={isSubmitting} className="px-8">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving…" : "Save Restrictions"}
            </GradientButton>
          </div>
        </>
      )}
    </form>
  );
}
