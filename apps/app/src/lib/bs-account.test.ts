// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getStoredBsAccount,
  saveStoredBsAccount,
  connectGithubUser,
  disconnectBsUser,
  setBsMobileState,
  DEFAULT_BS_ACCOUNT,
} from "./bs-account";

describe("bs-account logic", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns default account when storage is empty", () => {
    const acc = getStoredBsAccount();
    expect(acc.signedIn).toBe(true);
    expect(acc.username).toBe(DEFAULT_BS_ACCOUNT.username);
  });

  it("saves and reads stored account", () => {
    saveStoredBsAccount({
      signedIn: true,
      username: "test-user",
      name: "Test User",
      avatarUrl: "https://github.com/test-user.png",
      bio: "Hello world",
      htmlUrl: "https://github.com/test-user",
      connectedAt: 12345,
      mobileConnected: false,
      mobileDeviceName: null,
    });
    const loaded = getStoredBsAccount();
    expect(loaded.signedIn).toBe(true);
    expect(loaded.username).toBe("test-user");
    expect(loaded.name).toBe("Test User");
  });

  it("disconnects the user and clears signed-in status", async () => {
    await disconnectBsUser();
    const acc = getStoredBsAccount();
    expect(acc.signedIn).toBe(false);
    expect(acc.username).toBe("");
    expect(acc.mobileConnected).toBe(false);
  });

  it("connects a github user with fallback info if network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network offline"));
    const acc = await connectGithubUser("custom-user");
    expect(acc.signedIn).toBe(true);
    expect(acc.username).toBe("custom-user");
    expect(acc.avatarUrl).toBe("https://github.com/custom-user.png");
  });

  it("connects a github user with api data when available", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/583231",
        bio: "GitHub mascot",
        html_url: "https://github.com/octocat",
      }),
    } as Response);

    const acc = await connectGithubUser("octocat");
    expect(acc.signedIn).toBe(true);
    expect(acc.username).toBe("octocat");
    expect(acc.name).toBe("The Octocat");
    expect(acc.avatarUrl).toBe("https://avatars.githubusercontent.com/u/583231");
    expect(acc.bio).toBe("GitHub mascot");
  });

  it("toggles mobile connected state", () => {
    setBsMobileState(true, "iPhone 15 Pro");
    let acc = getStoredBsAccount();
    expect(acc.mobileConnected).toBe(true);
    expect(acc.mobileDeviceName).toBe("iPhone 15 Pro");

    setBsMobileState(false);
    acc = getStoredBsAccount();
    expect(acc.mobileConnected).toBe(false);
    expect(acc.mobileDeviceName).toBeNull();
  });
});
