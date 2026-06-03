const express = require("express");
const compression = require("compression");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const config = require("./config/config");
const routes = require("./routes");
const profileController = require("./controllers/profileController");

const app = express();

// Enable Gzip compression to speed up payload delivery
app.use(compression());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use("/api", routes);

// QR Redirect Route
app.get("/qr/:qrId", profileController.handleQrRedirect);

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
