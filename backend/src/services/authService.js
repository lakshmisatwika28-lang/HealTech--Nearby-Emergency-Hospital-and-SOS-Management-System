import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDatabase } from "../config/database.js";

const ensureUsersTable = async () => {
  const db = getDatabase();
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const authService = {
  async init() { await ensureUsersTable(); },

  async register({ name, email, password }) {
    await ensureUsersTable();
    const db = getDatabase();
    const cleanEmail = email.trim().toLowerCase();
    if (!name?.trim() || !cleanEmail || !password || password.length < 6) {
      throw new Error("Name, email and a password of at least 6 characters are required.");
    }
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
    if (existing.length) throw new Error("An account with this email already exists.");
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name,email,password_hash) VALUES (?,?,?)",
      [name.trim(), cleanEmail, hash]
    );
    return { id: result.insertId, name: name.trim(), email: cleanEmail };
  },

  async login({ email, password }) {
    await ensureUsersTable();
    const db = getDatabase();
    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [cleanEmail]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      throw new Error("Invalid email or password.");
    }
    return {
      token: crypto.randomBytes(24).toString("hex"),
      user: { id: rows[0].id, name: rows[0].name, email: rows[0].email }
    };
  }
};

export default authService;
