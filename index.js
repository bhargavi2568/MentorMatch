const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // Import the database connection

// middleware
app.use(cors());
app.use(express.json()); // Allows us to access req.body (JSON data)

// ROUTES //

// Simple test route to check if server is working
app.get("/", (req, res) => {
    res.send("MentorMatch API is running!");
});

// We will add more routes here later...

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});