import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5000,

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "healtech",
  geminiApiKey: process.env.GEMINI_API_KEY,
  clientUrl:
    process.env.CLIENT_URL ||
    "http://localhost:5173",

  nodeEnv:
    process.env.NODE_ENV ||
    "development",

  googleMapsApiKey:
    process.env.GOOGLE_MAPS_API_KEY || ""
};

export default env;