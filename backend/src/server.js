import express from "express";
import cors from "cors";

import contactRoutes from "./routes/contactRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import emergencyTripRoutes from "./routes/emergencyTripRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
import authService from "./services/authService.js";

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HEALTECH backend is running 🚑",
    environment: env.nodeEnv
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", async (req, res) => {
  try {
    const { getDatabase } = await import("./config/database.js");

    const db = getDatabase();

    await db.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "OK",
      service: "HEALTECH Backend",
      database: "MySQL connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "ERROR",
      service: "HEALTECH Backend",
      database: "MySQL connection failed",
      error: error.message
    });
  }
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/emergency-trips", emergencyTripRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/ambulance", ambulanceRoutes);

app.use("/api/emergency", emergencyRoutes);

app.use("/api/contacts", contactRoutes);

app.use("/api/hospitals", hospitalRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);

// ===============================
// START SERVER
// ===============================

const startServer = async () => {
  try {
    await connectDatabase();

    await authService.init();

    app.listen(env.port, () => {
      console.log("================================");
      console.log("🚑 HEALTECH BACKEND");
      console.log("================================");
      console.log(`🚀 Server: http://localhost:${env.port}`);
      console.log(`❤️ Health: http://localhost:${env.port}/api/health`);
      console.log(`🗄️ Database: MySQL`);
      console.log("================================");
    });
  } catch (error) {
    console.error("❌ Server startup failed.");
    console.error(error);
    process.exit(1);
  }
};

startServer();