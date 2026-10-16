import { TICKET_STATUSES } from "../services/ticketOperations.js";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function TicketTable({ tickets, onEdit, onDelete, onStatusChange }) {
  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-mark" aria-hidden="true">
          ✓
        </span>
        <h3>No tickets match your search</h3>
        <p>Try a different search term or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="ticket-table">
        <caption className="visually-hidden">
          Support tickets with requester, priority, status, creation date, and
          available actions
        </caption>
        <thead>
          <tr>
            <th scope="col">Ticket</th>
            <th scope="col">Requester</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td data-label="Ticket">
                <div className="ticket-title-cell">
                  <span className="ticket-id">{ticket.id}</span>
                  <strong>{ticket.title}</strong>
                  {ticket.description && (
                    <span className="ticket-description">{ticket.description}</span>
                  )}
                </div>
              </td>
              <td data-label="Requester">{ticket.requester}</td>
              <td data-label="Priority">
                <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                  <span aria-hidden="true" />
                  {ticket.priority}
                </span>
              </td>
              <td data-label="Status">
                <label className="visually-hidden" htmlFor={`status-${ticket.id}`}>
                  Change status for {ticket.id}
                </label>
                <select
                  className={`status-select status-${ticket.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                  id={`status-${ticket.id}`}
                  value={ticket.status}
                  onChange={(event) =>
                    onStatusChange(ticket.id, event.target.value)
                  }
                >
                  {TICKET_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td data-label="Created">
                <time dateTime={ticket.createdAt}>
                  {dateFormatter.format(new Date(ticket.createdAt))}
                </time>
              </td>
              <td data-label="Actions">
                <div className="row-actions">
                  {ticket.status !== "Resolved" && (
                    <button
                      className="row-action row-action-resolve"
                      type="button"
                      onClick={() => onStatusChange(ticket.id, "Resolved")}
                      aria-label={`Resolve ${ticket.id}`}
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    className="row-action"
                    type="button"
                    onClick={() => onEdit(ticket)}
                    aria-label={`Edit ${ticket.id}`}
                  >
                    Edit
                  </button>
                  <button
                    className="row-action row-action-delete"
                    type="button"
                    onClick={() => onDelete(ticket)}
                    aria-label={`Delete ${ticket.id}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
