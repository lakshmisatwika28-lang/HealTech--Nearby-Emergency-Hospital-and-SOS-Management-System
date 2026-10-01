import React, { useEffect, useState } from "react";
import "./ContactForm.css";

const ContactForm = ({
  onSubmit,
  editingContact,
  onCancel,
  submitting = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: ""
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name || "",
        phone: editingContact.phone || "",
        relationship:
          editingContact.relationship || ""
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        relationship: ""
      });
    }

    setFormError("");
  }, [editingContact]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const relationship =
      formData.relationship.trim();

    if (!name || !phone) {
      setFormError(
        "Name and phone number are required."
      );
      return;
    }

    if (phone.length < 7) {
      setFormError(
        "Please enter a valid phone number."
      );
      return;
    }

    try {
      await onSubmit({
        name,
        phone,
        relationship
      });

    } catch (error) {
      console.error(
        "Contact form submission failed:",
        error
      );
    }
  };

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
    >

      <div className="form-title">

        <div className="form-icon">
          {editingContact ? "✎" : "+"}
        </div>

        <div>
          <h2>
            {editingContact
              ? "Edit Emergency Contact"
              : "Add Emergency Contact"}
          </h2>

          <p>
            Add someone you trust for quick
            access during an emergency.
          </p>
        </div>

      </div>

      {formError && (
        <div className="form-error">
          {formError}
        </div>
      )}

      <div className="form-fields">

        <div className="form-group">

          <label htmlFor="contact-name">
            Full Name
          </label>

          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="e.g. Mother"
            value={formData.name}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="name"
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="contact-phone">
            Phone Number
          </label>

          <input
            id="contact-phone"
            type="tel"
            name="phone"
            placeholder="e.g. 9876543210"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="tel"
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="contact-relationship">
            Relationship
          </label>

          <input
            id="contact-relationship"
            type="text"
            name="relationship"
            placeholder="e.g. Mother, Father, Friend"
            value={formData.relationship}
            onChange={handleChange}
            disabled={submitting}
          />

        </div>

      </div>

      <div className="form-buttons">

        {onCancel && (
          <button
            type="button"
            className="cancel-contact"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="save-contact"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : editingContact
              ? "Update Contact"
              : "Save Contact"}
        </button>

      </div>

    </form>
  );
};

export default ContactForm;