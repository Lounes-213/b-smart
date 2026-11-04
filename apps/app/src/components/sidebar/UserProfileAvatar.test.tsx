// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TooltipProvider } from "@bb/shared-ui/tooltip";
import { UserProfileAvatar } from "./UserProfileAvatar";
import { saveStoredBsAccount, DEFAULT_BS_ACCOUNT, GUEST_BS_ACCOUNT } from "@/lib/bs-account";

describe("UserProfileAvatar", () => {
  beforeEach(() => {
    window.localStorage.clear();
    saveStoredBsAccount(DEFAULT_BS_ACCOUNT);
    vi.restoreAllMocks();
  });

  it("renders the connected avatar and opens profile dialog with disconnect button", async () => {
    render(
      <TooltipProvider>
        <UserProfileAvatar size="rail" />
      </TooltipProvider>,
    );

    const btn = screen.getByRole("button", { name: /b smart account/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(await screen.findByText("Lounes Benseba")).toBeTruthy();
    expect(screen.getByText(/@Lounes-213/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /View GitHub Profile/i })).toBeTruthy();

    const disconnectBtn = screen.getByRole("button", { name: /Disconnect from b smart/i });
    expect(disconnectBtn).toBeTruthy();

    fireEvent.click(disconnectBtn);

    await waitFor(() => {
      expect(screen.getByText(/Connect to b smart/i)).toBeTruthy();
    });
  });

  it("renders connect modal when user is disconnected", async () => {
    saveStoredBsAccount(GUEST_BS_ACCOUNT);

    render(
      <TooltipProvider>
        <UserProfileAvatar size="compact" />
      </TooltipProvider>,
    );

    const btn = screen.getByRole("button", { name: /Connect to b smart/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(await screen.findByRole("heading", { name: /Connect to b smart/i })).toBeTruthy();
    expect(screen.getByLabelText(/GitHub Username/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Connect with GitHub/i })).toBeTruthy();
  });
});
