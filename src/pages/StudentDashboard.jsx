import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

function StudentDashboard() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getHeaders = () => ({
    "Content-Type": "application/json",
    "token": localStorage.getItem("token")
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch("http://localhost:5000/student/available-slots", {
        method: "GET",
        headers: getHeaders()
      });
      
      const parseRes = await response.json();

      // SAFETY CHECK: Ensure we actually got an array
      if (Array.isArray(parseRes)) {
        setAvailableSlots(parseRes);
      } else {
        console.error("Backend returned non-array:", parseRes);
        setAvailableSlots([]); // Fallback to empty array
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleBook = async (slot_id, teacher_id) => {
    try {
      const body = { slot_id, teacher_id };
      
      const response = await fetch("http://localhost:5000/student/book-slot", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert("Request Sent! Waiting for teacher to accept.");
        fetchSlots(); 
      } else {
        const errorText = await response.text(); // Read error message
        alert("Booking failed: " + errorText);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p style={{padding:"20px"}}>Loading slots...</p>;

  return (
    <div className="dashboard-container">
      <h2>Available Mentorship Slots</h2>
      <div className="mentor-list">
        {availableSlots.length === 0 ? (
          <p>No mentors available at the moment.</p>
        ) : (
          availableSlots.map(slot => (
            <div key={slot.slot_id} className="mentor-card">
              {/* Optional Chaining (?.) prevents crash if data is missing */}
              <h3>{slot.teacher_name || "Unknown Mentor"}</h3>
              <p><strong>Email:</strong> {slot.teacher_email}</p>
              
              <div className="time-display">
                 {/* Only try to render date if start_time exists */}
                 {slot.start_time && (
                   <>
                     <p>📅 {new Date(slot.start_time).toLocaleDateString()}</p>
                     <p>⏰ {new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(slot.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </p>
                   </>
                 )}
              </div>

              <button 
                className="book-btn"
                onClick={() => handleBook(slot.slot_id, slot.teacher_id)}
              >
                Request Session
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;