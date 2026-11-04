import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import { SiteNav, SiteFooter } from "@/landing/site-chrome";
import { pageMeta, siteHeadLinks } from "@/landing/page-head";
import blogCss from "@/blog/blog.css?url";

const WINDOWS_EXE_URL =
  "https://github.com/Lounes-213/b-smart/releases/download/v0.48.2/b-smart-0.48.1-x64.exe";

export const Route = createFileRoute("/download/windows")({
  head: () => ({
    meta: pageMeta(
      "Download b smart Desktop for Windows (x64)",
      "Official release of b smart desktop installer for Windows x64.",
      "/download/windows",
    ),
    links: siteHeadLinks(blogCss),
  }),
  component: DownloadWindowsPage,
});

function DownloadWindowsPage() {
  useEffect(() => {
    window.location.assign(WINDOWS_EXE_URL);
  }, []);

  return (
    <div className="wrap">
      <SiteNav />
      <main className="hero max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Downloading b smart for Windows…
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your download should start automatically. If it didn't, click the button below:
        </p>
        <a
          href={WINDOWS_EXE_URL}
          className="btn btn-primary btn-md inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold"
        >
          <HugeiconsIcon icon={Download01Icon} className="size-4" />
          <span>Download b-smart-0.48.1-x64.exe (182 MB)</span>
        </a>
      </main>
      <SiteFooter />
    </div>
  );
}
