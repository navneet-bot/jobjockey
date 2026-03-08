import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Job, Internship } from "@/lib/schema";
import { Briefcase, MapPin, Clock, IndianRupee, GraduationCap } from "lucide-react";
import Link from "next/link";
import JobActionBtns from "./JobActionBtns";

interface JobCardProps {
  job: any; // Using any because of the combined type with jobCategory
}

export default function JobCard({ job }: JobCardProps) {
  const isInternship = job.jobCategory === 'internship' || 'duration' in job;
  const item = job as any;

  return (
    <Card className="relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex gap-5 flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link href={isInternship ? `/internships/${item.id}` : `/jobs/${item.id}`}>
                <h3 className="font-bold text-lg leading-tight text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm text-[var(--text-dim)] mt-1">{item.company}</p>
            </div>
            <Badge variant="outline" className={`text-[10px] uppercase font-bold ${isInternship ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-500'}`}>
              {isInternship ? 'Internship' : 'Job'}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-[var(--text-dim)]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>{item.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {isInternship ? <Clock className="h-4 w-4 text-[var(--primary)]" /> : <Briefcase className="h-4 w-4 text-[var(--primary)]" />}
              <span>{isInternship ? item.duration : item.jobType}</span>
            </div>

            {(item.salary || item.stipend) && (
              <div className="flex items-center gap-1.5 font-semibold text-[var(--text-main)]">
                <IndianRupee className="h-4 w-4 text-[var(--primary)]" />
                <span>{item.salary || item.stipend}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium bg-[var(--glass-bg)] border-[var(--glass-border)]">
                {isInternship ? "Student" : item.experienceLevel}
              </Badge>
            </div>
            <span className="text-xs text-[var(--text-dim)] font-medium">
              Posted: {new Date(item.postedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="mt-5">
          <JobActionBtns jobId={item.id} ownerId={item.postedBy} />
        </div>
      </CardContent>
    </Card>
  );
}
