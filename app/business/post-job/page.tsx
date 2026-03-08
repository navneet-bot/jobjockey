import PostJobForm from "@/components/features/job/PostJobForm";
import Container from "@/components/ui/Container";
import { getSingleJob } from "@/actions/jobActions";
import { getSingleInternship } from "@/actions/internshipActions";

interface PostJobPageProps {
  searchParams: Promise<{ jobId?: string; internshipId?: string }>;
}

export default async function PostJobPage({ searchParams }: PostJobPageProps) {
  const params = await searchParams;
  const jobId = params.jobId;
  const internshipId = params.internshipId;
  let initialData = undefined;

  if (jobId) {
    const job = await getSingleJob(jobId);
    if (job) {
      initialData = {
        title: job.title,
        jobType: ((job.jobType as string) === "Internship" ? "Full-time" : job.jobType) as "Full-time" | "Part-time" | "Contract",
        jobCategory: "job" as const,
        location: job.location,
        experienceLevel: job.experienceLevel as "Entry Level" | "Mid-Level" | "Senior" | "Manager",
        salary: job.salary || "",
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
        description: job.description,
        applicationUrl: job.applicationUrl || "",
        selectionProcess: job.selectionProcess || "",
      };
    }
  } else if (internshipId) {
    const internship = await getSingleInternship(internshipId);
    if (internship) {
      initialData = {
        title: internship.title,
        jobCategory: "internship" as const,
        location: internship.location,
        stipend: internship.stipend || "",
        duration: internship.duration || "",
        department: internship.department || "",
        workMode: internship.workMode || "Remote",
        description: internship.description,
        whatWillLearn: internship.whatWillLearn || "",
        projectsAndTasks: internship.projectsAndTasks || "",
        requiredSkills: internship.requiredSkills || "",
        toolsAndTechnologies: internship.toolsAndTechnologies || "",
        educationLevel: (internship.educationLevel as any) || "Undergraduate",
        eligibleCourses: internship.eligibleCourses || "",
        mentorshipProvided: internship.mentorshipProvided || false,
        trainingProvided: internship.trainingProvided || false,
        certificateProvided: internship.certificateProvided || false,
        letterOfRecProvided: internship.letterOfRecProvided || false,
        ppoPossibility: internship.ppoPossibility || false,
        selectionProcess: internship.selectionProcess || "",
        openPositions: internship.openPositions || "",
        joiningDate: internship.joiningDate || "",
        deadline: internship.deadline || "",
        applicationUrl: internship.applicationUrl || "",
      };
    }
  }

  const isEditMode = (!!jobId || !!internshipId) && !!initialData;
  const currentId = jobId || internshipId;

  return (
    <Container className="max-w-4xl mt-12">
      <div className="mb-8">
        <h1 className="text-3xl mb-3 font-semibold">
          {isEditMode ? `Edit ${initialData?.jobCategory === 'internship' ? 'Internship' : 'Job'}` : "Create a post"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isEditMode
            ? `Update the details of your ${initialData?.jobCategory || 'post'} listing below.`
            : "Share your opportunity with talented professionals looking for their next career move."}
        </p>
      </div>
      <PostJobForm jobId={currentId} initialData={initialData} />
    </Container>
  );
}
