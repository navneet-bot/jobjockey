"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { platformSettingsSchema, PlatformSettingsFormValues } from "@/lib/validators";
import { updatePlatformSettings } from "@/actions/adminSettingsActions";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/ui/GradientButton";
import { ShieldCheck, Clock, Eye, Trash2, Save, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { CompanyRestrictionsForm } from "@/components/features/admin/CompanyRestrictionsForm";
import { AdminManagementForm } from "@/components/features/admin/AdminManagementForm";

type Company = { id: string; companyName: string | null };

interface SettingsFormProps {
  initialData: PlatformSettingsFormValues;
  companies: Company[];
}

export function SettingsForm({ initialData, companies }: SettingsFormProps) {
  const form = useForm<PlatformSettingsFormValues>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: initialData,
  });

  const { register, handleSubmit, formState: { isSubmitting, errors }, setValue, watch } = form;

  const onSubmit = async (data: PlatformSettingsFormValues) => {
    const result = await updatePlatformSettings(data);
    if (result.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const Toggle = ({ name, label }: { name: keyof PlatformSettingsFormValues; label: string }) => {
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
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            value ? "bg-[#111827] dark:bg-white" : "bg-black/20 dark:bg-white/10"
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

  const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-[#111827] dark:text-white">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold text-[var(--text-main)]">{title}</h3>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SECTION 1: Posting Limits */}
          <GlassCard className="p-8">
            <SectionTitle icon={ShieldCheck} title="Posting Limits" />
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Max Job Posts per Company</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("maxJobPostsPerCompany", { valueAsNumber: true })}
                  className="bg-background/50"
                />
                {errors.maxJobPostsPerCompany && <p className="text-xs text-destructive">{errors.maxJobPostsPerCompany.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Max Internship Posts per Company</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("maxInternshipPostsPerCompany", { valueAsNumber: true })}
                  className="bg-background/50"
                />
                {errors.maxInternshipPostsPerCompany && <p className="text-xs text-destructive">{errors.maxInternshipPostsPerCompany.message}</p>}
              </div>
            </div>
          </GlassCard>

          {/* SECTION 2: Expiry Configuration */}
          <GlassCard className="p-8">
            <SectionTitle icon={Clock} title="Expiry Configuration" />
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Default Job Expiry (Days)</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("jobDefaultExpiryDays", { valueAsNumber: true })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Internship Expiry (Days)</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("internshipDefaultExpiryDays", { valueAsNumber: true })}
                  className="bg-background/50"
                />
              </div>
              <Toggle name="allowCompaniesToChooseExpiry" label="Allow companies to choose expiry date" />
            </div>
          </GlassCard>

          {/* SECTION 3: Platform Visibility */}
          <GlassCard className="p-8">
            <SectionTitle icon={Eye} title="Platform Visibility" />
            <div className="space-y-4">
              <Toggle name="showCompaniesPublicly" label="Show Companies Publicly" />
              <Toggle name="showJobsPublicly" label="Show Job Listings" />
              <Toggle name="showInternshipsPublicly" label="Show Internship Listings" />
            </div>
          </GlassCard>

          {/* SECTION 4: Expired Post Handling */}
          <GlassCard className="p-8">
            <SectionTitle icon={Trash2} title="Expired Post Handling" />
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Control how the platform handles posts that have passed their expiry date.
              </p>
              <Toggle name="autoDeleteExpiredPosts" label="Automatically delete expired posts" />
            </div>
          </GlassCard>
        </div>

        <div className="flex justify-end pt-4">
          <GradientButton type="submit" disabled={isSubmitting} className="px-8">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Settings"}
          </GradientButton>
        </div>
      </form>

      {/* SECTION 5: Company Restrictions */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-[#111827] dark:text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Company Restrictions</h3>
            <p className="text-xs text-muted-foreground">Override global settings for a specific company. Blank fields fall back to global values.</p>
          </div>
        </div>
        <CompanyRestrictionsForm companies={companies} />
      </GlassCard>

      {/* SECTION 6: Admin Management */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-[#111827] dark:text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Admin Management</h3>
            <p className="text-xs text-muted-foreground">Assign and manage admin permissions for platform users using their Clerk user ID.</p>
          </div>
        </div>
        <AdminManagementForm />
      </GlassCard>
    </>
  );
}
