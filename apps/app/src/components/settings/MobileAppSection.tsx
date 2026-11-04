import { PluginMobileSettingsSections } from "@/components/plugin/PluginSettingsSections";
import { MachineAccessSettings } from "./MachineAccessSettings";
import { MobilePairingCard } from "@/components/mobile/MobilePairingCard";
import { mobileAppDownloads } from "@bb/domain";
import { buttonVariants } from "@bb/shared-ui/button";
import { useQuery } from "@tanstack/react-query";
import { SettingsSection } from "@/components/ui/settings-section";
import { sdk } from "@/lib/sdk";
import { getNativeShell } from "@/lib/native-shell";
import { useSystemConfig } from "@/hooks/queries/system-queries";

export function MobileAppSection() {
  const systemConfig = useSystemConfig();
  const machineServerUrl =
    systemConfig.data?.generalSettings?.machineServerUrl ?? null;
  const releases = useQuery({
    queryKey: ["system", "mobile-app-releases"],
    queryFn: () => sdk.system.mobileAppReleases(),
    staleTime: 5 * 60_000,
    retry: false,
  });
  const android = releases.data?.android;
  const handshake = getNativeShell()?.handshake;
  const installedAndroid = handshake?.platform === "android" ? handshake : null;
  return (
    <section aria-label="Mobile app" className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Mobile app</h2>
        <p className="mt-1 text-sm text-subtle-foreground">
          Use bs from your phone. Scan a code to connect — no manual setup.
        </p>
      </div>

      <SettingsSection
        title="Scan to connect"
        description="Open the bs app, tap the scanner, and point it at this code."
        bodyClassName="space-y-4"
      >
        <div className="flex justify-center">
          <MobilePairingCard machineServerUrl={machineServerUrl} />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Android app"
        description="Install or update the bs app for Android"
        bodyClassName="space-y-4"
      >
        <p className="text-sm text-subtle-foreground">
          Download the APK and open it on your phone to install. Allow
          installation from your browser if prompted.
        </p>
        {installedAndroid && (
          <div className="space-y-1 text-sm">
            <p>
              Installed: {installedAndroid.appVersion}
              {installedAndroid.androidVersionCode !== undefined &&
                ` (build ${installedAndroid.androidVersionCode})`}
            </p>
            <p role="status">
              {installedAndroid.androidVersionCode === undefined
                ? "This app does not report its build number. Download the latest APK to check for updates."
                : releases.isPending
                  ? "Checking for updates…"
                  : !android
                    ? "Unable to check for updates. You can still download the latest APK."
                    : installedAndroid.androidVersionCode < android.versionCode
                      ? "Update available"
                      : installedAndroid.androidVersionCode ===
                          android.versionCode
                        ? "You’re up to date"
                        : "You’re running a newer build than the latest published release"}
            </p>
          </div>
        )}
        {android ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-subtle-foreground">Version</dt>
            <dd>
              {android.version} (build {android.versionCode})
            </dd>
            <dt className="text-subtle-foreground">Updated</dt>
            <dd>
              <time dateTime={android.updatedAt}>
                {new Date(android.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </dd>
            <dt className="text-subtle-foreground">Download size</dt>
            <dd>{Math.ceil(android.size / 1024 / 1024)} MB</dd>
          </dl>
        ) : (
          <p className="text-sm text-subtle-foreground" role="status">
            {releases.isPending
              ? "Checking the latest release…"
              : "Release details are unavailable. You can still download the APK."}
          </p>
        )}
        <a
          href={mobileAppDownloads.android}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          Download Android APK
        </a>
      </SettingsSection>

      <details className="rounded-lg border border-border bg-card">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
          Advanced: connection method
        </summary>
        <div className="border-t border-border-seam px-4 py-4">
          <MachineAccessSettings title="Connection method">
            {(pluginId) => <PluginMobileSettingsSections pluginId={pluginId} />}
          </MachineAccessSettings>
        </div>
      </details>
    </section>
  );
}
