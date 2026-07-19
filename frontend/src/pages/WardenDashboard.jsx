import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
function WardenDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [complaints, setComplaints] = useState([]);
const [rooms, setRooms] = useState([]);
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState('');
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/complaints/block/${user.block}`);
      setComplaints(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRooms = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/rooms/block/${user.block}`);
    setRooms(response.data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchComplaints();
    fetchRooms()
  }, []);

const handleResolve = async (id) => {
  setLoading(true);
  try {
    await axios.put(`http://localhost:3000/api/complaints/resolve/${id}`);
    setLoading(false);
    setSuccess('Complaint resolved successfully!');
    fetchComplaints();
    setTimeout(() => setSuccess(''), 1500);
  } catch (err) {
    setLoading(false);
    console.log(err);
  }
};
if (loading) return <Loader text="Please wait..." />;
  return (
    <div className='container'>
     <Navbar title="Warden Dashboard" />
     {success && (
  <div className="loader-overlay">
    <div className="success-box">
      <p>✅ {success}</p>
    </div>
  </div>
)}
      <p>Welcome, {user.name}! (Block: {user.block})</p>

      <h3>Rooms in {user.block}</h3>
{rooms.length === 0 && <p>No rooms in your block.</p>}
<ul>
  {rooms.map((r) => (
    <li key={r._id}>
      {r.roomNumber} — Capacity: {r.capacity} — Status: {r.status} <br />
      Students: {r.studentsAllotted.length > 0
        ? r.studentsAllotted.map(s => s.name).join(', ')
        : 'None'}
    </li>
  ))}
</ul>

      <h3>Complaints in {user.block}</h3>
      {complaints.length === 0 && <p>No complaints in your block.</p>}
      <ul>
        {complaints.map((c) => (
          <li key={c._id}>
            <strong>{c.title}</strong> — {c.status} <br />
            By: {c.student.name} ({c.student.email}) <br />
            {c.description} <br />
            {c.status === 'pending' && (
              <button onClick={() => handleResolve(c._id)}>Mark as Resolved</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WardenDashboard;