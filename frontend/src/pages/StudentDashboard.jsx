import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const hostelId = user?.hostel?._id || user?.hostel;

  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [myRoom, setMyRoom] = useState(null);
  const [stayHistory, setStayHistory] = useState([]);
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

  const fetchStayHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/stay-history/my-history/${user.id}`);
      setStayHistory(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchMyRoom();
    fetchStayHistory();
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
        hostel: hostelId,
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

  const handleCheckout = async () => {
    const activeStay = stayHistory.find(s => s.status === 'active');
    if (!activeStay) return;

    if (!window.confirm('Are you sure you want to leave this room?')) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/api/stay-history/checkout/${activeStay._id}`);
      setLoading(false);
      setSuccess('Checked out successfully!');
      fetchMyRoom();
      fetchStayHistory();
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      setLoading(false);
      console.log(err);
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

      <p className="welcome-text">Welcome, {user.name} — {user.hostel?.name || 'No hostel assigned'}</p>

      <div className="section-card">
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
            <div className="card-actions">
              <button className="btn-danger" onClick={handleCheckout}>Leave Room</button>
            </div>
          </div>
        ) : (
          <p>You have not been allotted a room yet.</p>
        )}
      </div>

      <div className="section-card">
        <h3>File a Complaint</h3>
        {message && <p className="error-text">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Describe your complaint"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Submit Complaint</button>
        </form>
      </div>

      <div className="section-card">
        <h3>My Complaints</h3>
        {complaints.length === 0 && <p>No complaints filed yet.</p>}
        <ul className="card-grid">
          {complaints.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong>
              <span className={`badge badge-${c.status}`}>{c.status}</span>
              <br />
              {c.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h3>My Stay History</h3>
        {stayHistory.length === 0 && <p>No stay history yet.</p>}
        <ul className="card-grid">
          {stayHistory.map((s) => (
            <li key={s._id}>
              <strong>Room {s.room?.roomNumber}</strong> — {s.hostel?.name}
              <span className={`badge badge-${s.status}`}>{s.status}</span>
              <br />
              Check-in: {new Date(s.checkInDate).toLocaleDateString()} <br />
              Check-out: {s.checkOutDate ? new Date(s.checkOutDate).toLocaleDateString() : 'Currently staying'} <br />
              Roommates at that time: {
                s.roommatesAtThatTime?.length > 0
                  ? s.roommatesAtThatTime.map(r => r.name).join(', ')
                  : 'None'
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDashboard;