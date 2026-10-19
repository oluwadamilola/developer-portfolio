import { useEffect, useRef, useState } from "react";
import {
  TICKET_PRIORITIES,
  validateTicketForm,
} from "../services/ticketOperations.js";

function TicketForm({ ticket, onCancel, onSubmit }) {
  const titleInputRef = useRef(null);
  const [values, setValues] = useState({
    title: ticket?.title ?? "",
    requester: ticket?.requester ?? "",
    description: ticket?.description ?? "",
    priority: ticket?.priority ?? "Medium",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validateTicketForm(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(values);
    }
  }

  return (
    <section className="ticket-form-panel" aria-labelledby="ticket-form-title">
      <div className="form-heading">
        <div>
          <p className="eyebrow">Ticket details</p>
          <h3 id="ticket-form-title">
            {ticket ? `Edit ${ticket.id}` : "Create a ticket"}
          </h3>
        </div>
        <button className="icon-button" type="button" onClick={onCancel}>
          Close
        </button>
      </div>

      <form className="ticket-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="ticket-title">Title</label>
          <input
            ref={titleInputRef}
            id="ticket-title"
            name="title"
            value={values.title}
            onChange={updateValue}
            maxLength={120}
            required
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "ticket-title-error" : undefined}
          />
          {errors.title && (
            <span className="field-error" id="ticket-title-error">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="ticket-requester">Requester</label>
          <input
            id="ticket-requester"
            name="requester"
            value={values.requester}
            onChange={updateValue}
            maxLength={80}
            required
            aria-invalid={Boolean(errors.requester)}
            aria-describedby={
              errors.requester ? "ticket-requester-error" : undefined
            }
          />
          {errors.requester && (
            <span className="field-error" id="ticket-requester-error">
              {errors.requester}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="ticket-priority">Priority</label>
          <select
            id="ticket-priority"
            name="priority"
            value={values.priority}
            onChange={updateValue}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={
              errors.priority ? "ticket-priority-error" : undefined
            }
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
          {errors.priority && (
            <span className="field-error" id="ticket-priority-error">
              {errors.priority}
            </span>
          )}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="ticket-description">
            Description <span className="optional-label">(optional)</span>
          </label>
          <textarea
            id="ticket-description"
            name="description"
            value={values.description}
            onChange={updateValue}
            maxLength={500}
            rows={3}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "ticket-description-error" : undefined
            }
          />
          {errors.description && (
            <span className="field-error" id="ticket-description-error">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-actions form-field-wide">
          <button className="button button-subtle" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            {ticket ? "Save changes" : "Create ticket"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TicketForm;
