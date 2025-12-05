const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // <--- ADD THIS LINE
require("dotenv").config();
// REGISTER USER
const registerUser = async (req, res) => {
  try {
    // 1. Destructure the data coming from the user (Frontend)
    const { name, email, password, role } = req.body;

    // 2. Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists!");
    }

    // 3. Bcrypt the password (Encrypt it)
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Insert the new user into the Database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, role]
    );
    
    // 5. (Optional) If Teacher, create an empty profile for them immediately
    if (role === 'teacher') {
        await pool.query(
            "INSERT INTO teacher_profiles (user_id) VALUES ($1)", 
            [newUser.rows[0].user_id]
        );
    }

    // 6. Respond to the frontend
    res.json(newUser.rows[0]);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 2. Check if incoming password matches the database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password // The encrypted password from DB
    );

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    // 3. Generate the JWT Token (The "ID Card")
    // We put the user_id and role inside the token so we know who they are later
    const token = jwt.sign(
      { 
        user_id: user.rows[0].user_id,
        role: user.rows[0].role 
      },
      process.env.jwtSecret,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // 4. Send token to user
    res.json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update exports to include loginUser
module.exports = {
    registerUser,
    loginUser 
};