const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const Admin = require("./models/admin"); // Ensure the correct model import and capitalization

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // for parsing JSON bodies
app.use(cors()); // to handle Cross-Origin Resource Sharing
app.use("/api", userRoute);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");

    // Automatically create the admin once after connection
    const username = "atul@gmail.com";
    const password = "atul";

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      const newAdmin = new Admin({ username, password });
      await newAdmin.save();
      console.log("Admin created successfully!");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Call connectDB to establish the MongoDB connection
connectDB();

// Get PORT from environment variables or use default
const PORT = process.env.PORT || 5000;

// Basic route for testing the server
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB!");
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
