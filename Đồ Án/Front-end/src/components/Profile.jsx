import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = ({ token }) => {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Không thể tải profile.");
        }

        const data = await response.json();
        setUser(data);
        setProfileForm({
          name: data.name,
          email: data.email,
          currentPassword: "",
          newPassword: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const handleChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thất bại.");
      }

      setUser(data);
      setProfileForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
      setSuccess("Cập nhật profile thành công.");
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="order-page">
        <p>Vui lòng đăng nhập để xem trang cá nhân.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="order-page">Đang tải profile...</div>;
  }

  return (
    <div className="order-page">
      <h2>Trang cá nhân</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {user ? (
        <form className="auth-form" onSubmit={handleUpdate}>
          <label>
            Tên
            <input
              value={profileForm.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </label>
          <label>
            Mật khẩu hiện tại
            <input
              type="password"
              value={profileForm.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
            />
          </label>
          <label>
            Mật khẩu mới
            <input
              type="password"
              value={profileForm.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
            />
          </label>
          <button type="submit">Cập nhật thông tin</button>
        </form>
      ) : (
        <p>Không có dữ liệu người dùng.</p>
      )}
    </div>
  );
};

export default Profile;
