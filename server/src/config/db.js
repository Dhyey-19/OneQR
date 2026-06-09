const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    if (!config.DB_URL) {
      console.error("DB_URL is not defined in config.js");
      process.exit(1);
    }
    const conn = await mongoose.connect(config.DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host} | DB Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log("Continuing server execution without database connection...");
  }
};

module.exports = connectDB;
