const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const config = require("./config/config");
const routes = require("./routes");

const app = express();

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// CORS configuration
const allowedOrigins = typeof config.CORS_ORIGIN === "string"
  ? config.CORS_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:5173"];

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

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
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

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR CAPTURED:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
