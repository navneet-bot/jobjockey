"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, UserProfileFormValues } from "@/lib/validators";
import { upsertUserProfile, getUserProfile } from "@/actions/userActions";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonInput } from "@/components/ui/NeonInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { GradientHeader } from "@/components/ui/GradientHeader";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";

export default function ProfilePage() {
    const [resumeUrl, setResumeUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<UserProfileFormValues>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            linkedin: "",
            github: "",
        },
    });

    useEffect(() => {
        async function loadData() {
            const p = await getUserProfile();
            if (p) {
                form.reset({
                    name: p.name,
                    phone: p.phone,
                    email: p.email,
                    linkedin: p.linkedin || "",
                    github: p.github || "",
                });
                if (p.resumeUrl) setResumeUrl(p.resumeUrl);
            }
            setIsLoading(false);
        }
        loadData();
    }, [form]);

    const onSubmit = async (data: UserProfileFormValues) => {
        const payload = { ...data, resumeUrl };
        const res = await upsertUserProfile(payload);
        if (res.success) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error(res.error || "Failed to update profile.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-20 items-center min-h-[80vh]">
            <GradientHeader
                title="Your Profile"
                subtitle="Manage your personal information and resume."
                badge="Candidate Settings"
            />

            <div className="w-full max-w-3xl flex flex-col gap-8">

                {/* Upload Resume Section */}
                <GlassCard className="p-8">
                    <h3 className="text-xl font-bold text-white mb-2">Resume Upload</h3>
                    <p className="text-muted-foreground text-sm mb-6">Upload your latest PDF resume to use for applications.</p>

                    {resumeUrl ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
                                <div className="flex-1 truncate text-sm text-[var(--primary)]">
                                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="hover:underline text-[var(--primary)]">
                                        View Current Resume
                                    </a>
                                </div>
                                <GradientButton variant="outline" className="px-4 py-1.5 h-auto text-xs" onClick={() => setResumeUrl("")}>
                                    Remove
                                </GradientButton>
                            </div>
                        </div>
                    ) : (
                        <UploadDropzone
                            endpoint="resumeUploader"
                            onClientUploadComplete={(res) => {
                                setResumeUrl(res?.[0]?.url || "");
                                toast.success("Resume uploaded successfully!");
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                            className="border border-dashed border-[var(--glass-border)] ut-label:text-[var(--primary)] ut-button:bg-[var(--primary)] ut-button:text-black"
                        />
                    )}
                </GlassCard>

                {/* Details Form */}
                <GlassCard className="p-8">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Full Name *</label>
                                <NeonInput {...form.register("name")} placeholder="John Doe" />
                                {form.formState.errors.name && <span className="text-xs text-red-400">{form.formState.errors.name.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Email Address *</label>
                                <NeonInput {...form.register("email")} type="email" placeholder="john@example.com" />
                                {form.formState.errors.email && <span className="text-xs text-red-400">{form.formState.errors.email.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">Phone Number *</label>
                                <NeonInput {...form.register("phone")} placeholder="+91 98765 43210" />
                                {form.formState.errors.phone && <span className="text-xs text-red-400">{form.formState.errors.phone.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-white">LinkedIn URL</label>
                                <NeonInput {...form.register("linkedin")} placeholder="https://linkedin.com/in/johndoe" />
                                {form.formState.errors.linkedin && <span className="text-xs text-red-400">{form.formState.errors.linkedin.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-white">GitHub URL</label>
                                <NeonInput {...form.register("github")} placeholder="https://github.com/johndoe" />
                                {form.formState.errors.github && <span className="text-xs text-red-400">{form.formState.errors.github.message}</span>}
                            </div>

                        </div>

                        <GradientButton
                            type="submit"
                            className="w-full mt-4"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Saving..." : "Save Profile Details"}
                        </GradientButton>
                    </form>
                </GlassCard>

            </div>
        </div>
    );
}
