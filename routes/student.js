const router = require("express").Router();
const { getAvailableSlots, bookSlot } = require("../controllers/studentController");
const authorization = require("../middleware/authorization");

// 1. See all free slots (Anyone logged in can see this)
router.get("/available-slots", authorization, getAvailableSlots);

// 2. Book a specific slot
router.post("/book-slot", authorization, bookSlot);

module.exports = router;