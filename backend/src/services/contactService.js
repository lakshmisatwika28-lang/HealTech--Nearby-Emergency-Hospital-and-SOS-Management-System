import { getDatabase } from "../config/database.js";
import EmergencyContact from "../models/EmergencyContact.js";

const contactService = {
  async getAllContacts() {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM emergency_contacts
       ORDER BY created_at DESC`
    );

    return rows.map((row) => new EmergencyContact(row));
  },

  async getContactById(id) {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM emergency_contacts
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return new EmergencyContact(rows[0]);
  },

  async createContact({ name, phone, relationship }) {
    const db = getDatabase();

    const [result] = await db.query(
      `INSERT INTO emergency_contacts
       (name, phone, relationship)
       VALUES (?, ?, ?)`,
      [name, phone, relationship || null]
    );

    return this.getContactById(result.insertId);
  },

  async updateContact(id, { name, phone, relationship }) {
    const db = getDatabase();

    const [result] = await db.query(
      `UPDATE emergency_contacts
       SET name = ?,
           phone = ?,
           relationship = ?
       WHERE id = ?`,
      [name, phone, relationship || null, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getContactById(id);
  },

  async deleteContact(id) {
    const db = getDatabase();

    const [result] = await db.query(
      `DELETE FROM emergency_contacts
       WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }
};

export default contactService;