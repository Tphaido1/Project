import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = ({ token, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      if (!token || !user?.isAdmin) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Không thể tải đơn hàng.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, user]);

  const handleStatusUpdate = async (orderId, status) => {
    setError("");
    setSuccess("");
    setUpdatingId(orderId);

    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Không cập nhật được trạng thái.");
      }

      const updated = await response.json();
      setOrders((prev) => prev.map((order) => (order._id === updated._id ? updated : order)));
      setSuccess("Cập nhật trạng thái thành công.");
      showToast("Cập nhật trạng thái thành công", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Không cập nhật được trạng thái", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="order-page">
        <p>Bạn cần quyền admin để truy cập trang quản lý đơn hàng.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Admin - Quản lý đơn hàng</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order {order._id}</h3>
              <p>Khách hàng: {order.user?.name || "N/A"}</p>
              <p>Email: {order.user?.email || "N/A"}</p>
              <p>Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Tổng: ${order.totalPrice}</p>
              <p>Trạng thái: {order.status}</p>
              <label>
                Cập nhật trạng thái
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  disabled={updatingId === order._id}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <Link to={`/orders/${order._id}`} className="details-link">
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
