import { TICKET_PRIORITIES, TICKET_STATUSES } from "../services/ticketOperations.js";

function TicketFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}) {
  return (
    <div className="ticket-filters">
      <div className="search-field">
        <label className="visually-hidden" htmlFor="ticket-search">
          Search by ticket ID or title
        </label>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="ticket-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tickets"
        />
      </div>
      <div className="filter-field">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option>All statuses</option>
          {TICKET_STATUSES.map((ticketStatus) => (
            <option key={ticketStatus}>{ticketStatus}</option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
        >
          <option>All priorities</option>
          {TICKET_PRIORITIES.map((ticketPriority) => (
            <option key={ticketPriority}>{ticketPriority}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TicketFilters;
