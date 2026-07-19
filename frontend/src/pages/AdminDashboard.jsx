import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [block, setBlock] = useState("Block A");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState('');
const [editingRoom, setEditingRoom] = useState(null);
const [editRoomNumber, setEditRoomNumber] = useState('');
const [editBlock, setEditBlock] = useState('');
const [editCapacity, setEditCapacity] = useState('');

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/rooms/all");
      setRooms(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/students",
      );
      setStudents(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/complaints/all",
      );
      setComplaints(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchStudents();
    fetchComplaints();
  }, []);

 const handleAddRoom = async (e) => {
  e.preventDefault();
  setMessage('');

  if (!roomNumber || !capacity) {
    setMessage('Please fill room number and capacity');
    return;
  }

  setLoading(true);

  try {
    await axios.post('http://localhost:3000/api/rooms/add', {
      roomNumber,
      block,
      capacity: Number(capacity)
    });

    setLoading(false);
    setSuccess('Room added successfully!');
    setRoomNumber('');
    setCapacity('');
    fetchRooms();

    setTimeout(() => setSuccess(''), 1500);

  } catch (err) {
    setMessage(err.response?.data?.message || 'Something went wrong');
    setLoading(false);
  }
};
 const handleAllotRoom = async (e) => {
  e.preventDefault();
  setMessage('');

  if (!selectedRoom || !selectedStudent) {
    setMessage('Please select both room and student');
    return;
  }

  const room = rooms.find(r => r._id === selectedRoom);
  if (room.status === 'full') {
    setMessage('This room is already full');
    return;
  }

  setLoading(true);

  try {
    await axios.post('http://localhost:3000/api/rooms/allot', {
      roomId: selectedRoom,
      studentId: selectedStudent
    });

    setLoading(false);
    setSuccess('Room allotted successfully!');
    setSelectedRoom('');
    setSelectedStudent('');
    fetchRooms();

    setTimeout(() => setSuccess(''), 1500);

  } catch (err) {
    setMessage(err.response?.data?.message || 'Something went wrong');
    setLoading(false);
  }
};
const handleDeleteRoom = async (id) => {
  if (!window.confirm('Are you sure you want to delete this room?')) return;

  setLoading(true);
  try {
    await axios.delete(`http://localhost:3000/api/rooms/${id}`);
    setLoading(false);
    setSuccess('Room deleted successfully!');
    fetchRooms();
    setTimeout(() => setSuccess(''), 1500);
  } catch (err) {
    setLoading(false);
    console.log(err);
  }
};
const handleResolveComplaint = async (id) => {
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
const startEdit = (room) => {
  setEditingRoom(room._id);
  setEditRoomNumber(room.roomNumber);
  setEditBlock(room.block);
  setEditCapacity(room.capacity);
};
const handleUpdateRoom = async (e) => {
  e.preventDefault();
  setMessage('');
  setLoading(true);

  try {
    await axios.put(`http://localhost:3000/api/rooms/update/${editingRoom}`, {
      roomNumber: editRoomNumber,
      block: editBlock,
      capacity: Number(editCapacity)
    });

    setLoading(false);
    setSuccess('Room updated successfully!');
    setEditingRoom(null);
    fetchRooms();

    setTimeout(() => setSuccess(''), 1500);

  } catch (err) {
    setMessage(err.response?.data?.message || 'Something went wrong');
    setLoading(false);
  }
};
 if (loading) return <Loader text="Please wait..." />;

  return (
    <div className="container">
      <Navbar title="Admin Dashboard" />

      {success && (
        <div className="loader-overlay">
          <div className="success-box">
            <p>✅ {success}</p>
          </div>
        </div>
      )}

      <p className="welcome-text">Manage rooms, allotments, and complaints across all blocks.</p>

      <div className="section-card">
        <h3>Add New Room</h3>
        {message && <p className="error-text">{message}</p>}
        <form onSubmit={handleAddRoom}>
          <input
            type="text"
            placeholder="Room Number (e.g. A-101)"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
          <select value={block} onChange={(e) => setBlock(e.target.value)}>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <button type="submit">Add Room</button>
        </form>
      </div>

      <div className="section-card">
        <h3>Allot Room to Student</h3>
        <form onSubmit={handleAllotRoom}>
          <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id} disabled={r.status === "full"}>
                {r.roomNumber} ({r.block}) - {r.status}
              </option>
            ))}
          </select>

          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Select Student</option>
            {students
              .filter(s => !rooms.some(r => r.studentsAllotted.some(alloted => alloted._id === s._id)))
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.block})
                </option>
              ))}
          </select>

          <button type="submit">Allot Room</button>
        </form>
      </div>

      <div className="section-card">
        <h3>All Rooms</h3>
        {rooms.length === 0 && <p>No rooms added yet.</p>}
        <ul className="card-grid">
          {rooms.map((r) => (
            <li key={r._id}>
              {editingRoom === r._id ? (
                <form onSubmit={handleUpdateRoom}>
                  <input
                    type="text"
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                  />
                  <select value={editBlock} onChange={(e) => setEditBlock(e.target.value)}>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                  <input
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(e.target.value)}
                  />
                  <div className="card-actions">
                    <button type="submit">Save</button>
                    <button type="button" className="cancel-btn" onClick={() => setEditingRoom(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <strong>{r.roomNumber}</strong> — {r.block}
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                  <br />
                  Capacity: {r.capacity} <br />
                  Students: {r.studentsAllotted.length > 0
                    ? r.studentsAllotted.map((s) => s.name).join(", ")
                    : "None"}
                  <div className="card-actions">
                    <button onClick={() => startEdit(r)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDeleteRoom(r._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h3>All Complaints</h3>
        {complaints.length === 0 && <p>No complaints yet.</p>}
        <ul className="card-grid">
          {complaints.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong>
              <span className={`badge badge-${c.status}`}>{c.status}</span>
              <br />
              Block: {c.block} <br />
              By: {c.student.name} ({c.student.email}) <br />
              {c.description}
              {c.status === 'pending' && (
                <div className="card-actions">
                  <button onClick={() => handleResolveComplaint(c._id)}>Mark as Resolved</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;