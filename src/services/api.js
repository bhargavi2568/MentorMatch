const API_URL = "http://localhost:5000";

// HELPER: Automatically add the Token to protected requests
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "token": token // This matches the middleware check in backend
  };
};

/* ==============================
   1. AUTHENTICATION APIS
   ============================== */

export const register = async (name, email, password, role) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  // We return the full response object so the component can check .ok
  return response;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

/* ==============================
   2. TEACHER APIS
   ============================== */

// Create a time slot (e.g., Tuesday 10 AM)
export const createSlot = async (startTime, endTime) => {
  const response = await fetch(`${API_URL}/teacher/create-slot`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ start_time: startTime, end_time: endTime }),
  });
  return response;
};

// View slots created by the logged-in teacher
export const getMySlots = async () => {
  const response = await fetch(`${API_URL}/teacher/my-slots`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

// View incoming booking requests from students
export const getTeacherRequests = async () => {
  const response = await fetch(`${API_URL}/teacher/requests`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

// Accept a student's request
export const acceptRequest = async (bookingId) => {
  const response = await fetch(`${API_URL}/teacher/accept-request`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ booking_id: bookingId }),
  });
  return response;
};

/* ==============================
   3. STUDENT APIS
   ============================== */

// Get all slots that are NOT booked yet
export const getAvailableSlots = async () => {
  const response = await fetch(`${API_URL}/student/available-slots`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
};

// Send a booking request to a teacher
export const bookSlot = async (slotId, teacherId) => {
  const response = await fetch(`${API_URL}/student/book-slot`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ slot_id: slotId, teacher_id: teacherId }),
  });
  return response;
};