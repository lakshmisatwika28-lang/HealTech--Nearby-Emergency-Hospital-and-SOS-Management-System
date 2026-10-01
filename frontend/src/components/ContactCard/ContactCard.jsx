import React from "react";
import "./ContactCard.css";

const ContactCard = ({
  contact,
  onEdit,
  onDelete
}) => {
  if (!contact) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("");
  };

  return (
    <div className="contact-card">

      <div className="contact-avatar">
        {getInitials(contact.name)}
      </div>

      <div className="contact-details">

        <div className="contact-name-row">

          <h3>
            {contact.name}
          </h3>

          {contact.relationship && (
            <span className="contact-relationship">
              {contact.relationship}
            </span>
          )}

        </div>

        <a
          href={`tel:${contact.phone}`}
          className="contact-phone"
        >
          <span>☎</span>
          {contact.phone}
        </a>

      </div>

      <div className="contact-actions">

        <a
          href={`tel:${contact.phone}`}
          className="contact-action contact-call"
          title="Call contact"
          aria-label={`Call ${contact.name}`}
        >
          ☎
        </a>

        {onEdit && (
          <button
            type="button"
            className="contact-action contact-edit"
            onClick={() =>
              onEdit(contact)
            }
            title="Edit contact"
            aria-label={`Edit ${contact.name}`}
          >
            ✎
          </button>
        )}

        <button
          type="button"
          className="contact-action contact-delete"
          onClick={() =>
            onDelete(contact.id)
          }
          title="Delete contact"
          aria-label={`Delete ${contact.name}`}
        >
          ×
        </button>

      </div>

    </div>
  );
};

export default ContactCard;