import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import App from "./App.jsx";
import { TICKETS_STORAGE_KEY } from "./services/ticketStorage.js";

const dashboardHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("service desk dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
    document.head.innerHTML = '<meta name="theme-color" content="#FAFAF9" />';
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  afterEach(() => {
    cleanup();
    document.head.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("shows demonstration tickets and ticket summary counts", () => {
    render(<App />);
    const summary = within(screen.getByRole("region", { name: "Ticket summary" }));

    expect(screen.getByText(/demonstration data/i)).toBeInTheDocument();
    expect(screen.getByText("Demo: Shared folder access request")).toBeInTheDocument();
    expect(summary.getByText("Total tickets").closest("article")).toHaveTextContent(
      "5",
    );
    expect(summary.getByText("Open").closest("article")).toHaveTextContent("2");
    expect(summary.getByText("In progress").closest("article")).toHaveTextContent(
      "2",
    );
    expect(summary.getByText("Resolved").closest("article")).toHaveTextContent(
      "1",
    );
  });

  it("validates and creates a ticket, then persists it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /new ticket/i }));
    await user.click(screen.getByRole("button", { name: "Create ticket" }));
    expect(screen.getByText("Enter a ticket title.")).toBeInTheDocument();
    expect(screen.getByText("Enter a requester name.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Title"), "Demo request from test");
    await user.type(screen.getByLabelText("Requester"), "Demo User 06");
    await user.selectOptions(
      within(screen.getByRole("region", { name: "Create a ticket" })).getByLabelText(
        "Priority",
      ),
      "High",
    );
    await user.click(screen.getByRole("button", { name: "Create ticket" }));

    expect(screen.getByText("SD-1043")).toBeInTheDocument();
    expect(screen.getByText("Demo request from test")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(TICKETS_STORAGE_KEY))).toHaveLength(6);
  });

  it("searches tickets and filters by status and priority", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox"), "laptop");
    expect(screen.getByText("Demo: Laptop performance review")).toBeInTheDocument();
    expect(screen.queryByText("Demo: Account sign-in assistance")).not.toBeInTheDocument();

    await user.clear(screen.getByRole("searchbox"));
    await user.selectOptions(screen.getByLabelText("Status"), "In Progress");
    await user.selectOptions(screen.getByLabelText("Priority"), "Low");

    expect(screen.getByText("Demo: Laptop performance review")).toBeInTheDocument();
    expect(screen.getByText("Demo: Monitor connection check")).toBeInTheDocument();
    expect(screen.queryByText("Demo: Shared folder access request")).not.toBeInTheDocument();
  });

  it("combines search, status, and priority filters", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox"), "software");
    await user.selectOptions(screen.getByLabelText("Status"), "Open");
    await user.selectOptions(screen.getByLabelText("Priority"), "Medium");

    expect(screen.getByText("Demo: Software installation request")).toBeInTheDocument();
    expect(screen.queryByText("Demo: Shared folder access request")).not.toBeInTheDocument();
    expect(screen.queryByText("Demo: Account sign-in assistance")).not.toBeInTheDocument();
  });

  it("edits a ticket, changes its status, and confirms deletion", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit SD-1042" }));
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Updated demo request");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Updated demo request")).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Change status for SD-1042" }),
      "In Progress",
    );
    expect(screen.getByRole("combobox", { name: "Change status for SD-1042" }))
      .toHaveValue("In Progress");
    await user.click(screen.getByRole("button", { name: "Resolve SD-1042" }));
    expect(
      screen.getByRole("combobox", { name: "Change status for SD-1042" }),
    ).toHaveValue("Resolved");
    expect(screen.getByText("SD-1042 marked as resolved.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete SD-1042" }));
    expect(confirm).toHaveBeenCalledOnce();
    expect(screen.queryByText("Updated demo request")).not.toBeInTheDocument();
  });

  it("keeps a changed ticket after the app is remounted", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(screen.getByRole("button", { name: "Edit SD-1042" }));
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Persisted demo request");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByText("Persisted demo request")).toBeInTheDocument();

    unmount();
    render(<App />);

    expect(screen.getByText("Persisted demo request")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(TICKETS_STORAGE_KEY))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "SD-1042",
          title: "Persisted demo request",
        }),
      ]),
    );
  });

  it("leaves the ticket intact when deletion is cancelled", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("confirm", vi.fn(() => false));
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete SD-1042" }));

    expect(confirm).toHaveBeenCalledOnce();
    expect(screen.getByText("Demo: Shared folder access request")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(TICKETS_STORAGE_KEY))).toHaveLength(5);
  });

  it("falls back to demonstration data when browser storage is corrupted", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem(TICKETS_STORAGE_KEY, "not valid JSON");

    render(<App />);

    expect(
      screen
        .getAllByRole("status")
        .find((status) => status.textContent.includes("could not be read")),
    ).toHaveTextContent(/could not be read/i);
    expect(screen.getByText("Demo: Shared folder access request")).toBeInTheDocument();
  });

  it("persists the theme toggle preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Switch to dark theme" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("service-desk-theme")).toBe("dark");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#1C1917",
    );

    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#FAFAF9",
    );
  });

  it("uses the saved theme preference before the operating system preference", () => {
    const initializedPage = new JSDOM(dashboardHtml, {
      runScripts: "dangerously",
      url: "http://service-desk.local",
      beforeParse(window) {
        window.localStorage.setItem("service-desk-theme", "dark");
        window.matchMedia = vi.fn(() => ({ matches: false }));
      },
    });

    expect(initializedPage.window.document.documentElement.dataset.theme).toBe(
      "dark",
    );
    expect(
      initializedPage.window.document.querySelector('meta[name="theme-color"]'),
    ).toHaveAttribute("content", "#1C1917");
    initializedPage.window.close();
  });

  it("focuses the ticket title on open and restores focus to the opener on close", async () => {
    const user = userEvent.setup();
    render(<App />);

    const newTicketButton = screen.getByRole("button", { name: /new ticket/i });
    await user.click(newTicketButton);
    expect(screen.getByLabelText("Title")).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(newTicketButton).toHaveFocus();
  });
});
