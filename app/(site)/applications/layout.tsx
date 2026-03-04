import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JobJockey - My Applications",
};

export default function ApplicationsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
