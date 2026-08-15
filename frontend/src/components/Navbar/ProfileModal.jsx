import { useState, useRef, useEffect } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import api from "../../services/Api";
import { getUser, setUser } from "../../utils/auth";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { IoCameraOutline } from "react-icons/io5";
import { getImageUrl } from "../../utils/imageUrl";

function ProfileModal({ onClose }) {
  const user = getUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);


    useEffect(() => {
    if (!user) {
      onClose();
      window.location.href = "/login";
    }
  }, []);

  if (!user) {
    return null;
  }

const userId = user._id || user.id;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (showPasswordSection && passwordData.newPassword) {
      if (passwordData.newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (showPasswordSection && passwordData.newPassword) {
        payload.password = passwordData.newPassword;
      }

      await api.put(`/auth/update/${userId}`, payload);
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      setUser(updatedUser);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  const handlePhotoSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploadingPhoto(true);
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    const res = await api.put(`/auth/upload-photo/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedUser = res.data.user;
    setUser(updatedUser);
    window.location.reload();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to upload photo.");
  } finally {
    setUploadingPhoto(false);
  }
};

 return (
    <Modal isOpen={true} onClose={onClose} title="Edit Profile">
      {loading && <Loader text="Updating profile..." />}
      <Error message={error} type="error" />

      {success ? (
        <p className="profile-success">Profile updated successfully!</p>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <div className="avatar-upload-wrapper">
  <div className="avatar-circle">
    {user.profileImage ? (
      <img src={getImageUrl(user.profileImage)} alt="Profile" />
    ) : (
      <span className="avatar-placeholder">
        {user.name?.charAt(0).toUpperCase()}
      </span>
    )}
  </div>

  <button 
    type="button"
    className="avatar-edit-btn"
    onClick={() => fileInputRef.current.click()}
    disabled={uploadingPhoto}
  >
    <IoCameraOutline size={16} />
  </button>

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handlePhotoSelect}
    style={{ display: "none" }}
  />

  {uploadingPhoto && <p className="avatar-uploading-text">Uploading...</p>}
</div>

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. 03001234567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {!showPasswordSection ? (
            <button
              type="button"
              className="toggle-password-link"
              onClick={() => setShowPasswordSection(true)}
            >
              Change Password
            </button>
          ) : (
            <div className="password-section">
              <div className="password-section-header">
                <span>Change Password</span>
                <button
                  type="button"
                  className="cancel-password-link"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({ newPassword: "", confirmPassword: "" });
                  }}
                >
                  Cancel
                </button>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="At least 6 characters"
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
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          )}

          <button type="submit" className="profile-save-btn">
            Save Changes
          </button>
        </form>
      )}
    </Modal>
  );
}

export default ProfileModal;