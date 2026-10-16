import { describe, expect, it } from "vitest";
import demoTickets from "../data/demoTickets.js";
import {
  createTicket,
  deleteTicket,
  filterTickets,
  updateTicket,
  validateTicketForm,
} from "./ticketOperations.js";

describe("ticket operations", () => {
  it("creates the next ticket with trimmed values and an open status", () => {
    const ticket = createTicket(
      demoTickets,
      {
        title: "  New request  ",
        requester: "  Demo User  ",
        description: "  Example details  ",
        priority: "High",
      },
      new Date("2026-10-16T10:00:00.000Z"),
    );

    expect(ticket).toEqual({
      id: "SD-1043",
      title: "New request",
      requester: "Demo User",
      description: "Example details",
      priority: "High",
      status: "Open",
      createdAt: "2026-10-16T10:00:00.000Z",
    });
  });

  it("validates required values and field limits", () => {
    expect(
      validateTicketForm({
        title: " ",
        requester: "",
        description: "x".repeat(501),
        priority: "Urgent",
      }),
    ).toEqual({
      title: "Enter a ticket title.",
      requester: "Enter a requester name.",
      priority: "Choose a valid priority.",
      description: "Use 500 characters or fewer.",
    });
  });

  it("updates and deletes a ticket without mutating the original list", () => {
    const updated = updateTicket(demoTickets, "SD-1042", {
      status: "Resolved",
    });
    const deleted = deleteTicket(updated, "SD-1042");

    expect(demoTickets[0].status).toBe("Open");
    expect(updated[0].status).toBe("Resolved");
    expect(deleted).toHaveLength(demoTickets.length - 1);
    expect(deleted.some((ticket) => ticket.id === "SD-1042")).toBe(false);
  });

  it("filters on ticket id or title, status, and priority", () => {
    expect(
      filterTickets(demoTickets, {
        search: "1042",
        status: "All statuses",
        priority: "All priorities",
      }),
    ).toHaveLength(1);

    expect(
      filterTickets(demoTickets, {
        search: "",
        status: "In Progress",
        priority: "Low",
      }).map((ticket) => ticket.id),
    ).toEqual(["SD-1041", "SD-1038"]);
  });

  it("reports missing ticket updates and deletions", () => {
    expect(() => updateTicket(demoTickets, "SD-9999", { status: "Resolved" }))
      .toThrow("Ticket SD-9999 was not found.");
    expect(() => deleteTicket(demoTickets, "SD-9999")).toThrow(
      "Ticket SD-9999 was not found.",
    );
  });
});
