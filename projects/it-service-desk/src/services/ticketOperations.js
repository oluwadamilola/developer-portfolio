export const TICKET_STATUSES = ["Open", "In Progress", "Resolved"];
export const TICKET_PRIORITIES = ["Low", "Medium", "High"];

export function validateTicketForm(values) {
  const errors = {};
  const title = values.title.trim();
  const requester = values.requester.trim();
  const description = values.description.trim();

  if (!title) {
    errors.title = "Enter a ticket title.";
  } else if (title.length > 120) {
    errors.title = "Use 120 characters or fewer.";
  }

  if (!requester) {
    errors.requester = "Enter a requester name.";
  } else if (requester.length > 80) {
    errors.requester = "Use 80 characters or fewer.";
  }

  if (!TICKET_PRIORITIES.includes(values.priority)) {
    errors.priority = "Choose a valid priority.";
  }

  if (description.length > 500) {
    errors.description = "Use 500 characters or fewer.";
  }

  return errors;
}

export function createTicket(tickets, values, createdAt = new Date()) {
  const numericIds = tickets
    .map((ticket) => Number(ticket.id.replace(/^SD-/, "")))
    .filter(Number.isFinite);
  const nextNumber = Math.max(1000, ...numericIds) + 1;

  return {
    id: `SD-${String(nextNumber).padStart(4, "0")}`,
    title: values.title.trim(),
    requester: values.requester.trim(),
    description: values.description.trim(),
    priority: values.priority,
    status: "Open",
    createdAt: createdAt.toISOString(),
  };
}

export function updateTicket(tickets, ticketId, changes) {
  let found = false;
  const updatedTickets = tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;
    found = true;
    return { ...ticket, ...changes };
  });

  if (!found) {
    throw new Error(`Ticket ${ticketId} was not found.`);
  }

  return updatedTickets;
}

export function deleteTicket(tickets, ticketId) {
  const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);

  if (updatedTickets.length === tickets.length) {
    throw new Error(`Ticket ${ticketId} was not found.`);
  }

  return updatedTickets;
}

export function filterTickets(tickets, { search, status, priority }) {
  const query = search.trim().toLowerCase();

  return tickets.filter((ticket) => {
    const matchesSearch =
      !query ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query);
    const matchesStatus = status === "All statuses" || ticket.status === status;
    const matchesPriority =
      priority === "All priorities" || ticket.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

export function isTicket(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    /^SD-\d{4,}$/.test(value.id) &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    value.title.length <= 120 &&
    typeof value.requester === "string" &&
    value.requester.trim().length > 0 &&
    value.requester.length <= 80 &&
    typeof value.description === "string" &&
    value.description.length <= 500 &&
    TICKET_PRIORITIES.includes(value.priority) &&
    TICKET_STATUSES.includes(value.status) &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt))
  );
}
