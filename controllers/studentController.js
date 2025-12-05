const pool = require("../db");

// 1. GET ALL AVAILABLE SLOTS
// We join with the 'users' table so we can see the Teacher's Name, not just their ID.
const getAvailableSlots = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.slot_id, 
        s.start_time, 
        s.end_time, 
        u.name AS teacher_name,
        u.email AS teacher_email
      FROM availability_slots s
      JOIN users u ON s.teacher_id = u.user_id
      WHERE s.is_booked = FALSE
    `;
    
    const slots = await pool.query(query);
    res.json(slots.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 2. BOOK A SLOT (Send Request)
const bookSlot = async (req, res) => {
  try {
    const { slot_id, teacher_id } = req.body;
    const student_id = req.user.user_id; // From the Token

    // A. Check if already booked (Safety check)
    const checkSlot = await pool.query(
        "SELECT * FROM availability_slots WHERE slot_id = $1 AND is_booked = TRUE",
        [slot_id]
    );
    if (checkSlot.rows.length > 0) {
        return res.status(400).json("This slot is already taken!");
    }

    // B. Create the Booking Request
    const newBooking = await pool.query(
      "INSERT INTO bookings (slot_id, student_id, teacher_id, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [slot_id, student_id, teacher_id]
    );

    res.json(newBooking.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAvailableSlots,
  bookSlot
};