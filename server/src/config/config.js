module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  DB_URL: process.env.DB_URL || "",
  API_VERSION: process.env.API_VERSION || "v1",
};
