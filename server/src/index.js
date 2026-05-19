require("dotenv").config({ override: true });
const config = require("./config/config");
const connectDB = require("./config/db");
const app = require("./app");

// Connect to Database
connectDB();

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

