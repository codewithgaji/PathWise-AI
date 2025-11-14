const dotenv = require("dotenv");
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(helmet());

// CORS CONFIGURATION
app.use(
  cors({
    origin: [
      "https://path-wise-ai.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(morgan("dev"));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/users", userRoutes);

// Connection
const PORT = process.env.PORT || 1180;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});