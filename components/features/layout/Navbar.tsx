"use client";
import { Briefcase, Menu } from "lucide-react";
import Link from "next/link";
import NavbarActions from "./NavbarActions";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const NavLinks = ({ isMobile = false }) => {
    const links = (
      <>
        <Link
          className="text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-primary relative group py-1"
          href={"/"}
        >
          <span>Browse Jobs</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link
          className="text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-primary relative group py-1"
          href={"/post-job"}
        >
          <span>Post A Job</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
      </>
    );

    if (isMobile) {
      return (
        <>
          <SheetClose asChild>
            <div className="flex md:hidden mb-2">
              <NavbarActions />
            </div>
          </SheetClose>
          <SheetClose asChild>
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={"/"}
            >
              Browse Jobs
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href={"/post-job"}
            >
              Post A Job
            </Link>
          </SheetClose>
        </>
      );
    }

    return links;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="h-16 mx-auto flex justify-between items-center px-4 lg:px-8">
        <div className="flex  items-center gap-4 md:gap-8">
          <div className=" md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation links
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col justify-center items-center gap-4 mt-8">
                  {/* <div className="flex md:hidden mb-2">
                    <NavbarActions />
                  </div> */}
                  <NavLinks isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href={"/"} className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              JOB JOCKEY
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>
        <div className="hidden md:flex">
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}
