import { useEffect, useState } from "react";
import api from "../../services/Api";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

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
  const [loaderText, setLoaderText] = useState("");
  const [toast, setToast] = useState(null);
   const [showPassword, setShowPassword] = useState(false);

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
    const handleDeleteSubAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin?")) return;
    setLoading(true);
    setLoaderText("Deleting sub-admin...");
    try {
      await api.delete(`/auth/${id}`);
      showToast("User deleted successfully");
      fetchSubAdmins();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete sub-admin", "error");
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
      <div className="password-input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
  />

  <span
    className="password-toggle-icon"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <IoEyeOffOutline size={18} />
    ) : (
      <IoEyeOutline size={18} />
    )}
  </span>
</div>
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
              <div className="hostel-card-actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteSubAdmin(sa._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateSubAdminTab;