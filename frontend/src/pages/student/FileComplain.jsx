import { useState } from "react";
import api from "../../services/Api";
import { getUser } from "../../utils/auth";
import Loader from "../../components/Loader/Loader";

function FileComplaint() {
  const user = getUser();
const userId = user._id || user.id; 

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await api.post("/complaints/file", {
        student: userId,
        hostel: user.hostel?._id || user.hostel,
        title: formData.title,
        description: formData.description,
      });
      setSuccess(true);
      setFormData({ title: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to file complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader text="Filing complaint..." />}

      <h3 className="tab-heading">File a Complaint</h3>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">Complaint filed successfully!</div>}

      <form onSubmit={handleSubmit} className="simple-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default FileComplaint;