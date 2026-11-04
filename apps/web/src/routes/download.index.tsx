import { createFileRoute } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon";
import LaptopIcon from "@hugeicons/core-free-icons/LaptopIcon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import { SiteNav, SiteFooter } from "@/landing/site-chrome";
import { pageMeta, siteHeadLinks } from "@/landing/page-head";
import blogCss from "@/blog/blog.css?url";

const WINDOWS_EXE_URL =
  "https://github.com/Lounes-213/b-smart/releases/download/v0.48.2/b-smart-0.48.1-x64.exe";
const ANDROID_APK_URL = "/bs-mobile.apk";

export const Route = createFileRoute("/download/")({
  head: () => ({
    meta: pageMeta(
      "Download b smart & bs Mobile",
      "Official downloads for b smart Desktop (Windows x64) and bs Mobile (Android APK).",
      "/download",
    ),
    links: siteHeadLinks(blogCss),
  }),
  component: DownloadHubPage,
});

function DownloadHubPage() {
  return (
    <div className="wrap">
      <SiteNav />

      <main className="hero max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          Download b smart
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
          Get the intelligent multi-agent workspace for your desktop and mobile devices. Free, local-first, and fully customizable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-2xl bg-surface-recessed border border-border flex items-center justify-center text-foreground">
                  <HugeiconsIcon icon={LaptopIcon} className="size-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Windows x64
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">
                b smart Desktop
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Full-featured desktop app with native runtime, AI agent orchestrator, and local sandbox.
              </p>

              <div className="space-y-2 text-xs py-3 border-y border-border/60 mb-6 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Version:</span>
                  <span className="font-semibold text-foreground">v0.48.1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Size:</span>
                  <span className="font-semibold text-foreground">182 MB (.exe)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compatibility:</span>
                  <span className="font-semibold text-foreground">Windows 10 / 11 (x64)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-updates:</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" /> Supported
                  </span>
                </div>
              </div>
            </div>

            <a
              href={WINDOWS_EXE_URL}
              className="btn btn-primary btn-md flex items-center justify-center gap-2 w-full text-sm font-semibold rounded-xl py-3"
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              <span>Download for Windows (182 MB)</span>
            </a>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-2xl bg-surface-recessed border border-border flex items-center justify-center text-foreground">
                  <HugeiconsIcon icon={SmartPhone01Icon} className="size-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Android APK
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">
                bs Mobile Companion
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Mobile companion app to monitor running agents, approve actions, and steer threads via QR scan.
              </p>

              <div className="space-y-2 text-xs py-3 border-y border-border/60 mb-6 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Package:</span>
                  <span className="font-semibold text-foreground">app.bsmart.mobile · v0.48.2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Size:</span>
                  <span className="font-semibold text-foreground">69 MB (Standalone Build)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compatibility:</span>
                  <span className="font-semibold text-foreground">Android 8.0+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pairing:</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" /> QR Code Scanner
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={ANDROID_APK_URL}
                className="btn btn-primary btn-md flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-3"
              >
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
                <span>Download APK (69 MB)</span>
              </a>
              <a
                href="/download/android"
                className="btn btn-secondary btn-md flex items-center justify-center gap-2 text-xs font-semibold rounded-xl py-3 px-4"
              >
                Setup Guide
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-recessed border border-border text-center max-w-xl mx-auto">
          <p className="text-xs text-muted-foreground mb-2">
            Prefer using the command line or running in your browser?
          </p>
          <code className="text-xs font-mono font-bold bg-surface border border-border px-3 py-1.5 rounded-lg text-foreground inline-block">
            npx b-smart@latest
          </code>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
