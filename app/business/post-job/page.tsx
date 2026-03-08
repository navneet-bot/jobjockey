import PostJobForm from "@/components/features/job/PostJobForm";
import Container from "@/components/ui/Container";
import { getSingleJob } from "@/actions/jobActions";

interface PostJobPageProps {
  searchParams: Promise<{ jobId?: string }>;
}

export default async function PostJobPage({ searchParams }: PostJobPageProps) {
  const params = await searchParams;
  const jobId = params.jobId;
  let initialData = undefined;

  if (jobId) {
    const job = await getSingleJob(jobId);
    if (job) {
      initialData = {
        title: job.title,
        jobType: ((job.jobType as string) === "Internship" ? "Full-time" : job.jobType) as "Full-time" | "Part-time" | "Contract",
        jobCategory: (job.jobCategory || "job") as "job" | "internship" | "training",
        location: job.location,
        experienceLevel: job.experienceLevel as "Entry Level" | "Mid-Level" | "Senior" | "Manager",
        salary: job.salary || "",
        duration: job.duration || "",
        department: job.department || "",
        workMode: job.workMode || "Remote",
        responsibilities: job.responsibilities || "",
        requiredSkills: job.requiredSkills || "",
        preferredSkills: job.preferredSkills || "",
        minExperience: job.minExperience || "",
        maxExperience: job.maxExperience || "",
        industryExperience: job.industryExperience || "",
        compensationType: job.compensationType || "",
        minEducation: job.minEducation || "",
        certifications: job.certifications || "",
        toolsAndTechnologies: job.toolsAndTechnologies || "",
        interviewRounds: job.interviewRounds || "",
        interviewMode: job.interviewMode || "Online",
        deadline: job.deadline || "",
        openPositions: job.openPositions || "",
        joiningDate: job.joiningDate || "",
        perksAndBenefits: job.perksAndBenefits || "",
        specialInstructions: job.specialInstructions || "",
        whatWillLearn: job.whatWillLearn || "",
        projectsAndTasks: job.projectsAndTasks || "",
        educationLevel: job.educationLevel || "",
        eligibleCourses: job.eligibleCourses || "",
        mentorshipProvided: job.mentorshipProvided || false,
        trainingProvided: job.trainingProvided || false,
        certificateProvided: job.certificateProvided || false,
        letterOfRecProvided: job.letterOfRecProvided || false,
        ppoPossibility: job.ppoPossibility || false,
        selectionProcess: job.selectionProcess || "",
        description: job.description,
        applicationUrl: job.applicationUrl || "",
      };
    }
  }

  const isEditMode = !!jobId && !!initialData;

  return (
    <Container className="max-w-4xl mt-12">
      <div className="mb-8">
        <h1 className="text-3xl mb-3 font-semibold">
          {isEditMode ? "Edit Job" : "Create a post"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isEditMode
            ? "Update the details of your job listing below."
            : "Share your opportunity with talented professionals looking for their next career move."}
        </p>
      </div>
      <PostJobForm jobId={jobId} initialData={initialData} />
    </Container>
  );
}
