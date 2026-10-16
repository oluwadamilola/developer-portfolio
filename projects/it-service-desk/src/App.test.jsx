import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { TICKETS_STORAGE_KEY } from "./services/ticketStorage.js";

describe("service desk dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  afterEach(() => {
    cleanup();
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
  });
});
