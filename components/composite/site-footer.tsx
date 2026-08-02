import Link from "next/link";

import { Logo } from "@/components/composite/logo";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs space-y-3">
          <Logo />
          <p className="text-muted-foreground text-sm">{siteConfig.description}</p>
        </div>

        {footerNav.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="mb-3 text-sm font-semibold">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t">
        <div className="container-site text-muted-foreground flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>
            © {year} {siteConfig.name}. Released under the MIT License.
          </p>
          <p>Built for curious developers, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
