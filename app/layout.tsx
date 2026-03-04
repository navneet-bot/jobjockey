import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuth } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import PageTransition from "@/components/ui/PageTransition";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "JobJockey",
  description: "Job Jockey helps companies hire trained candidates and helps students start their careers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          modalBackdrop: "flex justify-center items-center",
        },
      }}
    >
      <html lang="en" className={`${manrope.variable} ${outfit.variable}`} suppressHydrationWarning>
        <body className="antialiased min-h-screen text-foreground font-sans relative" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--bg-main)] transition-colors duration-500">
              <div className="mesh-blob-1 bg-[var(--mesh-1)] blur-[120px] rounded-full w-[500px] h-[500px] top-[10%] left-[20%] absolute animate-blob"></div>
              <div className="mesh-blob-2 bg-[var(--mesh-2)] blur-[160px] rounded-full w-[600px] h-[600px] top-[40%] right-[10%] absolute animate-blob animation-delay-2000"></div>
              <div className="mesh-blob-3 bg-[var(--mesh-3)] blur-[200px] rounded-full w-[700px] h-[700px] bottom-[5%] left-[50%] absolute animate-blob animation-delay-4000"></div>
            </div>

            <Header />

            <main className="relative z-10 w-full min-h-[calc(100vh-300px)]">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            <Footer />

            <Toaster theme="dark" position="bottom-right" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
