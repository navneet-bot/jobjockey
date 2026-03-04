import Container from "@/components/ui/Container";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="px-4 py-12 lg:px-20">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="mb-3 text-lg font-semibold">Job Jockey</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Connecting talented professionals with innovative companies. Find
              your next career opportunity or discover exceptional talent.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={"/"}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Job Jockey. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Facebook className="h-5 w-5" />
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="h-5 w-5" />
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.427.06.646 0 2.734-3.516 4.952-7.84 4.952-4.323 0-7.84-2.218-7.84-4.952 0-.22.021-.435.062-.646A1.757 1.757 0 0 1 3.514 11.75c0-.968.786-1.754 1.754-1.754.463 0 .882.18 1.189.479 1.18-.846 2.813-1.4 4.615-1.484l.956-4.488a.5.5 0 0 1 .595-.385l3.38.712c.197-.391.606-.646 1.057-.646zm-6.39 7.13c-.603 0-1.092.49-1.092 1.09s.49 1.093 1.091 1.093c.603 0 1.092-.49 1.092-1.093s-.49-1.091-1.092-1.091zm4.76 0c-.603 0-1.091.49-1.091 1.09s.488 1.093 1.091 1.093c.603 0 1.092-.49 1.092-1.093s-.489-1.091-1.092-1.091zm-4.76 3.974a.387.387 0 0 0-.287.654c.9.9 2.184 1.242 3.393 1.242 1.209 0 2.492-.341 3.393-1.242a.387.387 0 1 0-.547-.547c-.723.723-1.816 1.03-2.846 1.03-1.03 0-2.124-.307-2.847-1.03a.387.387 0 0 0-.259-.107z"></path>
              </svg>
            </Link>

            <Link
              href={"/"}
              target="_blank"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
