"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { companyEnquirySchema, CompanyEnquiryFormValues } from "@/lib/validators";
import { submitCompanyEnquiry } from "@/actions/enquiryActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm as useReactHookForm } from "react-hook-form";

export default function EnquiryPage() {
    const router = useRouter();
    const form = useReactHookForm<CompanyEnquiryFormValues>({
        resolver: zodResolver(companyEnquirySchema),
        defaultValues: {
            companyName: "",
            email: "",
            phone: "",
            companyUrl: "",
            companySize: "",
            gstNumber: "",
        },
    });

    const onSubmit = async (data: CompanyEnquiryFormValues) => {
        const res = await submitCompanyEnquiry(data);
        if (res.success) {
            toast.success("Enquiry submitted successfully! Awaiting admin approval.");
            router.push("/");
        } else {
            toast.error(res.error || "Failed to submit enquiry.");
        }
    };

    return (
        <div className="flex flex-col gap-10 pb-20 items-center justify-center min-h-[80vh]">
            <GradientHeader
                title="Partner With Us"
                subtitle="Submit your company details for verification to start posting jobs."
                badge="Company Verification"
            />

            <GlassCard className="w-full max-w-2xl p-8 md:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company Name *</label>
                            <NeonInput {...form.register("companyName")} placeholder="Acme Corp" />
                            {form.formState.errors.companyName && (
                                <span className="text-xs text-red-400">{form.formState.errors.companyName.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Work Email *</label>
                            <NeonInput {...form.register("email")} type="email" placeholder="hr@acme.com" />
                            {form.formState.errors.email && (
                                <span className="text-xs text-red-400">{form.formState.errors.email.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Phone Number *</label>
                            <NeonInput {...form.register("phone")} placeholder="+91 98765 43210" />
                            {form.formState.errors.phone && (
                                <span className="text-xs text-red-400">{form.formState.errors.phone.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company URL</label>
                            <NeonInput {...form.register("companyUrl")} placeholder="https://acme.com" />
                            {form.formState.errors.companyUrl && (
                                <span className="text-xs text-red-400">{form.formState.errors.companyUrl.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company Size *</label>
                            <select
                                {...form.register("companySize")}
                                className="flex h-12 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            >
                                <option value="" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">Select Size</option>
                                <option value="1-10" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">1-10 employees</option>
                                <option value="11-50" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">11-50 employees</option>
                                <option value="51-200" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">51-200 employees</option>
                                <option value="201-500" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">201-500 employees</option>
                                <option value="500+" className="bg-white dark:bg-[#0A0F1F] text-[var(--text-main)]">500+ employees</option>
                            </select>
                            {form.formState.errors.companySize && (
                                <span className="text-xs text-red-400">{form.formState.errors.companySize.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">GST Number (Optional)</label>
                            <NeonInput {...form.register("gstNumber")} placeholder="22AAAAA0000A1Z5" />
                        </div>
                    </div>

                    <GradientButton
                        type="submit"
                        className="w-full mt-4"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Verification Request"}
                    </GradientButton>
                </form>
            </GlassCard>
        </div>
    );
}
