const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 1. Get the token from the header
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    // 2. Verify the token
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    // 3. If verified, attach the user info to the request
    req.user = payload; // payload contains { user_id, role }
    
    next(); // Continue to the next step
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized");
  }
};