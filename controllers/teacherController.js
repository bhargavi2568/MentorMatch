const pool = require("../db");

// CREATE A SLOT
const createSlot = async (req, res) => {
  try {
    // 1. Get the data from the frontend (Body)
    const { start_time, end_time } = req.body;

    // 2. Get the teacher's ID from the "req.user" 
    // (This was added by our middleware! Magic!)
    const teacher_id = req.user.user_id;

    // 3. Insert into Database
    const newSlot = await pool.query(
      "INSERT INTO availability_slots (teacher_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
      [teacher_id, start_time, end_time]
    );

    res.json(newSlot.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET ALL SLOTS FOR A SPECIFIC TEACHER
// (We will use this later so the teacher can see what they created)
const getMySlots = async (req, res) => {
    try {
        const teacher_id = req.user.user_id;
        
        const slots = await pool.query(
            "SELECT * FROM availability_slots WHERE teacher_id = $1 ORDER BY start_time",
            [teacher_id]
        );
        
        res.json(slots.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}
// ... (previous code above) ...

// 3. VIEW PENDING REQUESTS
const getRequests = async (req, res) => {
    try {
        const teacher_id = req.user.user_id;

        // We join 3 tables! Bookings + Users (Student info) + Slots (Time info)
        const query = `
            SELECT 
                b.booking_id,
                b.status,
                u.name AS student_name,
                u.email AS student_email,
                s.start_time,
                s.end_time
            FROM bookings b
            JOIN users u ON b.student_id = u.user_id
            JOIN availability_slots s ON b.slot_id = s.slot_id
            WHERE b.teacher_id = $1 AND b.status = 'pending'
        `;

        const requests = await pool.query(query, [teacher_id]);
        res.json(requests.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 4. ACCEPT REQUEST (The Magic Transaction)
const acceptRequest = async (req, res) => {
    const client = await pool.connect(); // We need a specific client for transactions
    try {
        const { booking_id } = req.body;
        
        // START TRANSACTION
        await client.query('BEGIN');

        // A. Mark the Booking as 'confirmed'
        // We also grab the slot_id so we know which slot to hide
        const updateBooking = await client.query(
            "UPDATE bookings SET status = 'confirmed' WHERE booking_id = $1 RETURNING slot_id",
            [booking_id]
        );
        
        if (updateBooking.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.json("Booking not found");
        }

        const slot_id = updateBooking.rows[0].slot_id;

        // B. Mark the Slot as Booked (Hides it from search!)
        await client.query(
            "UPDATE availability_slots SET is_booked = TRUE WHERE slot_id = $1",
            [slot_id]
        );

        // C. (Optional) Auto-reject other pending requests for the same slot
        await client.query(
            "UPDATE bookings SET status = 'rejected' WHERE slot_id = $1 AND booking_id != $2",
            [slot_id, booking_id]
        );

        // COMMIT (Save everything)
        await client.query('COMMIT');

        res.json({ message: "Request Accepted! Slot is now hidden." });

    } catch (err) {
        await client.query('ROLLBACK'); // Undo if error
        console.error(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release(); // Release the client back to the pool
    }
};

// DON'T FORGET TO EXPORT THEM!
module.exports = {
  createSlot,
  getMySlots,
  getRequests,  // <--- Add this
  acceptRequest // <--- Add this
};