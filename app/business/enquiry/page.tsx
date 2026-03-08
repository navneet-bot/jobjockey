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
import { useForm as useReactHookForm, Controller } from "react-hook-form";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

export default function BusinessEnquiryPage() {
    const router = useRouter();
    const form = useReactHookForm<CompanyEnquiryFormValues>({
        resolver: zodResolver(companyEnquirySchema),
        defaultValues: {
            companyName: "",
            industry: "",
            contactPerson: "",
            designation: "",
            email: "",
            phone: "",
            companyUrl: "",
            companySize: "",
            hiringNeeds: "",
            message: "",
            gstNumber: "",
        },
    });

    const onSubmit = async (data: CompanyEnquiryFormValues) => {
        const res = await submitCompanyEnquiry(data);
        if (res.success) {
            toast.success("Enquiry submitted successfully! Our team will contact you shortly.");
            router.push("/");
        } else {
            toast.error(res.error || "Failed to submit enquiry.");
        }
    };

    return (
        <div className="flex flex-col gap-10 py-20 px-4 items-center justify-center min-h-[80vh]">
            <GradientHeader
                title="Join Our Hiring Network"
                subtitle="Partner with us to build your high-performance team."
                badge="For Businesses"
            />

            <GlassCard className="w-full max-w-6xl p-8 md:p-10 border border-[var(--primary)]/20 shadow-[0_0_40px_rgba(var(--primary-rgb),0.05)]">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company Name *</label>
                            <NeonInput {...form.register("companyName")} placeholder="Acme Corp" />
                            {form.formState.errors.companyName && (
                                <span className="text-xs text-red-500">{form.formState.errors.companyName.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Industry *</label>
                            <NeonInput {...form.register("industry")} placeholder="Technology, Finance, etc." />
                            {form.formState.errors.industry && (
                                <span className="text-xs text-red-500">{form.formState.errors.industry.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Contact Person *</label>
                            <NeonInput {...form.register("contactPerson")} placeholder="Aditya Varma" />
                            {form.formState.errors.contactPerson && (
                                <span className="text-xs text-red-500">{form.formState.errors.contactPerson.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Contact Person Designation *</label>
                            <NeonInput {...form.register("designation")} placeholder="HR Manager / Director" />
                            {form.formState.errors.designation && (
                                <span className="text-xs text-red-500">{form.formState.errors.designation.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Work Email *</label>
                            <NeonInput {...form.register("email")} type="email" placeholder="aditya@acmecorp.com" />
                            {form.formState.errors.email && (
                                <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Phone Number *</label>
                            <NeonInput {...form.register("phone")} placeholder="+91 98765 43210" />
                            {form.formState.errors.phone && (
                                <span className="text-xs text-red-500">{form.formState.errors.phone.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company Website (URL)</label>
                            <NeonInput {...form.register("companyUrl")} placeholder="https://acmecorp.com" />
                            {form.formState.errors.companyUrl && (
                                <span className="text-xs text-red-500">{form.formState.errors.companyUrl.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Company Size *</label>
                            <Controller
                                name="companySize"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full h-12 bg-[var(--glass-bg)] border-[var(--glass-border)] rounded-xl text-left">
                                            <SelectValue placeholder="Select Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="500+">500+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.companySize && (
                                <span className="text-xs text-red-500">{form.formState.errors.companySize.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">GST Number (Optional)</label>
                            <NeonInput {...form.register("gstNumber")} placeholder="Optional GST ID" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Hire Status *</label>
                            <Controller
                                name="hiringNeeds"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full h-12 bg-[var(--glass-bg)] border-[var(--glass-border)] rounded-xl text-left">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Actively Hiring">Actively Hiring</SelectItem>
                                            <SelectItem value="Occasionally Hiring">Occasionally Hiring</SelectItem>
                                            <SelectItem value="Not Hiring">Not Hiring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {form.formState.errors.hiringNeeds && (
                                <span className="text-xs text-red-500">{form.formState.errors.hiringNeeds.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-main)]">Message (Optional)</label>
                        <textarea
                            {...form.register("message")}
                            placeholder="Any other details?"
                            className="flex min-h-[100px] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    <GradientButton
                        type="submit"
                        className="w-full md:w-auto self-center px-10 mt-4 py-4 text-base"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Enquiry"}
                    </GradientButton>
                </form>
            </GlassCard>
        </div>
    );
}
