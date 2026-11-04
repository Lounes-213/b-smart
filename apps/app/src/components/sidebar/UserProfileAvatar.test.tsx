// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@bb/shared-ui/tooltip";
import { UserProfileAvatar } from "./UserProfileAvatar";
import { saveStoredBsAccount, DEFAULT_BS_ACCOUNT, GUEST_BS_ACCOUNT } from "@/lib/bs-account";

function renderWithRouter(ui: ReactNode, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TooltipProvider>
        <Routes>
          <Route path="*" element={ui} />
          <Route
            path="/settings/plugins/bb-account"
            element={<div>bs account page</div>}
          />
        </Routes>
      </TooltipProvider>
    </MemoryRouter>,
  );
}

describe("UserProfileAvatar", () => {
  beforeEach(() => {
    window.localStorage.clear();
    saveStoredBsAccount(DEFAULT_BS_ACCOUNT);
    vi.restoreAllMocks();
  });

  it("opens the b smart account page when the avatar is clicked", async () => {
    renderWithRouter(<UserProfileAvatar size="rail" />);

    const btn = screen.getByRole("button", { name: /b smart account/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(await screen.findByText("bs account page")).toBeTruthy();
  });

  it("renders connect modal when user is disconnected", async () => {
    saveStoredBsAccount(GUEST_BS_ACCOUNT);

    renderWithRouter(<UserProfileAvatar size="compact" />);

    const btn = screen.getByRole("button", { name: /Connect to b smart/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(
      await screen.findByRole("heading", { name: /Connect to b smart/i }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/GitHub Username/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Connect with GitHub/i })).toBeTruthy();
  });
});
