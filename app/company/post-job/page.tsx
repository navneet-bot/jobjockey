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
        jobType: job.jobType as "Full-time" | "Part-time" | "Contract" | "Internship",
        jobCategory: (job.jobCategory || "job") as "job" | "internship" | "training",
        location: job.location,
        experienceLevel: job.experienceLevel as "Entry Level" | "Mid-Level" | "Senior" | "Manager",
        salary: job.salary || "",
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
          {isEditMode ? "Edit Job" : "Post a New Job"}
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
