// routes/userRoute.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const admin = require("../models/admin");

// Route to register user
router.post("/register", async (req, res) => {
  const user = req.body;
  console.log(user);
  try {
    const newUser = await new User(req.body);
    await newUser.save();

    // Save the user to the database
    await newUser.save();
    res.json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const foundAdmin = await admin.findOne({ username: username });

    if (!foundAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate password (in this case, just a direct comparison)
    if (foundAdmin.password === password) {
      return res
        .status(200)
        .json({ success: true, message: "Login successful!", role:"admin" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/getAllData", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ message: "all users", users });
});

module.exports = router;
