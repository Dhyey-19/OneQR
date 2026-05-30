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

    // Safely drop old unique index on profile user field if it exists
    try {
      const db = conn.connection.db;
      const collections = await db.listCollections({ name: 'PROFILES' }).toArray();
      if (collections.length > 0) {
        const indexes = await db.collection('PROFILES').indexes();
        
        const userIndex = indexes.find(idx => idx.name === 'user_1' && idx.unique);
        if (userIndex) {
          console.log("Dropping old unique index 'user_1' on PROFILES...");
          await db.collection('PROFILES').dropIndex('user_1');
          console.log("Dropped old unique index successfully.");
        }

        const userSlugIndex = indexes.find(idx => idx.name === 'user_1_slug_1');
        if (userSlugIndex && !userSlugIndex.partialFilterExpression) {
          console.log("Dropping old unique index 'user_1_slug_1' on PROFILES to update index configuration...");
          await db.collection('PROFILES').dropIndex('user_1_slug_1');
          console.log("Dropped old unique index user_1_slug_1 successfully.");
        }
      }
    } catch (indexErr) {
      console.error("Index cleanup error (safe to ignore):", indexErr.message);
    }
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log("Continuing server execution without database connection...");
  }
};

module.exports = connectDB;
