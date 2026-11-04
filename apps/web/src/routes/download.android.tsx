import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
import Alert02Icon from "@hugeicons/core-free-icons/Alert02Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { SiteNav, SiteFooter } from "@/landing/site-chrome";
import { pageMeta, siteHeadLinks } from "@/landing/page-head";
import blogCss from "@/blog/blog.css?url";

const APK_DOWNLOAD_URL = "https://github.com/Lounes-213/b-smart/releases/latest/download/bs-mobile.apk";

export const Route = createFileRoute("/download/android")({
  head: () => ({
    meta: pageMeta(
      "Download bs Mobile App (Android APK)",
      "Direct official download for bs Mobile APK for Android with instant desktop pairing.",
      "/download/android",
    ),
    links: siteHeadLinks(blogCss),
  }),
  component: DownloadAndroidPage,
});

function DownloadAndroidPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const handleConfirmDownload = () => {
    setDownloadStarted(true);
    setConfirmOpen(false);

    const a = document.createElement("a");
    a.href = APK_DOWNLOAD_URL;
    a.download = "bs-mobile.apk";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="wrap">
      <SiteNav />

      <main className="hero max-w-xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-surface border border-border shadow-lg mx-auto mb-6">
          <HugeiconsIcon icon={SmartPhone01Icon} className="size-8 text-foreground" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          bs Mobile for Android
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
          Control your multi-agent workspace, monitor threads, and steer agents from your phone with QR scan pairing.
        </p>

        {downloadStarted && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5 shrink-0" />
            <span>Download started! Check your notification bar or browser downloads to install.</span>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-surface border border-border/80 shadow-xl text-left mb-8 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">bs Companion App</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Package: app.bsmart.mobile · v0.48.2</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Direct APK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs py-2 border-y border-border/60">
            <div>
              <span className="text-muted-foreground block text-[11px]">Format</span>
              <span className="font-semibold text-foreground">Android APK (Standalone)</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Size</span>
              <span className="font-semibold text-foreground">69 MB (Standalone Build)</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Connection</span>
              <span className="font-semibold text-foreground">Instant QR Scan</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Security</span>
              <span className="font-semibold text-foreground">Official Signed Build</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-md flex items-center justify-center gap-2 w-full text-sm font-semibold rounded-xl py-3"
            onClick={() => setConfirmOpen(true)}
          >
            <HugeiconsIcon icon={Download01Icon} className="size-4" />
            <span>Download bs Mobile (APK)</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-surface-recessed border border-border text-xs text-muted-foreground text-left space-y-2">
          <strong className="text-foreground block text-sm">📲 3-Step Setup:</strong>
          <p>1. Tap the download button above and confirm the APK download.</p>
          <p>2. Open the downloaded <strong>bs-mobile.apk</strong> on your phone and tap <strong>Install</strong>.</p>
          <p>3. Launch <strong>bs</strong>, point your camera at the QR code on your desktop screen, and enter instantly.</p>
        </div>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-surface border border-border p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <HugeiconsIcon icon={Alert02Icon} className="size-5 text-primary" />
                <span>Confirm APK Download</span>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground p-1"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to download <strong>bs-mobile.apk (v0.48.2)</strong> directly to your device?
            </p>

            <div className="p-3 rounded-xl bg-surface-recessed border border-border/80 text-xs text-foreground font-mono">
              bs-mobile.apk · 69 MB · Standalone Verified
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                className="btn btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                onClick={handleConfirmDownload}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                <span>Confirm & Download APK (تأكيد التحميل)</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost w-full py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
