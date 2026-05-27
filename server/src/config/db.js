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

    // Seed admin user
    const Admin = require("../models/Admin");
    const adminPhone = "8200875023";
    const adminPassword = "000000";

    const adminExists = await Admin.findOne({ phone: adminPhone });
    if (!adminExists) {
      console.log("Seeding admin user...");
      const newAdmin = new Admin({
        phone: adminPhone,
        password: adminPassword,
      });
      await newAdmin.save();
      console.log("Admin user seeded successfully!");
    }
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log("Continuing server execution without database connection...");
  }
};

module.exports = connectDB;
