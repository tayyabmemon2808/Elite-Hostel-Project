import { useEffect, useState } from "react";
import api from "../../services/Api";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";
import { getImageUrl } from "../../utils/imageUrl";
import { FiImage, FiCamera, FiX } from "react-icons/fi";

const emptyForm = {
  name: "",
  city: "",
  address: "",
  description: "",
  singleRoomPrice: "",
  sharedRoomPrice: "",
  images: "",
};

const HostelsTab = () => {
  const [hostels, setHostels] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [toast, setToast] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [imageFiles, setImageFiles] = useState({});
  const [imageInputFiles, setImageInputFiles] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHostels = async () => {
    try {
      const res = await api.get("/hostels/all");
      setHostels(res.data);
    } catch {
      showToast("Failed to load hostels", "error");
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const res = await api.get("/auth/subadmins");
      setSubAdmins(res.data);
    } catch {
      showToast("Failed to load sub-admins", "error");
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchSubAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddHostel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoaderText("Adding hostel...");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("description", form.description);
      formData.append("singleRoomPrice", Number(form.singleRoomPrice));
      formData.append("sharedRoomPrice", Number(form.sharedRoomPrice));

      imageInputFiles.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/hostels/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Hostel added successfully");
      setForm(emptyForm);
      setImageInputFiles([]);
      fetchHostels();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add hostel", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (hostel) => {
    setEditHostel(hostel);
    setEditForm({
      name: hostel.name || "",
      city: hostel.city || "",
      address: hostel.address || "",
      description: hostel.description || "",
      singleRoomPrice: hostel.singleRoomPrice || "",
      sharedRoomPrice: hostel.sharedRoomPrice || "",
      images: (hostel.images || []).join(", "),
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateHostel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoaderText("Updating hostel...");
    try {
      const payload = {
        ...editForm,
        singleRoomPrice: Number(editForm.singleRoomPrice),
        sharedRoomPrice: Number(editForm.sharedRoomPrice),
        images: editForm.images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0),
      };
      await api.put(`/hostels/update/${editHostel._id}`, payload);
      showToast("Hostel updated successfully");
      setEditModalOpen(false);
      fetchHostels();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update hostel",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHostel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    setLoading(true);
    setLoaderText("Deleting hostel...");
    try {
      await api.delete(`/hostels/${id}`);
      showToast("Hostel deleted successfully");
      fetchHostels();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete hostel",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubAdmin = async (hostelId, subAdminId) => {
    if (!subAdminId) return;
    setLoading(true);
    try {
      await api.put(`/hostels/assign-subadmin/${hostelId}`, { subAdminId });
      showToast("Sub-admin assigned successfully");
      fetchHostels();
      fetchSubAdmins();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to assign sub-admin",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSubAdmins = (hostelId) => {
    return subAdmins.filter(
      (sa) =>
        !sa.hostel || sa.hostel === hostelId || sa.hostel?._id === hostelId,
    );
  };

  const getAssignedSubAdminName = (hostelId) => {
    const match = subAdmins.find((sa) => sa.hostel === hostelId);
    return match ? match.name : null;
  };

  const getAssignedSubAdminId = (hostelId) => {
    const match = subAdmins.find((sa) => sa.hostel === hostelId);
    return match ? match._id : null;
  };

  const handleHostelImageUpload = async (hostelId) => {
    const file = imageFiles[hostelId];
    if (!file) {
      showToast("Please select an image first", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.put(`/hostels/upload-image/${hostelId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Image uploaded successfully");
      setImageFiles({ ...imageFiles, [hostelId]: null });
      fetchHostels();
    } catch (err) {
      showToast("Failed to upload image", "error");
    }
  };

  return (
    <div className="hostels-tab">
      {loading && <Loader text={loaderText} />}
      {toast && <Error message={toast.message} type={toast.type} />}

      <form className="simple-form" onSubmit={handleAddHostel}>
        <h3>Add New Hostel</h3>
        <input
          type="text"
          name="name"
          placeholder="Hostel Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="singleRoomPrice"
          placeholder="Single Room Price"
          value={form.singleRoomPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="sharedRoomPrice"
          placeholder="Shared Room Price"
          value={form.sharedRoomPrice}
          onChange={handleChange}
          required
        />
        <input
          id="add-hostel-images"
          type="file"
          accept="image/*"
          multiple
          hidden
          style={{display: "none"}}
          onChange={(e) => setImageInputFiles(Array.from(e.target.files))}
        />
        <label htmlFor="add-hostel-images" className="choose-image-btn">
          <span>
            {imageInputFiles.length > 0
              ? `${imageInputFiles.length} image(s) selected`
              :  ""}
              Select Image {" "}
                <FiCamera size={18} />
          </span>
        </label>
        <button type="submit" className="form-submit-btn">
          Add Hostel
        </button>
      </form>

      <h3 className="group-title">All Hostels</h3>
      {hostels.length === 0 ? (
        <p className="empty-state">No hostels added yet.</p>
      ) : (
        <div className="hostels-grid">
          {hostels.map((hostel) => (
            <div className="hostel-admin-card" key={hostel._id}>
              {hostel.images?.length > 0 && (
                <div className="hostel-admin-images">
                  {hostel.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`${hostel.name}-${idx}`}
                      className="hostel-admin-thumb"
                    />
                  ))}
                </div>
              )}
              <h4>{hostel.name}</h4>
              <p>{hostel.city}</p>
              <p className="hostel-address">{hostel.address}</p>
              <p>
                Single: Rs. {hostel.singleRoomPrice} | Shared: Rs.{" "}
                {hostel.sharedRoomPrice}
              </p>

              <p className="assigned-subadmin">
                Sub-admin:{" "}
                {getAssignedSubAdminName(hostel._id) || "Not assigned"}
              </p>

              <div className="hostel-image-upload">
                <input
                  id={`hostel-image-${hostel._id}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setImageFiles({
                        ...imageFiles,
                        [hostel._id]: file,
                      });
                    }
                  }}
                />

                {imageFiles[hostel._id] ? (
                  <>
                    <div className="selected-image-preview">
                      <img
                        src={URL.createObjectURL(imageFiles[hostel._id])}
                        alt="Selected"
                      />
                    </div>
                    <button
                      type="button"
                      className="cancel-image-btn"
                      onClick={() => {
                        setImageFiles({
                          ...imageFiles,
                          [hostel._id]: null,
                        });
                        document.getElementById(
                          `hostel-image-${hostel._id}`,
                        ).value = "";
                      }}
                      title="Remove selected image"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      className="image-upload-submit"
                      onClick={() => handleHostelImageUpload(hostel._id)}
                    >
                      Upload
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor={`hostel-image-${hostel._id}`}
                    className="image-upload-icon"
                    title="Select Image"
                  >
                    <FiCamera size={20} />
                  </label>
                )}
              </div>

              <div className="hostel-card-actions">
                <button onClick={() => openEditModal(hostel)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteHostel(hostel._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Hostel"
      >
        <form className="simple-form" onSubmit={handleUpdateHostel}>
          <input
            type="text"
            name="name"
            placeholder="Hostel Name"
            value={editForm.name}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={editForm.city}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={editForm.address}
            onChange={handleEditChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={editForm.description}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="singleRoomPrice"
            placeholder="Single Room Price"
            value={editForm.singleRoomPrice}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="sharedRoomPrice"
            placeholder="Shared Room Price"
            value={editForm.sharedRoomPrice}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="images"
            placeholder="Image URLs (comma-separated)"
            value={editForm.images}
            onChange={handleEditChange}
          />
          <button type="submit" className="form-submit-btn">
            Update Hostel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HostelsTab;
