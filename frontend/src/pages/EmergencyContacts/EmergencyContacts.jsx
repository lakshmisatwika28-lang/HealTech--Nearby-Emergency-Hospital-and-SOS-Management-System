import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ContactCard from "../../components/ContactCard/ContactCard";
import ContactForm from "../../components/ContactForm/ContactForm";
import contactService from "../../services/contactService";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

import "./EmergencyContacts.css";

const EmergencyContacts = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await contactService.getAllContacts();

      if (response?.success) {
        setContacts(response.data || []);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error(
        "Failed to load contacts:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleSaveContact = async (contactData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingContact) {
        const response =
          await contactService.updateContact(
            editingContact.id,
            contactData
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to update contact."
          );
        }

        setContacts((previousContacts) =>
          previousContacts.map((contact) =>
            contact.id === editingContact.id
              ? response.data
              : contact
          )
        );

        setSuccess(
          "Emergency contact updated successfully."
        );
      } else {
        const response =
          await contactService.createContact(
            contactData
          );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to create contact."
          );
        }

        setContacts((previousContacts) => [
          response.data,
          ...previousContacts
        ]);

        setSuccess(
          "Emergency contact saved successfully."
        );
      }

      setShowForm(false);
      setEditingContact(null);

    } catch (err) {
      console.error(
        "Failed to save contact:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save emergency contact."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleEditContact = (contact) => {
    setError("");
    setSuccess("");

    setEditingContact(contact);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDeleteContact = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this emergency contact?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await contactService.deleteContact(id);

      setContacts((previousContacts) =>
        previousContacts.filter(
          (contact) => contact.id !== id
        )
      );

      setSuccess(
        "Emergency contact deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete contact:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete emergency contact."
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  return (
    <div className="contacts-page">

      <Navbar
        onMenuClick={() =>
          setSidebarOpen(true)
        }
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main className="contacts-main">

        <section className="contacts-header">

          <button
            className="contacts-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <span className="contacts-label">
            SAFETY & EMERGENCY
          </span>

          <div className="contacts-heading-row">

            <div>
              <h1>
                Emergency Contacts
              </h1>

              <p>
                Manage the people who should
                be contacted during an emergency.
              </p>
            </div>

            <button
              className="add-contact-button"
              onClick={() => {
                if (showForm) {
                  handleCloseForm();
                } else {
                  setEditingContact(null);
                  setError("");
                  setSuccess("");
                  setShowForm(true);
                }
              }}
            >
              {showForm
                ? "Close"
                : "+ Add Contact"}
            </button>

          </div>

        </section>

        {error && (
          <div className="contacts-message error-message">
            <span>!</span>
            <p>{error}</p>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="contacts-message success-message">
            <span>✓</span>
            <p>{success}</p>

            <button
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}

        {showForm && (
          <section className="contacts-form-section">

            <ContactForm
              onSubmit={handleSaveContact}
              editingContact={editingContact}
              onCancel={handleCloseForm}
              submitting={saving}
            />

          </section>
        )}

        <section className="contacts-list-section">

          <div className="contacts-section-header">

            <div>
              <h2>
                Your Trusted Contacts
              </h2>

              <p>
                These people can be contacted
                when you need emergency assistance.
              </p>
            </div>

            <span className="contacts-count">
              {contacts.length}
              {" "}
              {contacts.length === 1
                ? "contact"
                : "contacts"}
            </span>

          </div>

          {loading ? (

            <div className="contacts-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading your emergency contacts...
              </p>

            </div>

          ) : contacts.length === 0 ? (

            <div className="contacts-empty">

              <div className="empty-contact-icon">
                👥
              </div>

              <h3>
                No emergency contacts yet
              </h3>

              <p>
                Add someone you trust so they
                can be reached quickly during
                an emergency.
              </p>

              {!showForm && (
                <button
                  className="empty-add-button"
                  onClick={() => {
                    setEditingContact(null);
                    setShowForm(true);
                  }}
                >
                  + Add Your First Contact
                </button>
              )}

            </div>

          ) : (

            <div className="contacts-list">

              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default EmergencyContacts;