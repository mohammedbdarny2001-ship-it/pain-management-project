const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const usersRoute = require("./routes/users.route");
const painReportsRoute = require("./routes/painReports.route");
const doctorNotesRoute = require("./routes/doctorNotes.route");
const medicationsRoute = require("./routes/medications.route");
const chatbotRoute = require("./routes/chatbot.route");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Prevent browser cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Basic rate limit
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(apiLimiter);
app.use("/api/users", usersRoute);
app.use("/api/pain-reports", painReportsRoute);
app.use("/api/doctor-notes", doctorNotesRoute);
app.use("/api/medications", medicationsRoute);
app.use("/api/chatbot", chatbotRoute);

// Test route
app.get("/", (req, res) => {
  res.send("PainCare Assistant server is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});