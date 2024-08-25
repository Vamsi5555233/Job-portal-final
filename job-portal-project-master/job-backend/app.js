require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const providerRoutes = require("./routes/provider");
const userRoutes = require("./routes/user");

const app = express();

// Use environment variable for MongoDB URI and Port
const MONGO_URI = process.env.MONGO_URI || `mongodb+srv://praveenterax:NblCRcF6hjo1BC3s@cluster0.nrfyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// Route Middleware
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/provider", providerRoutes);
app.use("/user", userRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API");
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
