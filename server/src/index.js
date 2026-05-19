const express = require("express");
const cors = require("cors");
require("dotenv").config({ override: true });

const config = require("./config/config");
const connectDB = require("./config/db");
const routes = require("./routes");

const app = express();

// Connect to Database
connectDB();

// Middleware
// Parse comma-separated list of origins or fallback to common local development origins
const allowedOrigins = typeof config.CORS_ORIGIN === "string"
  ? config.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === "*") return true;
      return allowed.toLowerCase() === origin.toLowerCase();
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running", status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    status: "error",
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
