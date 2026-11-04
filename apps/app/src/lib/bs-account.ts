import { useState, useEffect, useCallback } from "react";

export interface BsAccountInfo {
  signedIn: boolean;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  connectedAt: number | null;
  mobileConnected: boolean;
  mobileDeviceName: string | null;
}

const STORAGE_KEY = "bs_account_v1";
const EVENT_NAME = "bs-account-change";

export const DEFAULT_BS_ACCOUNT: BsAccountInfo = {
  signedIn: true,
  username: "Lounes-213",
  name: "Lounes Benseba",
  avatarUrl: "https://github.com/Lounes-213.png",
  bio: "b smart multi-agent workspace",
  htmlUrl: "https://github.com/Lounes-213",
  connectedAt: 1730700000000,
  mobileConnected: false,
  mobileDeviceName: null,
};

export const GUEST_BS_ACCOUNT: BsAccountInfo = {
  signedIn: false,
  username: "",
  name: "Guest",
  avatarUrl: "",
  bio: null,
  htmlUrl: "",
  connectedAt: null,
  mobileConnected: false,
  mobileDeviceName: null,
};

export function getStoredBsAccount(): BsAccountInfo {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_BS_ACCOUNT;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BS_ACCOUNT));
      return DEFAULT_BS_ACCOUNT;
    }
    const parsed = JSON.parse(raw) as Partial<BsAccountInfo>;
    return {
      signedIn: Boolean(parsed.signedIn),
      username: parsed.username ?? "",
      name: parsed.name ?? parsed.username ?? "User",
      avatarUrl: parsed.avatarUrl ?? (parsed.username ? `https://github.com/${parsed.username}.png` : ""),
      bio: parsed.bio ?? null,
      htmlUrl: parsed.htmlUrl ?? (parsed.username ? `https://github.com/${parsed.username}` : ""),
      connectedAt: parsed.connectedAt ?? null,
      mobileConnected: Boolean(parsed.mobileConnected),
      mobileDeviceName: parsed.mobileDeviceName ?? null,
    };
  } catch {
    return DEFAULT_BS_ACCOUNT;
  }
}

export function saveStoredBsAccount(account: BsAccountInfo): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: account }));
  } catch {
  }
}

async function notifyPluginAccount(login: string, name: string, avatarUrl: string): Promise<void> {
  try {
    await fetch("/api/v1/plugins/bb-account/rpc/directGithubLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubLogin: login, name, avatarUrl }),
    });
  } catch {
  }
}

async function notifyPluginSignOut(): Promise<void> {
  try {
    await fetch("/api/v1/plugins/bb-account/rpc/signOut", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
  } catch {
  }
}

export async function connectGithubUser(rawUsername: string): Promise<BsAccountInfo> {
  const username = rawUsername.trim().replace(/^@/, "");
  if (!username) {
    throw new Error("Please enter a valid GitHub username.");
  }

  let accountData: BsAccountInfo;
  const current = getStoredBsAccount();

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (res.ok) {
      const data = await res.json();
      accountData = {
        signedIn: true,
        username: data.login,
        name: data.name || data.login,
        avatarUrl: data.avatar_url || `https://github.com/${data.login}.png`,
        bio: data.bio || null,
        htmlUrl: data.html_url || `https://github.com/${data.login}`,
        connectedAt: Date.now(),
        mobileConnected: current.mobileConnected,
        mobileDeviceName: current.mobileDeviceName,
      };
    } else if (res.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    } else {
      accountData = {
        signedIn: true,
        username,
        name: username,
        avatarUrl: `https://github.com/${username}.png`,
        bio: null,
        htmlUrl: `https://github.com/${username}`,
        connectedAt: Date.now(),
        mobileConnected: current.mobileConnected,
        mobileDeviceName: current.mobileDeviceName,
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("was not found")) {
      throw err;
    }
    accountData = {
      signedIn: true,
      username,
      name: username,
      avatarUrl: `https://github.com/${username}.png`,
      bio: null,
      htmlUrl: `https://github.com/${username}`,
      connectedAt: Date.now(),
      mobileConnected: current.mobileConnected,
      mobileDeviceName: current.mobileDeviceName,
    };
  }

  saveStoredBsAccount(accountData);
  void notifyPluginAccount(accountData.username, accountData.name, accountData.avatarUrl);
  return accountData;
}

export async function disconnectBsUser(): Promise<void> {
  const empty: BsAccountInfo = {
    ...GUEST_BS_ACCOUNT,
  };
  saveStoredBsAccount(empty);
  await notifyPluginSignOut();
}

export function setBsMobileState(connected: boolean, deviceName?: string | null): void {
  const current = getStoredBsAccount();
  const updated: BsAccountInfo = {
    ...current,
    mobileConnected: connected,
    mobileDeviceName: connected ? (deviceName ?? "Mobile Companion") : null,
  };
  saveStoredBsAccount(updated);
}

export function useBsAccount() {
  const [account, setAccount] = useState<BsAccountInfo>(getStoredBsAccount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<BsAccountInfo>;
      if (custom.detail) {
        setAccount(custom.detail);
      } else {
        setAccount(getStoredBsAccount());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setAccount(getStoredBsAccount());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const connect = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await connectGithubUser(username);
      setAccount(result);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnectBsUser();
      setAccount(GUEST_BS_ACCOUNT);
    } finally {
      setLoading(false);
    }
  }, []);

  const setMobileConnected = useCallback((connected: boolean, deviceName?: string | null) => {
    setBsMobileState(connected, deviceName);
    setAccount(getStoredBsAccount());
  }, []);

  return {
    account,
    loading,
    error,
    connect,
    disconnect,
    setMobileConnected,
  };
}
