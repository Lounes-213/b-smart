// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TooltipProvider } from "@bb/shared-ui/tooltip";
import { NavRailMobileButton } from "./NavRailMobileButton";
import { saveStoredBsAccount, DEFAULT_BS_ACCOUNT } from "@/lib/bs-account";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NavRailMobileButton", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    saveStoredBsAccount({
      ...DEFAULT_BS_ACCOUNT,
      mobileConnected: false,
    });
    vi.restoreAllMocks();
  });

  it("renders when mobile is disconnected and opens QR dialog", async () => {
    render(
      <MemoryRouter>
        <TooltipProvider>
          <NavRailMobileButton />
        </TooltipProvider>
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /Connect Mobile/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(await screen.findByRole("heading", { name: /Connect Mobile with QR/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Copy Connection Link/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Pair Phone Now/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Pair Phone Now/i }));

    expect(await screen.findByText(/Live & Connected/i)).toBeTruthy();
  });

  it("renders when mobile is connected and allows disconnect", async () => {
    saveStoredBsAccount({
      ...DEFAULT_BS_ACCOUNT,
      mobileConnected: true,
      mobileDeviceName: "iPhone 15",
    });

    render(
      <MemoryRouter>
        <TooltipProvider>
          <NavRailMobileButton />
        </TooltipProvider>
      </MemoryRouter>,
    );

    const btn = screen.getByRole("button", { name: /Mobile: Connected/i });
    expect(btn).toBeTruthy();

    fireEvent.click(btn);

    expect(await screen.findByRole("heading", { name: /Mobile Connected/i })).toBeTruthy();
    expect(screen.getByText("iPhone 15")).toBeTruthy();

    const disconnectBtn = screen.getByRole("button", { name: /Disconnect Phone/i });
    expect(disconnectBtn).toBeTruthy();

    fireEvent.click(disconnectBtn);

    expect(await screen.findByRole("heading", { name: /Connect Mobile with QR/i })).toBeTruthy();
  });
});
