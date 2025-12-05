const router = require("express").Router();
// Import the new functions
const { createSlot, getMySlots, getRequests, acceptRequest } = require("../controllers/teacherController");
const authorization = require("../middleware/authorization");

router.post("/create-slot", authorization, createSlot);
router.get("/my-slots", authorization, getMySlots);

// NEW ROUTES
router.get("/requests", authorization, getRequests);      // View incoming requests
router.put("/accept-request", authorization, acceptRequest); // Accept a request

module.exports = router;