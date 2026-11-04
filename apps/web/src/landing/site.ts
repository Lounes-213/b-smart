export const GITHUB_URL = "https://github.com/Lounes-213/b-smart";
export const DOWNLOAD_FALLBACK_URL =
  "https://github.com/Lounes-213/b-smart/releases/tag/desktop-latest";
export const DOWNLOAD_RELEASE_ASSET_BASE_URL =
  "https://github.com/Lounes-213/b-smart/releases/download/desktop-latest";

export type DesktopPlatform = "macos" | "linux" | "windows";

export const DEFAULT_DESKTOP_PLATFORM: DesktopPlatform = "macos";

export type DesktopDownload = {
  label: string;
  buttonLabel: string;
  note: string;
  installerExtension: string;
  versionFeedUrl: string;
  redirectPath: string;
};

export const DESKTOP_DOWNLOADS: Record<DesktopPlatform, DesktopDownload> = {
  macos: {
    label: "macOS",
    buttonLabel: "Download for macOS",
    note: "Apple Silicon",
    installerExtension: ".dmg",
    versionFeedUrl: `${DOWNLOAD_RELEASE_ASSET_BASE_URL}/desktop-version.json`,
    redirectPath: "/download/macos",
  },
  linux: {
    label: "Linux (Alpha)",
    buttonLabel: "Download for Linux",
    note: "x64 AppImage, alpha",
    installerExtension: ".AppImage",
    versionFeedUrl: `${DOWNLOAD_RELEASE_ASSET_BASE_URL}/desktop-version-linux.json`,
    redirectPath: "/download/linux",
  },
  windows: {
    label: "Windows (Alpha)",
    buttonLabel: "Download for Windows",
    note: "x64 · alpha",
    installerExtension: ".exe",
    versionFeedUrl: `${DOWNLOAD_RELEASE_ASSET_BASE_URL}/desktop-version-windows.json`,
    redirectPath: "/download/windows",
  },
};
export const SUBSCRIBE_PATH = "/api/subscribe";
export const CLI_COMMAND = "npx b-smart@latest";
export const WINDOWS_DOWNLOAD_URL = "/download/windows";

export type CtaPlacement = "nav" | "hero" | "local" | "closer" | "footer";

export const UTM_PARAM_NAMES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export const CLICK_ID_PARAM_NAMES = ["gclid", "gbraid", "wbraid"] as const;

export const CAMPAIGN_PARAM_NAMES = [
  ...UTM_PARAM_NAMES,
  ...CLICK_ID_PARAM_NAMES,
] as const;

export const VISIT_PARAM_NAMES = [
  "visitor_id",
  "session_id",
  "first_page",
  "first_referrer",
] as const;

export function downloadHref(
  platform: DesktopPlatform,
  placement: CtaPlacement,
): string {
  if (platform === "windows") {
    return "https://github.com/Lounes-213/b-smart/releases/download/v0.48.1/b-smart-0.48.1-x64.exe";
  }
  return `${DESKTOP_DOWNLOADS[platform].redirectPath}?placement=${placement}`;
}

declare const __SITE_ORIGIN__: string;
const SITE_URL = __SITE_ORIGIN__;
export const SITE_TITLE = "b smart · The Intelligent Multi-Agent Workspace";
export const SITE_DESCRIPTION =
  "b smart is an intelligent, local-first agentic workspace. Orchestrate Claude Code, Codex, Cursor, Pi, and custom AI agents seamlessly on your machine with total privacy and extensibility.";
export const OG_DESCRIPTION =
  "Orchestrate AI coding agents, automate complex workflows, and build software at the speed of thought with b smart.";

export function unfurlMeta(
  title: string,
  description: string,
  path: string,
  image = {
    path: "/og.png",
    width: 2400,
    height: 1260,
    alt: "b smart logo — The Intelligent Multi-Agent Workspace. Free, open source, and local-first.",
  },
) {
  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}${path}` },
    { property: "og:site_name", content: "b smart" },
    { property: "og:image", content: `${SITE_URL}${image.path}` },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    {
      property: "og:image:alt",
      content: image.alt,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE_URL}${image.path}` },
  ];
}
