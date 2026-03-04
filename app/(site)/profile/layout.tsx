import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JobJockey - Profile Settings",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
