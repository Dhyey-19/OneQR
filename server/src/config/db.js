const mongoose = require("mongoose");
const { DB_URL } = require("./config");

const connectDB = async () => {
  try {
    if (!DB_URL) {
      console.error("DB_URL is not defined in config.js");
      process.exit(1);
    }
    const conn = await mongoose.connect(DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log("Continuing server execution without database connection...");
  }
};

module.exports = connectDB;
