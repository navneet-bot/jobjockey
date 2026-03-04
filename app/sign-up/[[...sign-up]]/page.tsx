import Container from "@/components/ui/Container";
import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JobJockey - Create Account",
};

export default function Page() {
    return (
        <Container className="my-16 flex justify-center">
            <SignUp />
        </Container>
    );
}
