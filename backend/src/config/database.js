import mysql from "mysql2/promise";
import env from "./env.js";

let pool;

const connectDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,

      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false
            }
          : undefined,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const connection = await pool.getConnection();

    console.log("✅ MySQL connected successfully");
    console.log(`📦 Database: ${env.dbName}`);

    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:");
    console.error(error.message);

    throw error;
  }
};

export const getDatabase = () => {
  if (!pool) {
    throw new Error("Database has not been initialized.");
  }

  return pool;
};

export default connectDatabase;