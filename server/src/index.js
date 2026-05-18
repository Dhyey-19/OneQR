const express = require("express");
const cors = require("cors");
require("dotenv").config();

const config = require("./config/config");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
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
