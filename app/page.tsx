import GuestHome from "@/components/features/home/GuestHome";
import TalentHome from "@/components/features/home/TalentHome";
import CompanyHome from "@/components/features/home/CompanyHome";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { userProfilesTable, companiesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const [talentProfile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId))
      .limit(1);

    if (talentProfile) {
      return <TalentHome profileData={talentProfile} />;
    }

    const [businessProfile] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.userId, userId))
      .limit(1);

    if (businessProfile && businessProfile.isVerified) {
      return <CompanyHome companyData={businessProfile} />;
    }
  }

  return <GuestHome />;
}
