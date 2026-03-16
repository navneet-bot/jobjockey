"use client";

import { deleteJob } from "@/actions/jobActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { Trash, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function JobActionBtns({
  jobId,
  ownerId,
  jobCategory = 'job'
}: {
  jobId: string;
  ownerId: string;
  jobCategory?: 'job' | 'internship';
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isSignedIn, userId } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isSignedIn || userId !== ownerId) {
    return null;
  }

  async function onDelete() {
    try {
      setIsDeleting(true);
      const response = await deleteJob(jobId);

      if (response.success) {
        toast.success("Job deleted successfully.");
        setOpen(false);
      } else {
        toast.error(response.error || "Failed to delete job.");
      }
    } catch (error) {
      console.log("Delete failed: ", error);
      toast.error("Unexpected error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="absolute z-10 right-2 top-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-2">
          <Link href={`/business/post-job?${jobCategory === 'internship' ? 'internshipId' : 'jobId'}=${jobId}`}>
            <Button variant="outline" className="cursor-pointer" size={"icon"}>
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer" size={"icon"}>
              <Trash className="w-5 h-5 text-red-500" />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              job posting.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isDeleting}
              variant={"destructive"}
              onClick={onDelete}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
