import { useEffect, useMemo, useRef, useState } from "react";
import DashboardHeader from "./components/DashboardHeader.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import TicketFilters from "./components/TicketFilters.jsx";
import TicketForm from "./components/TicketForm.jsx";
import TicketTable from "./components/TicketTable.jsx";
import {
  createTicket,
  deleteTicket,
  filterTickets,
  updateTicket,
} from "./services/ticketOperations.js";
import { loadTickets, saveTickets } from "./services/ticketStorage.js";

function App() {
  const [initialData] = useState(loadTickets);
  const [tickets, setTickets] = useState(initialData.tickets);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [formTicket, setFormTicket] = useState(undefined);
  const [feedback, setFeedback] = useState("");
  const [storageError, setStorageError] = useState("");
  const ticketFormOpenerRef = useRef(null);
  const newTicketButtonRef = useRef(null);
  const wasTicketFormOpenRef = useRef(false);

  useEffect(() => {
    const result = saveTickets(tickets);
    setStorageError(result.error || "");
  }, [tickets]);

  useEffect(() => {
    if (formTicket !== undefined) {
      wasTicketFormOpenRef.current = true;
      return;
    }

    if (wasTicketFormOpenRef.current) {
      const returnTarget = ticketFormOpenerRef.current;
      (returnTarget?.isConnected ? returnTarget : newTicketButtonRef.current)?.focus();
      ticketFormOpenerRef.current = null;
      wasTicketFormOpenRef.current = false;
    }
  }, [formTicket]);

  const visibleTickets = useMemo(
    () =>
      filterTickets(tickets, {
        search,
        status: statusFilter,
        priority: priorityFilter,
      })
        .slice()
        .sort(
          (first, second) =>
            Date.parse(second.createdAt) - Date.parse(first.createdAt),
        ),
    [tickets, search, statusFilter, priorityFilter],
  );

  const summary = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "Open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "In Progress")
        .length,
      resolved: tickets.filter((ticket) => ticket.status === "Resolved").length,
    }),
    [tickets],
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", nextTheme === "dark" ? "#1C1917" : "#FAFAF9");
    setTheme(nextTheme);

    try {
      localStorage.setItem("service-desk-theme", nextTheme);
    } catch (error) {
      console.warn("Could not save the theme preference.", error);
      setFeedback("Theme changed, but this browser could not save the preference.");
    }
  }

  function handleTicketSubmit(values) {
    if (formTicket) {
      setTickets((currentTickets) =>
        updateTicket(currentTickets, formTicket.id, {
          title: values.title.trim(),
          requester: values.requester.trim(),
          description: values.description.trim(),
          priority: values.priority,
        }),
      );
      setFeedback(`${formTicket.id} updated.`);
    } else {
      const ticket = createTicket(tickets, values);
      setTickets((currentTickets) => [...currentTickets, ticket]);
      setFeedback(`${ticket.id} created.`);
    }

    setFormTicket(undefined);
  }

  function handleStatusChange(ticketId, status) {
    setTickets((currentTickets) =>
      updateTicket(currentTickets, ticketId, { status }),
    );
    setFeedback(
      status === "Resolved"
        ? `${ticketId} marked as resolved.`
        : `${ticketId} status changed to ${status}.`,
    );
  }

  function handleDelete(ticket) {
    const confirmed = window.confirm(
      `Delete ${ticket.id} — "${ticket.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setTickets((currentTickets) => deleteTicket(currentTickets, ticket.id));
    setFeedback(`${ticket.id} deleted.`);
    if (formTicket?.id === ticket.id) setFormTicket(undefined);
  }

  return (
    <div className="dashboard-shell" id="dashboard">
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <DashboardHeader theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" className="dashboard-main">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Operations overview</p>
            <h1>IT Service Desk</h1>
            <p className="page-intro">
              A clear view of incoming requests and their progress.
            </p>
          </div>
          <button
            ref={newTicketButtonRef}
            className="button button-primary add-ticket-button"
            type="button"
            onClick={() => {
              ticketFormOpenerRef.current = newTicketButtonRef.current;
              setFormTicket(null);
              setFeedback("");
            }}
          >
            <span aria-hidden="true">＋</span>
            New ticket
          </button>
        </div>

        <aside className="demo-notice" aria-label="Demonstration data notice">
          <span className="notice-icon" aria-hidden="true">
            i
          </span>
          <p>
            <strong>Demonstration data.</strong> These sample tickets are
            fictional and stored only in this browser.
          </p>
        </aside>

        {initialData.warning && (
          <p className="storage-notice" role="status">
            {initialData.warning}
          </p>
        )}
        {storageError && (
          <p className="storage-notice storage-notice-error" role="status">
            {storageError}
          </p>
        )}
        {feedback && (
          <p className="action-feedback" role="status" aria-live="polite">
            {feedback}
          </p>
        )}

        <section className="summary-grid" aria-label="Ticket summary">
          <SummaryCard label="Total tickets" value={summary.total} tone="total" />
          <SummaryCard label="Open" value={summary.open} tone="open" />
          <SummaryCard
            label="In progress"
            value={summary.inProgress}
            tone="progress"
          />
          <SummaryCard
            label="Resolved"
            value={summary.resolved}
            tone="resolved"
          />
        </section>

        {formTicket !== undefined && (
          <TicketForm
            key={formTicket?.id ?? "new-ticket"}
            ticket={formTicket}
            onCancel={() => setFormTicket(undefined)}
            onSubmit={handleTicketSubmit}
          />
        )}

        <section className="ticket-section" aria-labelledby="ticket-list-title">
          <div className="ticket-section-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h2 id="ticket-list-title">Tickets</h2>
            </div>
            <span className="result-count">
              {visibleTickets.length}{" "}
              {visibleTickets.length === 1 ? "ticket" : "tickets"}
            </span>
          </div>
          <TicketFilters
            search={search}
            status={statusFilter}
            priority={priorityFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
          <TicketTable
            tickets={visibleTickets}
            onEdit={(ticket) => {
              ticketFormOpenerRef.current = document.activeElement;
              setFormTicket(ticket);
              setFeedback("");
            }}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </section>
      </main>
      <footer className="dashboard-footer">
        <span>Service Desk Dashboard</span>
        <span>Local demonstration · No live support data</span>
      </footer>
    </div>
  );
}

export default App;
