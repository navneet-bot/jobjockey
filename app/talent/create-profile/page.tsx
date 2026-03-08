"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, UserProfileFormValues } from "@/lib/validators";
import { upsertUserProfile } from "@/actions/userActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm as useReactHookForm } from "react-hook-form";
import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";

export default function TalentProfileCreatePage() {
    const router = useRouter();
    const [resumeUrl, setResumeUrl] = useState<string>("");
    
    const form = useReactHookForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            education: "",
            skills: "",
            experience: "",
            preferredDomain: "",
            preferredJobType: "",
            portfolioUrl: "",
            linkedin: "",
            github: "",
        },
    });

    const onSubmit = async (data: UserProfileFormValues) => {
        if (!resumeUrl) {
            toast.error("Please upload your resume to continue.");
            return;
        }

        const finalData = { ...data, resumeUrl: resumeUrl };
        const res = await upsertUserProfile(finalData);
        if (res.success) {
            toast.success("Profile created successfully!");
            router.push("/talent/dashboard");
        } else {
            toast.error(res.error || "Failed to create profile.");
        }
    };

    return (
        <div className="flex flex-col gap-10 py-20 px-4 items-center justify-center min-h-[80vh]">
            <GradientHeader
                title="Create Talent Profile"
                subtitle="Showcase your skills and unlock opportunities."
                badge="For Talent"
            />

            <GlassCard className="w-full max-w-7xl p-8 md:p-10 border border-[#9ca3af]/50 dark:border-white/20 shadow-xl">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Full Name *</label>
                            <NeonInput {...form.register("name")} placeholder="Aditya Varma" />
                            {form.formState.errors.name && (
                                <span className="text-xs text-red-500">{form.formState.errors.name.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Email *</label>
                            <NeonInput {...form.register("email")} type="email" placeholder="aditya@example.com" />
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
                            <label className="text-sm font-medium text-[var(--text-main)]">Education *</label>
                            <NeonInput {...form.register("education")} placeholder="B.Sc in Computer Science" />
                            {form.formState.errors.education && (
                                <span className="text-xs text-red-500">{form.formState.errors.education.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Experience *</label>
                            <NeonInput {...form.register("experience")} placeholder="2 years in Web Dev" />
                            {form.formState.errors.experience && (
                                <span className="text-xs text-red-500">{form.formState.errors.experience.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Preferred Domain *</label>
                            <NeonInput {...form.register("preferredDomain")} placeholder="Frontend, Backend, AI..." />
                            {form.formState.errors.preferredDomain && (
                                <span className="text-xs text-red-500">{form.formState.errors.preferredDomain.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Preferred Job Type *</label>
                            <select
                                {...form.register("preferredJobType")}
                                className="flex h-12 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#111827] dark:focus:ring-white"
                            >
                                <option value="" className="bg-white dark:bg-[#0A0F1F]">Select Job Type</option>
                                <option value="Internship" className="bg-white dark:bg-[#0A0F1F]">Internship</option>
                                <option value="Full Time" className="bg-white dark:bg-[#0A0F1F]">Full Time</option>
                            </select>
                            {form.formState.errors.preferredJobType && (
                                <span className="text-xs text-red-500">{form.formState.errors.preferredJobType.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Upload Resume (PDF) *</label>
                            {resumeUrl ? (
                                <div className="flex items-center justify-between p-3 border border-green-500/30 bg-green-500/10 rounded-xl">
                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Resume uploaded successfully!</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setResumeUrl("")} 
                                        className="text-xs text-[var(--text-dim)] hover:text-[var(--text-main)] underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-dashed border-[var(--glass-border)] rounded-xl py-2 px-4 bg-[var(--glass-bg)] flex justify-center items-center h-[50px]">
                                    <UploadButton
                                        endpoint="resumeUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setResumeUrl(res[0].url);
                                                toast.success("Resume uploaded successfully!");
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast.error(`Upload failed: ${error.message}`);
                                        }}
                                        appearance={{
                                            button: "bg-[#111827] dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-medium text-sm rounded-full px-6 h-8",
                                            allowedContent: "hidden"
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">LinkedIn Profile</label>
                            <NeonInput {...form.register("linkedin")} placeholder="https://linkedin.com/in/adityavarma" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">Portfolio Link</label>
                            <NeonInput {...form.register("portfolioUrl")} placeholder="https://adityavarma.com" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[var(--text-main)]">GitHub Profile</label>
                            <NeonInput {...form.register("github")} placeholder="https://github.com/adityavarma" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-main)]">Skills *</label>
                        <textarea
                            {...form.register("skills")}
                            placeholder="React, Node.js, Design Systems, etc."
                            className="flex min-h-[100px] w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#111827] dark:focus:ring-white"
                        />
                        {form.formState.errors.skills && (
                            <span className="text-xs text-red-500">{form.formState.errors.skills.message}</span>
                        )}
                    </div>

                    <GradientButton
                        type="submit"
                        className="w-full md:w-auto self-center px-10 mt-4 py-4 text-base !bg-[#111827] dark:!bg-white !text-white dark:!text-black"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Create Profile"}
                    </GradientButton>
                </form>
            </GlassCard>
        </div>
    );
}
