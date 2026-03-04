import Container from "@/components/ui/Container";
import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobJockey - Sign In",
};

export default function Page() {
  return (
    <Container className="my-16 flex justify-center">
      <SignIn />
    </Container>
  );
}
