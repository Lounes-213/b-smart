import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import Globe02Icon from "@hugeicons/core-free-icons/Globe02Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { SiteNav, SiteFooter } from "@/landing/site-chrome";
import { pageMeta, siteHeadLinks } from "@/landing/page-head";
import blogCss from "@/blog/blog.css?url";

const GITHUB_RELEASES_URL = "https://github.com/Lounes-213/b-smart/releases";

export const Route = createFileRoute("/download/android")({
  head: () => ({
    meta: pageMeta(
      "Download b smart Mobile App (Android APK)",
      "Download the official b smart mobile app for Android or install the progressive web app.",
      "/download/android",
    ),
    links: siteHeadLinks(blogCss),
  }),
  component: DownloadAndroidPage,
});

function DownloadAndroidPage() {
  return (
    <div className="wrap">
      <SiteNav />

      <main className="hero max-w-xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-surface border border-border shadow-lg mx-auto mb-6">
          <HugeiconsIcon icon={SmartPhone01Icon} className="size-8 text-foreground" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          b smart Mobile
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
          Monitor your AI coding agents, review diffs, answer questions, and steer work directly from your phone.
        </p>

        {/* Options Cards */}
        <div className="flex flex-col gap-4 text-left mb-10">
          {/* Option 1: Direct Web App (Instant) */}
          <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-base flex items-center gap-2">
                <HugeiconsIcon icon={Globe02Icon} className="size-5 text-primary" />
                <span>Instant Web App (PWA)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Recommended
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Zero install required. Open in your mobile browser (Brave, Chrome, Safari) and tap <strong>Add to Home Screen</strong> for a full standalone native experience.
            </p>
            <a
              href="/"
              className="btn btn-primary btn-sm flex items-center justify-center gap-2 mt-1 w-full"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
              <span>Open b smart on Mobile</span>
            </a>
          </div>

          {/* Option 2: Android APK */}
          <div className="p-5 rounded-2xl bg-surface border border-border/80 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-base flex items-center gap-2">
                <HugeiconsIcon icon={Download01Icon} className="size-5 text-foreground" />
                <span>Android Package (APK)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-recessed text-muted-foreground">
                Standalone
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Official standalone Android release assets published directly on our GitHub repository.
            </p>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm flex items-center justify-center gap-2 mt-1 w-full"
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              <span>Get APK on GitHub Releases</span>
            </a>
          </div>
        </div>

        {/* Pairing Instructions */}
        <div className="p-4 rounded-xl bg-surface-recessed border border-border text-xs text-muted-foreground text-left">
          <strong className="text-foreground block mb-1">⚡ Quick Pairing with PC:</strong>
          Open b smart on your desktop, click the phone icon on the bottom left sidebar, and scan the QR code with your phone camera to pair instantly.
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
