import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  XAI_API_KEY: process.env.XAI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
}