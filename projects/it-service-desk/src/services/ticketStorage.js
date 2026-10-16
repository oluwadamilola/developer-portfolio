import demoTickets from "../data/demoTickets.js";
import { isTicket } from "./ticketOperations.js";

export const TICKETS_STORAGE_KEY = "service-desk-tickets";

function copyDemoTickets() {
  return demoTickets.map((ticket) => ({ ...ticket }));
}

export function loadTickets(storage) {
  try {
    const target = storage ?? window.localStorage;
    const savedTickets = target.getItem(TICKETS_STORAGE_KEY);

    if (savedTickets === null) {
      return { tickets: copyDemoTickets(), warning: null };
    }

    const parsedTickets = JSON.parse(savedTickets);

    const hasUniqueIds =
      Array.isArray(parsedTickets) &&
      new Set(parsedTickets.map((ticket) => ticket?.id)).size ===
        parsedTickets.length;

    if (
      !Array.isArray(parsedTickets) ||
      !parsedTickets.every(isTicket) ||
      !hasUniqueIds
    ) {
      return {
        tickets: copyDemoTickets(),
        warning:
          "Saved ticket data was invalid. Demonstration tickets were loaded instead.",
      };
    }

    return { tickets: parsedTickets, warning: null };
  } catch (error) {
    console.warn("Could not load saved tickets.", error);
    return {
      tickets: copyDemoTickets(),
      warning:
        "Saved tickets could not be read. Changes may not persist in this browser.",
    };
  }
}

export function saveTickets(tickets, storage) {
  try {
    const target = storage ?? window.localStorage;
    target.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    return { ok: true, error: null };
  } catch (error) {
    console.warn("Could not save tickets.", error);
    return {
      ok: false,
      error: "Tickets could not be saved. Changes may not persist in this browser.",
    };
  }
}
