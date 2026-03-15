"use client";

import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { jobFormSchema, internshipFormSchema, JobFormValues, InternshipFormValues } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createJob, updateJob } from "@/actions/jobActions";
import { createInternship, updateInternship } from "@/actions/internshipActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Briefcase, GraduationCap, Clock, Building2, UserCheck, Calendar, Info, Layers, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PostJobFormProps {
  jobId?: string;
  initialData?: any; // Can be JobFormValues or InternshipFormValues
}

export default function PostJobForm({ jobId, initialData }: PostJobFormProps) {
  const router = useRouter();
  const isEditMode = !!jobId;

  const defaultValues = {
    title: "",
    jobType: "Full-time",
    jobCategory: "job",
    location: "",
    experienceLevel: "Entry Level",
    salary: "",
    stipend: "",
    duration: "",
    department: "",
    workMode: "Remote",
    responsibilities: "",
    requiredSkills: "",
    preferredSkills: "",
    minExperience: "",
    maxExperience: "",
    industryExperience: "",
    compensationType: "Fixed Salary",
    minEducation: "",
    certifications: "",
    toolsAndTechnologies: "",
    interviewRounds: "1",
    interviewMode: "Online",
    deadline: "",
    openPositions: "1",
    joiningDate: "",
    perksAndBenefits: "",
    specialInstructions: "",
    whatWillLearn: "",
    projectsAndTasks: "",
    educationLevel: "Undergraduate",
    eligibleCourses: "",
    mentorshipProvided: false,
    trainingProvided: false,
    certificateProvided: false,
    letterOfRecProvided: false,
    ppoPossibility: false,
    selectionProcess: "",
    description: "",
    applicationUrl: "",
  };

  // Merge initialData and sanitize null values to empty strings
  const mergedDefaultValues = { ...defaultValues };
  if (initialData) {
    Object.keys(initialData).forEach((key) => {
      const val = (initialData as any)[key];
      (mergedDefaultValues as any)[key] = val ?? (defaultValues as any)[key] ?? "";
    });
  }

  // We need to re-initialize form when category changes to use correct schema
  const [currentCategory, setCurrentCategory] = useState(initialData?.jobCategory || "job");

  const form = useForm<any>({
    resolver: zodResolver(currentCategory === "job" ? jobFormSchema : internshipFormSchema),
    defaultValues: mergedDefaultValues,
  });

  const watchedCategory = form.watch("jobCategory");

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: any) {
    try {
      let response;
      if (isEditMode) {
        response = data.jobCategory === "job" 
          ? await updateJob(jobId, data) 
          : await updateInternship(jobId, data);
      } else {
        response = data.jobCategory === "job" 
          ? await createJob(data) 
          : await createInternship(data);
      }

      if (response.success) {
        toast.success(
          isEditMode
            ? "Your post has been updated successfully!"
            : "Your post has been published successfully!"
        );
        router.push("/business/dashboard");
      } else {
        toast.error(response.error || "An error occurred.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon: any }) => (
    <div className="flex items-center gap-2 mb-6 mt-4">
      <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-[#111827] dark:text-[var(--primary)]">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)]">{children}</h3>
    </div>
  );

  return (
    <Card className="mb-12 border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden">
      <CardContent className="p-8">
        <form id="post-job-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* CATEGORY TOGGLE */}
          <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 w-max mx-auto mb-4">
            <button
              type="button"
              disabled={isEditMode}
              onClick={() => {
                setCurrentCategory("job");
                form.setValue("jobCategory", "job");
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                currentCategory === "job"
                  ? "bg-[#111827] text-white dark:bg-white dark:text-black shadow-lg"
                  : "text-[var(--text-dim)] hover:text-[var(--text-main)]",
                isEditMode && currentCategory !== "job" && "opacity-50 cursor-not-allowed"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Job
            </button>
            <button
              type="button"
              disabled={isEditMode}
              onClick={() => {
                setCurrentCategory("internship");
                form.setValue("jobCategory", "internship");
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                currentCategory === "internship"
                  ? "bg-[#111827] text-white dark:bg-white dark:text-black shadow-lg"
                  : "text-[var(--text-dim)] hover:text-[var(--text-main)]",
                isEditMode && currentCategory !== "internship" && "opacity-50 cursor-not-allowed"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              Internship
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-main)] to-[var(--text-dim)] bg-clip-text text-transparent">
              {watchedCategory === "job" ? "Job Posting Requirement Form" : "Internship Posting Requirement Form"}
            </h2>
          </div>

          {watchedCategory === "job" ? (
            /* ================= JOB FORM ================= */
            <div className="space-y-10 text-left">
              {/* Basic Job Information */}
              <section>
                <SectionTitle icon={Info}>Basic Job Information</SectionTitle>
                <FieldGroup>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Job Title</FieldLabel>
                        <Input {...field} placeholder="eg. Senior Frontend Engineer" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Controller
                      name="department"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Department / Domain</FieldLabel>
                          <Input {...field} placeholder="eg. Engineering, Marketing" />
                        </Field>
                      )}
                    />
                    <Controller
                      name="jobType"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Employment Type *</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    <Controller
                      name="workMode"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Work Mode *</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Remote">Remote</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="On-site">On-site</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    <Controller
                      name="location"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Job Location *</FieldLabel>
                          <Input {...field} placeholder="eg. Mumbai, Maharashtra" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="experienceLevel"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Experience Level *</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Entry Level">Entry Level</SelectItem>
                              <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Job Details */}
              <section>
                <SectionTitle icon={Layers}>Job Details</SectionTitle>
                <FieldGroup>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Job Description</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea {...field} placeholder="High level overview of the role..." rows={4} />
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="responsibilities"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Key Responsibilities</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea {...field} placeholder="List the primary duties..." rows={4} />
                        </InputGroup>
                      </Field>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                      name="requiredSkills"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Required Skills</FieldLabel>
                          <Input {...field} placeholder="eg. React, Node.js, TypeScript" />
                        </Field>
                      )}
                    />
                    <Controller
                      name="preferredSkills"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Preferred Skills (Optional)</FieldLabel>
                          <Input {...field} placeholder="eg. AWS, Docker, Next.js" />
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Experience & Salary */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <SectionTitle icon={Clock}>Experience Requirements</SectionTitle>
                    <FieldGroup>
                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          name="minExperience"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Min Exp (Years)</FieldLabel>
                              <Input {...field} type="number" min={0} placeholder="0" />
                            </Field>
                          )}
                        />
                        <Controller
                          name="maxExperience"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Max Exp (Years)</FieldLabel>
                              <Input {...field} type="number" min={0} placeholder="5" />
                            </Field>
                          )}
                        />
                      </div>
                      <Controller
                        name="industryExperience"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Relevant Industry Experience</FieldLabel>
                            <Input {...field} placeholder="eg. Fintech, E-commerce" />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                  <div>
                    <SectionTitle icon={Briefcase}>Salary Information</SectionTitle>
                    <FieldGroup>
                      <Controller
                        name="salary"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Salary Range (Min – Max)</FieldLabel>
                            <Input {...field} placeholder="eg. ₹10 LPA - ₹15 LPA" />
                          </Field>
                        )}
                      />
                      <Controller
                        name="compensationType"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Compensation Type</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fixed Salary">Fixed Salary</SelectItem>
                                <SelectItem value="Salary + Incentives">Salary + Incentives</SelectItem>
                                <SelectItem value="Negotiable">Negotiable</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                </div>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Candidate & Process */}
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                    <SectionTitle icon={UserCheck}>Candidate Requirements</SectionTitle>
                    <FieldGroup>
                      <Controller
                        name="minEducation"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Minimum Education</FieldLabel>
                            <Input {...field} placeholder="eg. B.Tech, MBA" />
                          </Field>
                        )}
                      />
                      <Controller
                        name="certifications"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Certifications Required (Optional)</FieldLabel>
                            <Input {...field} placeholder="eg. AWS Certified, PMP" />
                          </Field>
                        )}
                      />
                       <Controller
                        name="toolsAndTechnologies"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Tools / Technologies Required</FieldLabel>
                            <Input {...field} placeholder="eg. Jira, Figma, Git" />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                  <div>
                    <SectionTitle icon={Calendar}>Hiring Process</SectionTitle>
                    <FieldGroup>
                       <div className="grid grid-cols-2 gap-4">
                        <Controller
                          name="interviewRounds"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>No. of Rounds</FieldLabel>
                              <Input {...field} type="number" min={0} />
                            </Field>
                          )}
                        />
                        <Controller
                          name="interviewMode"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Interview Mode</FieldLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Online">Online</SelectItem>
                                  <SelectItem value="In-person">In-person</SelectItem>
                                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                                </SelectContent>
                              </Select>
                            </Field>
                          )}
                        />
                      </div>
                      <Controller
                        name="deadline"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Application Deadline</FieldLabel>
                            <Input {...field} type="date" />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                </div>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Application Details */}
              <section>
                 <SectionTitle icon={Calendar}>Application Details & Additional Info</SectionTitle>
                 <FieldGroup>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="openPositions"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Number of Open Positions</FieldLabel>
                            <Input {...field} type="number" min={0} />
                          </Field>
                        )}
                      />
                      <Controller
                        name="joiningDate"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Expected Joining Date</FieldLabel>
                            <Input {...field} placeholder="eg. Immediate, Oct 2026" />
                          </Field>
                        )}
                      />
                   </div>
                   <Controller
                    name="applicationUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Application URL</FieldLabel>
                        <Input {...field} placeholder="https://example.com/apply" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="perksAndBenefits"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Perks & Benefits</FieldLabel>
                            <InputGroup>
                              <InputGroupTextarea {...field} placeholder="eg. Health Insurance, Remote Work..." rows={3} />
                            </InputGroup>
                          </Field>
                        )}
                      />
                      <Controller
                        name="specialInstructions"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Special Instructions</FieldLabel>
                            <InputGroup>
                              <InputGroupTextarea {...field} placeholder="Any specific requirements for candidates..." rows={3} />
                            </InputGroup>
                          </Field>
                        )}
                      />
                   </div>
                 </FieldGroup>
              </section>
            </div>
          ) : (
            /* ================= INTERNSHIP FORM ================= */
            <div className="space-y-10 text-left">
              {/* Internship Basics */}
              <section>
                <SectionTitle icon={Info}>Internship Basics</SectionTitle>
                <FieldGroup>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Internship Title</FieldLabel>
                        <Input {...field} placeholder="eg. Product Design Intern" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Controller
                      name="department"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Internship Domain</FieldLabel>
                          <Input {...field} placeholder="eg. UI/UX, Backend" />
                        </Field>
                      )}
                    />
                    <Controller
                      name="compensationType"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Internship Type</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Unpaid">Unpaid</SelectItem>
                              <SelectItem value="Stipend Based">Stipend Based</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    <Controller
                      name="duration"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Internship Duration</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 Month">1 Month</SelectItem>
                              <SelectItem value="3 Months">3 Months</SelectItem>
                              <SelectItem value="6 Months">6 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Controller
                      name="location"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Internship Location *</FieldLabel>
                          <Input {...field} placeholder="eg. Remote, Bangalore" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="joiningDate"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Start Date</FieldLabel>
                          <Input {...field} placeholder="eg. Immediate, May 15th" />
                        </Field>
                      )}
                    />
                    <Controller
                      name="workMode"
                      control={form.control}
                      render={({ field }) => (
                        <Field>
                          <FieldLabel>Work Mode</FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Remote">Remote</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="On-site">On-site</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                  </div>
                </FieldGroup>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Internship Description */}
              <section>
                <SectionTitle icon={Layers}>Internship Description</SectionTitle>
                <FieldGroup>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Internship Overview</FieldLabel>
                        <InputGroup>
                           <InputGroupTextarea {...field} placeholder="A brief description of the role..." rows={3} />
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Controller
                        name="whatWillLearn"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>What Interns Will Learn</FieldLabel>
                            <InputGroup>
                              <InputGroupTextarea {...field} placeholder="Key outcomes and learnings..." rows={3} />
                            </InputGroup>
                          </Field>
                        )}
                      />
                      <Controller
                        name="projectsAndTasks"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Project / Tasks Intern Will Work On</FieldLabel>
                            <InputGroup>
                              <InputGroupTextarea {...field} placeholder="Describe specific projects..." rows={3} />
                            </InputGroup>
                          </Field>
                        )}
                      />
                   </div>
                </FieldGroup>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Skills & Eligibility */}
              <section>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                    <SectionTitle icon={Wrench}>Skills Requirement</SectionTitle>
                    <FieldGroup>
                      <Controller
                        name="requiredSkills"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Required Skills</FieldLabel>
                            <Input {...field} placeholder="eg. Figma, Canva, Adobe Suite" />
                          </Field>
                        )}
                      />
                      <Controller
                        name="toolsAndTechnologies"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Tools / Software Intern Should Know</FieldLabel>
                            <Input {...field} placeholder="eg. Slack, Notion, Zoom" />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                  <div>
                    <SectionTitle icon={UserCheck}>Candidate Eligibility</SectionTitle>
                    <FieldGroup>
                      <Controller
                        name="educationLevel"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Current Education Level</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                                <SelectItem value="Final Year Students">Final Year Students</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                      <Controller
                        name="eligibleCourses"
                        control={form.control}
                        render={({ field }) => (
                          <Field>
                            <FieldLabel>Eligible Courses / Fields</FieldLabel>
                            <Input {...field} placeholder="eg. B.Sc, B.E, B.Com" />
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </div>
                 </div>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Mentorship & Benefits */}
              <section>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                    <SectionTitle icon={Building2}>Learning & Mentorship</SectionTitle>
                    <FieldGroup>
                       <div className="flex flex-col gap-4 mt-2">
                        <Controller
                          name="mentorshipProvided"
                          control={form.control}
                          render={({ field }) => (
                            <div className="flex items-center gap-3">
                               <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5 rounded accent-[var(--primary)]" />
                               <span className="text-sm font-medium">Will Mentorship Be Provided?</span>
                            </div>
                          )}
                        />
                         <Controller
                          name="trainingProvided"
                          control={form.control}
                          render={({ field }) => (
                            <div className="flex items-center gap-3">
                               <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5 rounded accent-[var(--primary)]" />
                               <span className="text-sm font-medium">Training Provided?</span>
                            </div>
                          )}
                        />
                       </div>
                    </FieldGroup>
                  </div>
                  <div>
                    <SectionTitle icon={Briefcase}>Internship Benefits</SectionTitle>
                    <FieldGroup>
                       <div className="grid grid-cols-1 gap-4 mb-4">
                          <Controller
                            name="stipend"
                            control={form.control}
                            render={({ field }) => (
                              <Field className="flex-1">
                                <FieldLabel>Stipend Amount (if paid)</FieldLabel>
                                <Input {...field} placeholder="eg. ₹5000/month" />
                              </Field>
                            )}
                          />
                       </div>
                       <div className="grid grid-cols-1 gap-3">
                          {[
                            { name: "certificateProvided", label: "Certificate Provided" },
                            { name: "letterOfRecProvided", label: "Letter of Recommendation" },
                            { name: "ppoPossibility", label: "Possibility of Full-Time Offer (PPO)" },
                          ].map((item) => (
                            <Controller
                              key={item.name}
                              name={item.name}
                              control={form.control}
                              render={({ field }) => (
                                <div className="flex items-center gap-3">
                                   <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5 rounded accent-[var(--primary)]" />
                                   <span className="text-sm font-medium">{item.label}</span>
                                </div>
                              )}
                            />
                          ))}
                       </div>
                    </FieldGroup>
                  </div>
                 </div>
              </section>

              <Separator className="bg-[var(--glass-border)]" />

              {/* Selection Process & Slots */}
              <section>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <SectionTitle icon={UserCheck}>Selection Process</SectionTitle>
                      <FieldGroup>
                        <Controller
                          name="selectionProcess"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Selection Steps</FieldLabel>
                              <Input {...field} placeholder="eg. Screening, Assignment, Interview" />
                              <p className="text-xs text-[var(--text-dim)] mt-2 italic">Briefly describe how you will select the candidate.</p>
                            </Field>
                          )}
                        />
                      </FieldGroup>
                    </div>
                    <div>
                      <SectionTitle icon={Briefcase}>Slots & Deadline</SectionTitle>
                      <FieldGroup>
                         <div className="grid grid-cols-1 gap-6">
                            <Controller
                              name="openPositions"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Number of Interns Required</FieldLabel>
                                  <Input {...field} type="number" min={0} />
                                </Field>
                              )}
                            />
                            <Controller
                              name="deadline"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Application Deadline</FieldLabel>
                                  <Input {...field} type="date" />
                                </Field>
                              )}
                            />
                            <Controller
                              name="applicationUrl"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>Application URL</FieldLabel>
                                  <Input {...field} placeholder="https://example.com/apply" />
                                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                              )}
                            />
                         </div>
                      </FieldGroup>
                    </div>
                 </div>
              </section>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="p-8 pt-0 flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          onClick={() => isEditMode ? router.push("/business/dashboard") : form.reset()}
          className="rounded-xl border-[var(--glass-border)] text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
        >
          {isEditMode ? "Cancel Changes" : "Reset Form"}
        </Button>
        <Button 
          disabled={isSubmitting} 
          type="submit" 
          form="post-job-form"
          size="lg"
          className="rounded-xl bg-[#111827] dark:bg-white text-white dark:text-black font-bold hover:scale-[1.02] transition-all px-10 hover:bg-[#111827]/90 dark:hover:bg-white/90"
        >
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Publishing..."
            : isEditMode
              ? "Save Changes"
              : "Post Requirement"}
        </Button>
      </CardFooter>
    </Card>
  );
}
