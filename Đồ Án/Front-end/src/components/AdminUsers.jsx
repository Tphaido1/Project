import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminUsers = ({ token, user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      if (!token || !user?.isAdmin) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Không thể tải người dùng.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, user]);

  const toggleAdmin = async (userId, isAdmin) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Không thể cập nhật quyền.");
      }

      const updated = await response.json();
      setUsers((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setSuccess("Cập nhật quyền admin thành công.");
      showToast("Cập nhật quyền admin thành công", "success");
    } catch (err) {
      setError(err.message);
    }
  };

  const removeUser = async (userId) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Không thể xóa người dùng.");
      }

      setUsers((prev) => prev.filter((item) => item._id !== userId));
      setSuccess("Xóa người dùng thành công.");
      showToast("Xóa người dùng thành công", "success");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="order-page">
        <p>Bạn cần quyền admin để truy cập trang quản lý người dùng.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Admin - Quản lý người dùng</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {loading ? (
        <p>Đang tải người dùng...</p>
      ) : (
        <div className="order-list">
          {users.map((userItem) => (
            <div className="order-card" key={userItem._id}>
              <h3>{userItem.name}</h3>
              <p>Email: {userItem.email}</p>
              <p>Admin: {userItem.isAdmin ? "Có" : "Không"}</p>
              <div className="admin-actions">
                <button
                  onClick={() => toggleAdmin(userItem._id, userItem.isAdmin)}
                  disabled={userItem._id === user._id}
                >
                  {userItem.isAdmin ? "Thu hồi quyền" : "Cấp quyền admin"}
                </button>
                <button
                  onClick={() => removeUser(userItem._id)}
                  disabled={userItem._id === user._id}
                >
                  Xóa người dùng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
