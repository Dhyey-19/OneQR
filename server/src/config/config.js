module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  DB_URL: process.env.DB_URL || "",
  API_VERSION: process.env.API_VERSION || "v1",
  JWT_SECRET: process.env.JWT_SECRET || "one_qr_secret_key_change_me_in_prod",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
};

