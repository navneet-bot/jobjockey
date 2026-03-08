import { SignUp } from "@clerk/nextjs";
import { GradientHeader } from "@/components/ui/GradientHeader";

export default function BusinessSignupPage() {
    return (
        <div className="flex flex-col gap-8 py-20 px-4 items-center justify-center min-h-[80vh]">
            <GradientHeader
                title="Create Business Account"
                subtitle="Sign up to post jobs and manage your candidates."
                badge="Business Portal"
            />
            
            <SignUp 
                fallbackRedirectUrl="/business/dashboard"
                routing="hash"
            />
        </div>
    );
}
