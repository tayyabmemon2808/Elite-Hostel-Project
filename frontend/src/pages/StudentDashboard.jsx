import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [myRoom, setMyRoom] = useState(null);
  const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState('');

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/complaints/all');
      const myComplaints = response.data.filter(c => c.student._id === user.id);
      setComplaints(myComplaints);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchMyRoom = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/rooms/my-room/${user.id}`);
    setMyRoom(response.data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchComplaints();
    fetchMyRoom();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  if (!title || !description) {
    setMessage('Please fill both title and description');
    return;
  }

  setLoading(true);

  try {
    await axios.post('http://localhost:3000/api/complaints/file', {
      student: user.id,
      block: user.block,
      title,
      description
    });

    setLoading(false);
    setSuccess('Complaint filed successfully!');
    setTitle('');
    setDescription('');
    fetchComplaints();

    setTimeout(() => setSuccess(''), 1500);

  } catch (err) {
    setMessage(err.response?.data?.message || 'Something went wrong');
    setLoading(false);
  }
};
  if (loading) return <Loader text="Please wait..." />;
  return (
    <div className='container'>
     <Navbar title="Student Dashboard" />
     {success && (
  <div className="loader-overlay">
    <div className="success-box">
      <p>✅ {success}</p>
    </div>
  </div>
)}
      <p>Welcome, {user.name}! (Block: {user.block})</p>

      <h3>My Room</h3>
{myRoom ? (
  <div className="room-info">
    <p><strong>Room:</strong> {myRoom.roomNumber}</p>
    <p><strong>Roommates:</strong> {
      myRoom.studentsAllotted
        .filter(s => s._id !== user.id)
        .map(s => s.name)
        .join(', ') || 'None yet'
    }</p>
  </div>
) : (
  <p>You have not been allotted a room yet.</p>
)}

      <h3>File a Complaint</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Describe your complaint"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">Submit Complaint</button>
      </form>

      <h3>My Complaints</h3>
      {complaints.length === 0 && <p>No complaints filed yet.</p>}
      <ul>
        {complaints.map((c) => (
          <li key={c._id}>
            <strong>{c.title}</strong> — {c.status} <br />
            {c.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;