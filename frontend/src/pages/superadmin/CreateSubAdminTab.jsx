import { useEffect, useState } from "react";
import api from "../../services/Api";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

const CreateSubAdminTab = () => {
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  hostel: "",
});
  const [subAdmins, setSubAdmins] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSubAdmins = async () => {
    try {
      const res = await api.get("/auth/subadmins");
      setSubAdmins(res.data);
    } catch {
      showToast("Failed to load sub-admins", "error");
    }
  };

  const fetchHostels = async () => {
    try {
      const res = await api.get("/hostels/all");
      setHostels(res.data);
    } catch {
      showToast("Failed to load hostels", "error");
    }
  };

  useEffect(() => {
    fetchSubAdmins();
    fetchHostels();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", { ...form, role: "subadmin" });
      showToast("Sub-admin created successfully");
      setForm({ name: "", email: "", password: "" });
      fetchSubAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create sub-admin", "error");
    } finally {
      setLoading(false);
    }
  };

  const getHostelName = (hostelId) => {
    const match = hostels.find((h) => h._id === hostelId);
    return match ? match.name : "Not assigned";
  };

  return (
    <div className="hostels-tab">
      {loading && <Loader text="Creating sub-admin..." />}
      {toast && <Error message={toast.message} type={toast.type} />}

      <form className="simple-form" onSubmit={handleSubmit}>
        <h3>Create Sub-Admin Account</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
  type="text"
  name="phone"
  placeholder="Phone Number"
  value={form.phone}
  onChange={handleChange}
  required
/>
        <select
  name="hostel"
  value={form.hostel}
  onChange={handleChange}
  required
>
  <option value="">Select Hostel</option>

  {hostels
    .filter((h) => !h.subAdmin)
    .map((hostel) => (
      <option key={hostel._id} value={hostel._id}>
        {hostel.name}
      </option>
    ))}
</select>
        <button type="submit" className="form-submit-btn">
          Create Sub-Admin
        </button>
      </form>

      <h3 className="group-title">Existing Sub-Admins</h3>
      {subAdmins.length === 0 ? (
        <p className="empty-state">No sub-admins yet.</p>
      ) : (
        <div className="hostels-grid">
          {subAdmins.map((sa) => (
            <div className="hostel-admin-card" key={sa._id}>
              <h4>{sa.name}</h4>
              <p>{sa.email}</p>
              <p className="assigned-subadmin">
                Hostel: {getHostelName(sa.hostel)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateSubAdminTab;