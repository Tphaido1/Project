import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OrderHistory = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Không thể lấy lịch sử đơn hàng.");
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
  }, [token]);

  if (!token) {
    return (
      <div className="order-page">
        <p>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="order-page">Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div className="order-page">
      <h2>Lịch sử đơn hàng</h2>
      {error && <div className="error">{error}</div>}
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order {order._id}</h3>
              <p>Trạng thái: {order.status || "Pending"}</p>
              <p>Ngày: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Tổng tiền: ${order.totalPrice}</p>
              <p>Phương thức thanh toán: {order.paymentMethod}</p>
              <p>Địa chỉ: {order.shippingAddress?.address || "N/A"}</p>
              <ul>
                {order.orderItems.map((item) => (
                  <li key={item.id || item._id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
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

export default OrderHistory;
